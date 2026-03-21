import { GameState } from "./types";

// In-memory game store
// For Vercel serverless: this works in dev and in single-instance deployments.
// For production at scale, swap this for Vercel KV / Upstash Redis.

const games = new Map<string, GameState>();

// Clean up games older than 2 hours
function cleanup() {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const [code, game] of games) {
    if (game.updatedAt < cutoff) {
      games.delete(code);
    }
  }
}

// Run cleanup every 10 minutes
if (typeof globalThis !== "undefined") {
  // Avoid multiple intervals in HMR
  const g = globalThis as unknown as { _unoCleanup?: ReturnType<typeof setInterval> };
  if (!g._unoCleanup) {
    g._unoCleanup = setInterval(cleanup, 10 * 60 * 1000);
  }
}

export function getGame(code: string): GameState | undefined {
  return games.get(code.toUpperCase());
}

export function setGame(game: GameState): void {
  games.set(game.code.toUpperCase(), game);
}

export function deleteGame(code: string): void {
  games.delete(code.toUpperCase());
}

export function hasGame(code: string): boolean {
  return games.has(code.toUpperCase());
}
