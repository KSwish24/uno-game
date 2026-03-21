"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GameClient } from "@/components/GameClient";

function GamePageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = (params.code as string) || "";
  const playerId = searchParams.get("pid") || "";

  if (!code || !playerId) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Missing game code or player ID</p>
          <a href="/" className="text-blue-400 hover:text-blue-300 underline">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return <GameClient code={code} playerId={playerId} />;
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <GamePageInner />
    </Suspense>
  );
}
