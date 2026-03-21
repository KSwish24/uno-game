import { NextResponse } from "next/server";
import { addPlayer } from "@/lib/game-engine";
import { getGame, setGame } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { code, playerName } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Room code is required" }, { status: 400 });
    }
    if (!playerName || typeof playerName !== "string" || playerName.trim().length === 0) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    const game = getGame(code.toUpperCase());
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const playerId = crypto.randomUUID();
    const err = addPlayer(game, playerId, playerName.trim());
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    setGame(game);

    return NextResponse.json({
      code: game.code,
      playerId,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
