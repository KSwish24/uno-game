"use client";

import { useState, useMemo } from "react";
import { Card, Color, PlayerView } from "@/lib/types";
import { UnoCard, CardBack } from "./UnoCard";
import { ColorPicker } from "./ColorPicker";

const COLOR_BG: Record<string, string> = {
  red: "from-red-900/30 to-gray-950",
  blue: "from-blue-900/30 to-gray-950",
  green: "from-green-900/30 to-gray-950",
  yellow: "from-yellow-900/20 to-gray-950",
};

const COLOR_RING: Record<string, string> = {
  red: "ring-red-500/60",
  blue: "ring-blue-500/60",
  green: "ring-green-500/60",
  yellow: "ring-yellow-400/60",
};

interface GameBoardProps {
  game: PlayerView;
  onPlayCard: (cardId: string, color?: Color) => void;
  onDrawCard: () => void;
  onCallUno: () => void;
  error: string | null;
}

export function GameBoard({ game, onPlayCard, onDrawCard, onCallUno, error }: GameBoardProps) {
  const [pendingWild, setPendingWild] = useState<string | null>(null);

  const isMyTurn = game.players[game.currentPlayerIndex]?.id === game.myId;
  const currentPlayer = game.players[game.currentPlayerIndex];
  const myPlayer = game.players.find((p) => p.id === game.myId);
  const showUnoButton = myPlayer && myPlayer.cardCount <= 2 && !myPlayer.calledUno && isMyTurn;

  // Determine which cards are playable
  const playableCardIds = useMemo(() => {
    if (!isMyTurn || game.mustDraw > 0) return new Set<string>();
    const set = new Set<string>();
    for (const card of game.myHand) {
      if (canPlay(card, game)) set.add(card.id);
    }
    return set;
  }, [game, isMyTurn]);

  // Other players (excluding me) in display order
  const otherPlayers = useMemo(() => {
    const myIdx = game.players.findIndex((p) => p.id === game.myId);
    const others = [];
    for (let i = 1; i < game.players.length; i++) {
      others.push(game.players[(myIdx + i) % game.players.length]);
    }
    return others;
  }, [game.players, game.myId]);

  function handleCardClick(card: Card) {
    if (!isMyTurn || !playableCardIds.has(card.id)) return;
    if (card.type === "wild" || card.type === "wild4") {
      setPendingWild(card.id);
    } else {
      onPlayCard(card.id);
    }
  }

  function handleColorPick(color: Color) {
    if (pendingWild) {
      onPlayCard(pendingWild, color);
      setPendingWild(null);
    }
  }

  const bgGradient = game.currentColor ? COLOR_BG[game.currentColor] : "from-gray-900 to-gray-950";

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} flex flex-col transition-colors duration-500`}>
      {/* Color picker modal */}
      {pendingWild && <ColorPicker onPick={handleColorPick} />}

      {/* Game Over overlay */}
      {game.status === "finished" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
            <div className="text-5xl mb-4">
              {game.winner === game.myId ? "\uD83C\uDFC6" : "\uD83D\uDC4F"}
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              {game.winner === game.myId ? "You Win!" : `${game.players.find(p => p.id === game.winner)?.name} Wins!`}
            </h2>
            <p className="text-gray-400 mb-6">
              {game.winner === game.myId ? "Congratulations!" : "Better luck next time!"}
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:from-red-500 hover:to-orange-400 transition-all"
            >
              Play Again
            </a>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-6 sm:py-3 bg-black/30">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Room</span>
          <span className="text-white font-bold tracking-widest">{game.code}</span>
        </div>
        <div className="flex items-center gap-2">
          {game.direction === 1 ? (
            <span className="text-gray-400 text-sm">\u27F3 Clockwise</span>
          ) : (
            <span className="text-gray-400 text-sm">\u27F2 Counter-clockwise</span>
          )}
        </div>
      </div>

      {/* Other players */}
      <div className="flex justify-center gap-4 sm:gap-8 px-2 py-3">
        {otherPlayers.map((p) => {
          const isActive = game.players[game.currentPlayerIndex]?.id === p.id;
          return (
            <div
              key={p.id}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive ? "bg-white/10 ring-2 ring-white/30 scale-105" : ""
              }`}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: Math.min(p.cardCount, 7) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-9 sm:w-7 sm:h-10 bg-gray-800 border border-gray-600 rounded-md"
                    style={{ marginLeft: i > 0 ? "-8px" : "0" }}
                  />
                ))}
                {p.cardCount > 7 && (
                  <span className="text-gray-400 text-xs ml-1">+{p.cardCount - 7}</span>
                )}
              </div>
              <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-400"}`}>
                {p.name}
              </span>
              <span className="text-xs text-gray-500">{p.cardCount} cards</span>
              {p.calledUno && p.cardCount <= 2 && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                  UNO!
                </span>
              )}
              {!p.connected && (
                <span className="text-xs text-red-400">Disconnected</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Center play area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-2">
        {/* Turn indicator */}
        <div className="text-center">
          {game.status === "finished" ? (
            <p className="text-2xl font-black text-yellow-400 animate-pulse">
              {game.players.find((p) => p.id === game.winner)?.name} wins!
            </p>
          ) : isMyTurn ? (
            <p className="text-lg font-bold text-green-400">Your turn!</p>
          ) : (
            <p className="text-lg font-medium text-gray-400">
              {currentPlayer?.name}&apos;s turn
            </p>
          )}
        </div>

        {/* Must draw indicator */}
        {isMyTurn && game.mustDraw > 0 && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-2">
            <p className="text-red-400 font-bold text-sm">
              You must draw {game.mustDraw} cards! Click the deck.
            </p>
          </div>
        )}

        {/* Discard pile + Draw deck */}
        <div className="flex items-center gap-6 sm:gap-10">
          {/* Draw deck */}
          <div className="flex flex-col items-center gap-1">
            <CardBack
              onClick={isMyTurn ? onDrawCard : undefined}
            />
            <span className="text-gray-500 text-xs">{game.deckCount} left</span>
            {isMyTurn && (
              <span className="text-green-400 text-xs font-medium">Click to draw</span>
            )}
          </div>

          {/* Discard pile */}
          <div className="flex flex-col items-center gap-1">
            {game.topCard ? (
              <div className={`rounded-xl ring-4 ${game.currentColor ? COLOR_RING[game.currentColor] : "ring-gray-600"} transition-all`}>
                <UnoCard card={game.topCard} currentColor={game.currentColor} />
              </div>
            ) : (
              <div className="w-[80px] h-[116px] rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center">
                <span className="text-gray-600 text-xs">Empty</span>
              </div>
            )}
            {game.currentColor && (
              <span className={`text-xs font-bold capitalize ${
                game.currentColor === "red" ? "text-red-400" :
                game.currentColor === "blue" ? "text-blue-400" :
                game.currentColor === "green" ? "text-green-400" :
                "text-yellow-400"
              }`}>
                {game.currentColor}
              </span>
            )}
          </div>
        </div>

        {/* Last action */}
        {game.lastAction && (
          <p className="text-gray-400 text-sm text-center px-4 max-w-md">
            {game.lastAction}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* UNO button */}
      {showUnoButton && (
        <div className="flex justify-center pb-2">
          <button
            onClick={onCallUno}
            className="bg-red-600 hover:bg-red-500 text-white font-black text-xl px-8 py-3 rounded-2xl shadow-lg shadow-red-600/30 hover:shadow-red-500/40 transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            UNO!
          </button>
        </div>
      )}

      {/* My hand */}
      <div className="bg-black/40 border-t border-gray-800 px-2 py-3 sm:px-4 sm:py-4">
        <div className="flex justify-center">
          <div className="flex overflow-x-auto pb-2 max-w-full" style={{ scrollbarWidth: "thin", gap: game.myHand.length > 10 ? "0" : "4px" }}>
            {game.myHand.map((card, idx) => (
              <div
                key={card.id}
                className="flex-shrink-0 transition-transform"
                style={{ marginLeft: idx > 0 && game.myHand.length > 10 ? "-16px" : idx > 0 && game.myHand.length > 7 ? "-8px" : "0" }}
              >
                <UnoCard
                  card={card}
                  playable={playableCardIds.has(card.id)}
                  onClick={playableCardIds.has(card.id) ? () => handleCardClick(card) : undefined}
                />
              </div>
            ))}
          </div>
        </div>
        {myPlayer && (
          <div className="text-center mt-1">
            <span className="text-gray-500 text-xs">{myPlayer.name} &middot; {game.myHand.length} cards</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Client-side playability check (mirrors server logic for immediate feedback)
function canPlay(card: Card, game: PlayerView): boolean {
  if (game.mustDraw > 0) return false;
  if (card.type === "wild" || card.type === "wild4") return true;
  if (!game.topCard) return true;
  if (card.color === game.currentColor) return true;
  if (card.type === "number" && game.topCard.type === "number" && card.value === game.topCard.value) return true;
  if (card.type !== "number" && card.type === game.topCard.type) return true;
  return false;
}
