import {
  Card,
  Color,
  GameState,
  Player,
  PlayerView,
  Direction,
} from "./types";

// ----- Deck Creation -----

let cardIdCounter = 0;

function makeCard(
  color: Card["color"],
  type: Card["type"],
  value?: number
): Card {
  return {
    id: `${color}-${type}-${value ?? "x"}-${cardIdCounter++}`,
    color,
    type,
    ...(value !== undefined && { value }),
  };
}

export function createDeck(): Card[] {
  cardIdCounter = 0;
  const colors: Color[] = ["red", "blue", "green", "yellow"];
  const cards: Card[] = [];

  for (const color of colors) {
    // One 0 per color
    cards.push(makeCard(color, "number", 0));
    // Two of each 1-9
    for (let n = 1; n <= 9; n++) {
      cards.push(makeCard(color, "number", n));
      cards.push(makeCard(color, "number", n));
    }
    // Two skip, reverse, draw2
    for (let i = 0; i < 2; i++) {
      cards.push(makeCard(color, "skip"));
      cards.push(makeCard(color, "reverse"));
      cards.push(makeCard(color, "draw2"));
    }
  }

  // 4 wild and 4 wild draw four
  for (let i = 0; i < 4; i++) {
    cards.push(makeCard("wild", "wild"));
    cards.push(makeCard("wild", "wild4"));
  }

  return cards; // 108 cards
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ----- Game Creation -----

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I or O to avoid confusion
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function createGame(hostId: string, hostName: string): GameState {
  return {
    code: generateRoomCode(),
    hostId,
    players: [
      {
        id: hostId,
        name: hostName,
        hand: [],
        calledUno: false,
        connected: true,
      },
    ],
    status: "lobby",
    deck: [],
    discardPile: [],
    currentPlayerIndex: 0,
    direction: 1,
    currentColor: null,
    winner: null,
    lastAction: null,
    lastActionTime: Date.now(),
    mustDraw: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    gamesToWin: 1,
    wins: {},
    matchWinner: null,
  };
}

export function addPlayer(game: GameState, id: string, name: string): string | null {
  if (game.status !== "lobby") {
    // Check if this is a rejoin
    const existing = game.players.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      existing.id = id;
      existing.connected = true;
      game.updatedAt = Date.now();
      return null;
    }
    return "Game already in progress";
  }
  if (game.players.length >= 4) return "Game is full (max 4 players)";
  if (game.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    return "Name already taken";
  }

  game.players.push({
    id,
    name,
    hand: [],
    calledUno: false,
    connected: true,
  });
  game.updatedAt = Date.now();
  return null;
}

// ----- Game Start -----

export function startGame(game: GameState, requesterId: string): string | null {
  if (game.hostId !== requesterId) return "Only the host can start the game";
  if (game.players.length < 2) return "Need at least 2 players";
  if (game.status !== "lobby") return "Game already started";

  let deck = shuffle(createDeck());

  // Deal 7 cards to each player
  for (const player of game.players) {
    player.hand = deck.splice(0, 7);
    player.calledUno = false;
  }

  // Find a non-wild starting card
  let startIdx = deck.findIndex(
    (c) => c.type === "number"
  );
  if (startIdx === -1) startIdx = 0;
  const startCard = deck.splice(startIdx, 1)[0];

  game.deck = deck;
  game.discardPile = [startCard];
  game.currentColor = startCard.color === "wild" ? "red" : startCard.color as Color;
  game.currentPlayerIndex = 0;
  game.direction = 1;
  game.status = "playing";
  game.mustDraw = 0;
  game.winner = null;
  game.lastAction = "Game started!";
  game.lastActionTime = Date.now();
  game.updatedAt = Date.now();

  return null;
}

// ----- Card Playability -----

export function canPlayCard(game: GameState, card: Card): boolean {
  if (game.mustDraw > 0) return false; // must draw first
  const topCard = game.discardPile[game.discardPile.length - 1];
  if (!topCard) return true;

  // Wild cards can always be played
  if (card.type === "wild" || card.type === "wild4") return true;

  // Match color
  if (card.color === game.currentColor) return true;

  // Match number/type
  if (card.type === "number" && topCard.type === "number" && card.value === topCard.value)
    return true;
  if (card.type !== "number" && card.type === topCard.type) return true;

  return false;
}

export function hasPlayableCard(game: GameState, player: Player): boolean {
  if (game.mustDraw > 0) return false;
  return player.hand.some((c) => canPlayCard(game, c));
}

// ----- Play Card -----

export function playCard(
  game: GameState,
  playerId: string,
  cardId: string,
  chosenColor?: Color
): string | null {
  if (game.status !== "playing") return "Game is not in progress";

  const currentPlayer = game.players[game.currentPlayerIndex];
  if (currentPlayer.id !== playerId) return "Not your turn";

  if (game.mustDraw > 0) return "You must draw cards first";

  const cardIdx = currentPlayer.hand.findIndex((c) => c.id === cardId);
  if (cardIdx === -1) return "Card not in your hand";

  const card = currentPlayer.hand[cardIdx];
  if (!canPlayCard(game, card)) return "Cannot play this card";

  // UNO check: if playing second-to-last card, must have called UNO
  if (currentPlayer.hand.length === 2 && !currentPlayer.calledUno) {
    // Penalty: draw 2 cards
    drawCards(game, currentPlayer, 2);
    game.lastAction = `${currentPlayer.name} forgot to call UNO! Drew 2 penalty cards.`;
    game.lastActionTime = Date.now();
    game.updatedAt = Date.now();
    // Still allow the play to go through after penalty
  }

  // Remove card from hand
  currentPlayer.hand.splice(cardIdx, 1);
  game.discardPile.push(card);

  // Handle wild color choice
  if (card.type === "wild" || card.type === "wild4") {
    if (!chosenColor) return "Must choose a color for wild card";
    game.currentColor = chosenColor;
  } else {
    game.currentColor = card.color as Color;
  }

  game.lastAction = `${currentPlayer.name} played ${cardDisplayName(card)}`;

  // Check win
  if (currentPlayer.hand.length === 0) {
    game.status = "finished";
    game.winner = currentPlayer.id;
    game.lastAction = `${currentPlayer.name} wins!`;
    game.lastActionTime = Date.now();
    game.updatedAt = Date.now();
    return null;
  }

  // Reset UNO call for this player
  currentPlayer.calledUno = false;

  // Apply card effects
  applyCardEffect(game, card);

  game.lastActionTime = Date.now();
  game.updatedAt = Date.now();
  return null;
}

function applyCardEffect(game: GameState, card: Card) {
  const n = game.players.length;

  switch (card.type) {
    case "skip":
      // Skip next player
      advanceTurn(game);
      game.lastAction += ` — ${game.players[game.currentPlayerIndex].name} skipped!`;
      advanceTurn(game);
      break;

    case "reverse":
      if (n === 2) {
        // In 2-player, reverse acts like skip
        advanceTurn(game);
        game.lastAction += " — reversed!";
        advanceTurn(game);
      } else {
        game.direction = (game.direction * -1) as Direction;
        game.lastAction += " — reversed!";
        advanceTurn(game);
      }
      break;

    case "draw2":
      advanceTurn(game);
      game.mustDraw = 2;
      game.lastAction += ` — ${game.players[game.currentPlayerIndex].name} must draw 2!`;
      break;

    case "wild4":
      advanceTurn(game);
      game.mustDraw = 4;
      game.lastAction += ` — ${game.players[game.currentPlayerIndex].name} must draw 4!`;
      break;

    default:
      advanceTurn(game);
      break;
  }
}

function advanceTurn(game: GameState) {
  const n = game.players.length;
  game.currentPlayerIndex =
    (game.currentPlayerIndex + game.direction + n) % n;
}

// ----- Draw Cards -----

function recycleDiscard(game: GameState) {
  if (game.discardPile.length <= 1) return;
  const top = game.discardPile.pop()!;
  game.deck = shuffle(game.discardPile);
  game.discardPile = [top];
}

function drawCards(game: GameState, player: Player, count: number) {
  for (let i = 0; i < count; i++) {
    if (game.deck.length === 0) recycleDiscard(game);
    if (game.deck.length === 0) break; // truly no cards left
    player.hand.push(game.deck.pop()!);
  }
}

export function drawCard(
  game: GameState,
  playerId: string
): string | null {
  if (game.status !== "playing") return "Game is not in progress";

  const currentPlayer = game.players[game.currentPlayerIndex];
  if (currentPlayer.id !== playerId) return "Not your turn";

  // Always draw exactly 1 card
  drawCards(game, currentPlayer, 1);
  game.lastAction = `${currentPlayer.name} drew a card`;
  game.mustDraw = 0;

  // Check if the last drawn card is playable
  const drawnCard = currentPlayer.hand[currentPlayer.hand.length - 1];
  if (!canPlayCard(game, drawnCard)) {
    advanceTurn(game);
    game.lastAction += " and passed";
  } else {
    // Stay on their turn — can play the drawn card
    game.lastAction += " (can play it)";
  }

  currentPlayer.calledUno = false;
  game.lastActionTime = Date.now();
  game.updatedAt = Date.now();
  return null;
}

// ----- UNO Call -----

export function callUno(
  game: GameState,
  playerId: string
): string | null {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) return "Player not found";
  if (player.hand.length > 2) return "You can only call UNO with 2 or fewer cards";
  player.calledUno = true;
  game.lastAction = `${player.name} called UNO!`;
  game.lastActionTime = Date.now();
  game.updatedAt = Date.now();
  return null;
}

// ----- Player View -----

export function getPlayerView(
  game: GameState,
  playerId: string
): PlayerView {
  const me = game.players.find((p) => p.id === playerId);
  return {
    code: game.code,
    hostId: game.hostId,
    players: game.players.map((p) => ({
      id: p.id,
      name: p.name,
      cardCount: p.hand.length,
      calledUno: p.calledUno,
      connected: p.connected,
    })),
    status: game.status,
    myHand: me?.hand ?? [],
    myId: playerId,
    topCard:
      game.discardPile.length > 0
        ? game.discardPile[game.discardPile.length - 1]
        : null,
    currentColor: game.currentColor,
    currentPlayerIndex: game.currentPlayerIndex,
    direction: game.direction,
    winner: game.winner,
    lastAction: game.lastAction,
    lastActionTime: game.lastActionTime,
    mustDraw: game.mustDraw,
    deckCount: game.deck.length,
    updatedAt: game.updatedAt,
    gamesToWin: game.gamesToWin || 1,
    wins: game.wins || {},
    matchWinner: game.matchWinner || null,
  };
}

// ----- Helpers -----

function cardDisplayName(card: Card): string {
  if (card.type === "wild") return "Wild";
  if (card.type === "wild4") return "Wild Draw Four";
  const colorName = card.color.charAt(0).toUpperCase() + card.color.slice(1);
  if (card.type === "number") return `${colorName} ${card.value}`;
  if (card.type === "skip") return `${colorName} Skip`;
  if (card.type === "reverse") return `${colorName} Reverse`;
  if (card.type === "draw2") return `${colorName} Draw Two`;
  return `${colorName} ${card.type}`;
}
