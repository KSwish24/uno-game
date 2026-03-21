import { NextResponse } from "next/server";
import { getPlayerView } from "@/lib/game-engine";
import { getGame } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const playerId = searchParams.get("playerId");

  if (!code || !playerId) {
    return NextResponse.json(
      { error: "code and playerId are required" },
      { status: 400 }
    );
  }

  const game = getGame(code);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return NextResponse.json({ error: "Player not in this game" }, { status: 403 });
  }

  // Mark player as connected
  player.connected = true;

  const view = getPlayerView(game, playerId);
  return NextResponse.json(view);
}
