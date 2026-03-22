import { Redis } from "@upstash/redis";
import { GameState } from "./types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY_PREFIX = "uno:game:";
const TTL = 2 * 60 * 60; // 2 hours

export async function getGame(code: string): Promise<GameState | null> {
  const data = await redis.get<GameState>(KEY_PREFIX + code.toUpperCase());
  return data || null;
}

export async function setGame(game: GameState): Promise<void> {
  game.updatedAt = Date.now();
  await redis.set(KEY_PREFIX + game.code.toUpperCase(), game, { ex: TTL });
}

export async function deleteGame(code: string): Promise<void> {
  await redis.del(KEY_PREFIX + code.toUpperCase());
}

export async function hasGame(code: string): Promise<boolean> {
  const exists = await redis.exists(KEY_PREFIX + code.toUpperCase());
  return exists === 1;
}
