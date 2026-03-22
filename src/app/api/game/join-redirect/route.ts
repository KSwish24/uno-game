import { NextRequest, NextResponse } from "next/server";
import { getGame, setGame } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const playerName = formData.get("playerName") as string;
    const code = (formData.get("code") as string)?.toUpperCase().trim();

    if (!playerName?.trim() || !code) {
      return NextResponse.redirect(new URL("/join?error=missing", request.url));
    }

    const game = await getGame(code);
    if (!game) {
      return NextResponse.redirect(new URL("/join?error=notfound", request.url));
    }
    if (game.status !== "lobby") {
      return NextResponse.redirect(new URL("/join?error=started", request.url));
    }
    if (game.players.length >= 4) {
      return NextResponse.redirect(new URL("/join?error=full", request.url));
    }

    // Check if rejoining
    const existing = game.players.find(p => p.name.toLowerCase() === playerName.trim().toLowerCase());
    if (existing) {
      return NextResponse.redirect(new URL(`/game/${code}?pid=${existing.id}`, request.url));
    }

    const playerId = crypto.randomUUID();
    game.players.push({
      id: playerId,
      name: playerName.trim(),
      hand: [],
      calledUno: false,
      connected: true,
    });
    await setGame(game);

    return NextResponse.redirect(new URL(`/game/${code}?pid=${playerId}`, request.url));
  } catch {
    return NextResponse.redirect(new URL("/join?error=unknown", request.url));
  }
}
