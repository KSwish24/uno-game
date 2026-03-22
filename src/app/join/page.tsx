export default function JoinPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#030712", display: "flex",
      flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
      padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif", color: "#fff",
    }}>
      <form
        action="/api/game/join-redirect"
        method="POST"
        style={{
          width: "100%", maxWidth: "360px", background: "#111827",
          border: "1px solid #1f2937", borderRadius: "16px", padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>Join a Game</h2>
        <label style={{ display: "block", fontSize: "14px", color: "#9ca3af", marginBottom: "4px" }}>Your Name</label>
        <input
          type="text"
          name="playerName"
          placeholder="Enter your name"
          maxLength={16}
          required
          autoFocus
          style={{
            width: "100%", padding: "12px", background: "#1f2937", border: "1px solid #374151",
            borderRadius: "12px", color: "#fff", fontSize: "16px", outline: "none",
            boxSizing: "border-box" as const, marginBottom: "12px",
          }}
        />
        <label style={{ display: "block", fontSize: "14px", color: "#9ca3af", marginBottom: "4px" }}>Room Code</label>
        <input
          type="text"
          name="code"
          placeholder="ABCD"
          maxLength={4}
          required
          style={{
            width: "100%", padding: "12px", background: "#1f2937", border: "1px solid #374151",
            borderRadius: "12px", color: "#fff", fontSize: "24px", fontWeight: 700,
            textAlign: "center" as const, letterSpacing: "8px", outline: "none",
            boxSizing: "border-box" as const, textTransform: "uppercase" as const,
          }}
        />
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <a href="/" style={{
            flex: 1, textAlign: "center" as const, padding: "12px", background: "#1f2937",
            color: "#d1d5db", borderRadius: "12px", textDecoration: "none", fontWeight: 500,
            display: "block",
          }}>Back</a>
          <button
            type="submit"
            style={{
              flex: 1, padding: "12px", background: "#2563eb",
              color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700,
              fontSize: "16px", cursor: "pointer",
            }}
          >Join</button>
        </div>
      </form>
    </div>
  );
}
