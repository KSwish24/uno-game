import { NextResponse } from "next/server";
import { playCard } from "@/lib/game-engine";
import { getGame, setGame } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { code, playerId, cardId, chosenColor } = await request.json();

    const game = getGame(code);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const err = playCard(game, playerId, cardId, chosenColor);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    setGame(game);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
