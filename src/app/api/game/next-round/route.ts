import { NextResponse } from "next/server";
import { createDeck, shuffle } from "@/lib/game-engine";
import { getGame, setGame } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { code, playerId } = await request.json();

    const game = await getGame(code);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (game.status !== "finished") {
      return NextResponse.json({ error: "Round is not over yet" }, { status: 400 });
    }

    if (playerId !== game.hostId) {
      return NextResponse.json({ error: "Only the host can start the next round" }, { status: 403 });
    }

    if (game.matchWinner) {
      return NextResponse.json({ error: "Match is over" }, { status: 400 });
    }

    // Reset for next round — keep players, wins, gamesToWin
    game.status = "lobby";
    game.deck = shuffle(createDeck());
    game.discardPile = [];
    game.currentPlayerIndex = 0;
    game.direction = 1;
    game.currentColor = null;
    game.winner = null;
    game.lastAction = "Starting next round...";
    game.lastActionTime = Date.now();
    game.mustDraw = 0;
    for (const p of game.players) {
      p.hand = [];
      p.calledUno = false;
    }
    game.updatedAt = Date.now();

    await setGame(game);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
