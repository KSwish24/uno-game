import { Color, PlayerView } from "./types";

const BASE = "";

export async function createGame(playerName: string): Promise<{ code: string; playerId: string }> {
  const res = await fetch(`${BASE}/api/game/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create game");
  return data;
}

export async function joinGame(code: string, playerName: string): Promise<{ code: string; playerId: string }> {
  const res = await fetch(`${BASE}/api/game/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, playerName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to join game");
  return data;
}

export async function getGameState(code: string, playerId: string): Promise<PlayerView> {
  const res = await fetch(`${BASE}/api/game/state?code=${encodeURIComponent(code)}&playerId=${encodeURIComponent(playerId)}`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get game state");
  return data;
}

export async function startGame(code: string, playerId: string): Promise<void> {
  const res = await fetch(`${BASE}/api/game/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, playerId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to start game");
}

export async function playCard(code: string, playerId: string, cardId: string, chosenColor?: Color): Promise<void> {
  const res = await fetch(`${BASE}/api/game/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, playerId, cardId, chosenColor }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to play card");
}

export async function drawCard(code: string, playerId: string): Promise<void> {
  const res = await fetch(`${BASE}/api/game/draw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, playerId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to draw card");
}

export async function callUno(code: string, playerId: string): Promise<void> {
  const res = await fetch(`${BASE}/api/game/uno`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, playerId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to call UNO");
}
