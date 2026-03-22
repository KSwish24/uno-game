import { NextRequest, NextResponse } from "next/server";
import { setGame, hasGame } from "@/lib/store";
import { createDeck, shuffle } from "@/lib/game-engine";

export const dynamic = "force-dynamic";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const playerName = formData.get("playerName") as string;

    if (!playerName?.trim()) {
      return NextResponse.redirect(new URL("/create?error=missing", request.url));
    }

    let code = generateCode();
    while (await hasGame(code)) code = generateCode();

    const playerId = crypto.randomUUID();
    await setGame({
      code,
      status: "lobby",
      players: [{
        id: playerId,
        name: playerName.trim(),
        hand: [],
        calledUno: false,
        connected: true,
      }],
      hostId: playerId,
      deck: shuffle(createDeck()),
      discardPile: [],
      currentPlayerIndex: 0,
      direction: 1,
      currentColor: null,
      mustDraw: 0,
      winner: null,
      lastAction: null,
      lastActionTime: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return NextResponse.redirect(new URL(`/game/${code}?pid=${playerId}`, request.url));
  } catch {
    return NextResponse.redirect(new URL("/create?error=unknown", request.url));
  }
}
