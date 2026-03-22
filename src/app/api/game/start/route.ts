import { NextResponse } from "next/server";
import { startGame } from "@/lib/game-engine";
import { getGame, setGame } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, playerId, gamesToWin } = body;

    const game = await getGame(code);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Set gamesToWin if provided (only before first round)
    if (gamesToWin && game.status === "lobby" && !game.wins) {
      game.gamesToWin = gamesToWin;
    }
    if (gamesToWin && game.status === "lobby") {
      game.gamesToWin = gamesToWin;
    }

    // Initialize wins if not set
    if (!game.wins) game.wins = {};
    for (const p of game.players) {
      if (game.wins[p.id] === undefined) game.wins[p.id] = 0;
    }

    const err = startGame(game, playerId);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    // Reset round-specific state for new rounds
    game.matchWinner = null;

    await setGame(game);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
