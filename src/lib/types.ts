export type Color = "red" | "blue" | "green" | "yellow";
export type WildColor = Color | null;

export type CardType =
  | "number"
  | "skip"
  | "reverse"
  | "draw2"
  | "wild"
  | "wild4";

export interface Card {
  id: string;
  color: Color | "wild";
  type: CardType;
  value?: number; // 0-9 for number cards
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  calledUno: boolean;
  connected: boolean;
}

export type GameStatus = "lobby" | "playing" | "finished";
export type Direction = 1 | -1;

export interface GameState {
  code: string;
  hostId: string;
  players: Player[];
  status: GameStatus;
  deck: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  direction: Direction;
  currentColor: Color | null;
  winner: string | null; // round winner
  lastAction: string | null;
  lastActionTime: number;
  mustDraw: number;
  createdAt: number;
  updatedAt: number;
  gamesToWin: number; // how many rounds to win the match (default 1)
  wins: Record<string, number>; // playerId -> win count
  matchWinner: string | null; // player who reached gamesToWin
}

// What a specific player sees (hides other players' cards)
export interface PlayerView {
  code: string;
  hostId: string;
  players: {
    id: string;
    name: string;
    cardCount: number;
    calledUno: boolean;
    connected: boolean;
  }[];
  status: GameStatus;
  myHand: Card[];
  myId: string;
  topCard: Card | null;
  currentColor: Color | null;
  currentPlayerIndex: number;
  direction: Direction;
  winner: string | null;
  lastAction: string | null;
  lastActionTime: number;
  mustDraw: number;
  deckCount: number;
  updatedAt: number;
  gamesToWin: number;
  wins: Record<string, number>;
  matchWinner: string | null;
}
