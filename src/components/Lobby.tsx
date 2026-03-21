"use client";

import { PlayerView } from "@/lib/types";

interface LobbyProps {
  game: PlayerView;
  onStart: () => void;
  error: string | null;
}

export function Lobby({ game, onStart, error }: LobbyProps) {
  const isHost = game.myId === game.hostId;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
        {/* Room Code */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Room Code</p>
          <p className="text-5xl sm:text-6xl font-black text-white tracking-widest">
            {game.code}
          </p>
          <p className="text-gray-500 text-xs mt-2">Share this code with friends to join</p>
        </div>

        {/* Players */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">
            Players ({game.players.length}/4)
          </p>
          <div className="space-y-2">
            {game.players.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3"
              >
                <div className={`w-3 h-3 rounded-full ${p.connected ? "bg-green-500" : "bg-gray-600"}`} />
                <span className="text-white font-medium flex-1">{p.name}</span>
                {p.id === game.hostId && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                    HOST
                  </span>
                )}
                {p.id === game.myId && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                    YOU
                  </span>
                )}
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: 4 - game.players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 bg-gray-800/40 border border-dashed border-gray-700 rounded-xl px-4 py-3"
              >
                <div className="w-3 h-3 rounded-full bg-gray-700" />
                <span className="text-gray-600 font-medium">Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Start Button */}
        {isHost ? (
          <button
            onClick={onStart}
            disabled={game.players.length < 2}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
              game.players.length >= 2
                ? "bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/20"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            {game.players.length < 2 ? "Waiting for players..." : "Start Game"}
          </button>
        ) : (
          <div className="text-center py-3">
            <p className="text-gray-400">Waiting for host to start the game...</p>
            <div className="flex justify-center gap-1 mt-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
