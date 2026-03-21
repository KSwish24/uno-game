"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Color, PlayerView } from "@/lib/types";
import * as api from "@/lib/api";
import { Lobby } from "./Lobby";
import { GameBoard } from "./GameBoard";

interface GameClientProps {
  code: string;
  playerId: string;
}

export function GameClient({ code, playerId }: GameClientProps) {
  const [game, setGame] = useState<PlayerView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const lastUpdatedAt = useRef(0);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const state = await api.getGameState(code, playerId);
      // Only update if state actually changed
      if (state.updatedAt !== lastUpdatedAt.current) {
        setGame(state);
        lastUpdatedAt.current = state.updatedAt;
      }
      setLoading(false);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Connection error";
      // Don't show transient errors, just keep polling
      console.error("Poll error:", message);
      setLoading(false);
    }
  }, [code, playerId]);

  // Polling
  useEffect(() => {
    let active = true;

    async function poll() {
      if (!active) return;
      await fetchState();
      if (active) {
        pollRef.current = setTimeout(poll, 600);
      }
    }

    poll();

    return () => {
      active = false;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [fetchState]);

  const handleStart = useCallback(async () => {
    try {
      setError(null);
      await api.startGame(code, playerId);
      await fetchState();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start game");
    }
  }, [code, playerId, fetchState]);

  const handlePlayCard = useCallback(
    async (cardId: string, chosenColor?: Color) => {
      try {
        setError(null);
        await api.playCard(code, playerId, cardId, chosenColor);
        await fetchState();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to play card");
      }
    },
    [code, playerId, fetchState]
  );

  const handleDraw = useCallback(async () => {
    try {
      setError(null);
      await api.drawCard(code, playerId);
      await fetchState();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to draw card");
    }
  }, [code, playerId, fetchState]);

  const handleUno = useCallback(async () => {
    try {
      setError(null);
      await api.callUno(code, playerId);
      await fetchState();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to call UNO");
    }
  }, [code, playerId, fetchState]);

  if (loading && !game) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Connecting to game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Could not connect to game</p>
          <a href="/" className="text-blue-400 hover:text-blue-300 underline">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  if (game.status === "lobby") {
    return <Lobby game={game} onStart={handleStart} error={error} />;
  }

  return (
    <GameBoard
      game={game}
      onPlayCard={handlePlayCard}
      onDrawCard={handleDraw}
      onCallUno={handleUno}
      error={error}
    />
  );
}
