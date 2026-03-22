import { NextResponse } from "next/server";
import { createGame } from "@/lib/game-engine";
import { setGame, hasGame } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { playerName } = await request.json();

    if (!playerName || typeof playerName !== "string" || playerName.trim().length === 0) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    const playerId = crypto.randomUUID();
    const game = createGame(playerId, playerName.trim());

    // Ensure unique code
    let attempts = 0;
    while (await hasGame(game.code) && attempts < 20) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      game.code = "";
      for (let i = 0; i < 4; i++) {
        game.code += chars[Math.floor(Math.random() * chars.length)];
      }
      attempts++;
    }

    await setGame(game);

    return NextResponse.json({
      code: game.code,
      playerId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Create game error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
