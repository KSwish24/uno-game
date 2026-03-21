"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!playerName.trim()) {
      setError("Enter your name");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { code, playerId } = await api.createGame(playerName.trim());
      router.push(`/game/${code}?pid=${playerId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create game");
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!playerName.trim()) {
      setError("Enter your name");
      return;
    }
    if (!roomCode.trim() || roomCode.trim().length !== 4) {
      setError("Enter a 4-letter room code");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { code, playerId } = await api.joinGame(roomCode.trim().toUpperCase(), playerName.trim());
      router.push(`/game/${code}?pid=${playerId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to join game");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      {/* Logo / Title */}
      <div className="text-center mb-10">
        <h1 className="text-6xl sm:text-8xl font-black tracking-tight">
          <span className="text-red-500">U</span>
          <span className="text-blue-500">N</span>
          <span className="text-green-500">O</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm tracking-widest uppercase">
          Multiplayer Card Game
        </p>
      </div>

      <div className="w-full max-w-sm">
        {mode === "menu" && (
          <div className="space-y-3">
            <button
              onClick={() => setMode("create")}
              onTouchEnd={(e) => { e.preventDefault(); setMode("create"); }}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
            >
              Create Game
            </button>
            <button
              onClick={() => setMode("join")}
              onTouchEnd={(e) => { e.preventDefault(); setMode("join"); }}
              className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
            >
              Join Game
            </button>
          </div>
        )}

        {mode === "create" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white text-xl font-bold">Create a Game</h2>
            <div>
              <label className="text-gray-400 text-sm block mb-1">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Enter your name"
                maxLength={16}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setMode("menu"); setError(null); }}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}

        {mode === "join" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white text-xl font-bold">Join a Game</h2>
            <div>
              <label className="text-gray-400 text-sm block mb-1">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                maxLength={16}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="ABCD"
                maxLength={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold tracking-[0.3em] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setMode("menu"); setError(null); }}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleJoin}
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Joining..." : "Join"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-gray-700 text-xs mt-12">
        2-4 players &middot; Share the room code to play together
      </p>
    </div>
  );
}
