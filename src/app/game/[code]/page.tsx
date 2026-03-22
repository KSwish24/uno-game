import { GameClient } from "@/components/GameClient";

export default async function GamePage({ params, searchParams }: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ pid?: string }>;
}) {
  const { code } = await params;
  const { pid } = await searchParams;

  if (!code || !pid) {
    return (
      <div style={{
        minHeight: "100vh", background: "#030712", display: "flex",
        alignItems: "center", justifyContent: "center", color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#f87171", fontSize: "18px", marginBottom: "16px" }}>Missing game code or player ID</p>
          <a href="/" style={{ color: "#60a5fa" }}>Back to home</a>
        </div>
      </div>
    );
  }

  return <GameClient code={code} playerId={pid} />;
}
