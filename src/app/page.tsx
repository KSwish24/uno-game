import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "72px", fontWeight: 900, letterSpacing: "-2px", margin: 0 }}>
          <span style={{ color: "#ef4444" }}>U</span>
          <span style={{ color: "#3b82f6" }}>N</span>
          <span style={{ color: "#22c55e" }}>O</span>
        </h1>
        <p style={{ color: "#6b7280", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase" as const, marginTop: "8px" }}>
          Multiplayer Card Game
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column" as const, gap: "12px" }}>
        <Link
          href="/create"
          style={{
            display: "block",
            textAlign: "center",
            padding: "16px",
            background: "linear-gradient(to right, #dc2626, #f97316)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "18px",
            borderRadius: "16px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
          }}
        >
          Create Game
        </Link>
        <Link
          href="/join"
          style={{
            display: "block",
            textAlign: "center",
            padding: "16px",
            background: "#1f2937",
            color: "#fff",
            fontWeight: 700,
            fontSize: "18px",
            borderRadius: "16px",
            textDecoration: "none",
            border: "1px solid #374151",
          }}
        >
          Join Game
        </Link>
      </div>

      <p style={{ color: "#374151", fontSize: "12px", marginTop: "48px" }}>
        2-4 players &middot; Share the room code to play together
      </p>
    </div>
  );
}
