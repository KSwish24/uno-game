import { NextResponse } from "next/server";
import { callUno } from "@/lib/game-engine";
import { getGame, setGame } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { code, playerId } = await request.json();

    const game = await getGame(code);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const err = callUno(game, playerId);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    await setGame(game);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
