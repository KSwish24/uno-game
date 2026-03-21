"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!name.trim()) { setError("Enter your name"); return; }
    if (!code.trim() || code.trim().length !== 4) { setError("Enter a 4-letter room code"); return; }
    setLoading(true);
    setError("");
    try {
      const { code: gameCode, playerId } = await api.joinGame(code.trim().toUpperCase(), name.trim());
      router.push(`/game/${gameCode}?pid=${playerId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to join game");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#030712", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif", color: "#fff",
    }}>
      <div style={{
        width: "100%", maxWidth: "360px", background: "#111827",
        border: "1px solid #1f2937", borderRadius: "16px", padding: "24px",
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>Join a Game</h2>
        <label style={{ display: "block", fontSize: "14px", color: "#9ca3af", marginBottom: "4px" }}>Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={16}
          autoFocus
          style={{
            width: "100%", padding: "12px", background: "#1f2937", border: "1px solid #374151",
            borderRadius: "12px", color: "#fff", fontSize: "16px", outline: "none",
            boxSizing: "border-box", marginBottom: "12px",
          }}
        />
        <label style={{ display: "block", fontSize: "14px", color: "#9ca3af", marginBottom: "4px" }}>Room Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          placeholder="ABCD"
          maxLength={4}
          style={{
            width: "100%", padding: "12px", background: "#1f2937", border: "1px solid #374151",
            borderRadius: "12px", color: "#fff", fontSize: "24px", fontWeight: 700,
            textAlign: "center", letterSpacing: "8px", outline: "none",
            boxSizing: "border-box", textTransform: "uppercase",
          }}
        />
        {error && <p style={{ color: "#f87171", fontSize: "14px", marginTop: "8px" }}>{error}</p>}
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <a href="/" style={{
            flex: 1, textAlign: "center", padding: "12px", background: "#1f2937",
            color: "#d1d5db", borderRadius: "12px", textDecoration: "none", fontWeight: 500,
          }}>Back</a>
          <button
            onClick={handleJoin}
            disabled={loading}
            style={{
              flex: 1, padding: "12px", background: loading ? "#1e3a8a" : "#2563eb",
              color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700,
              fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1,
            }}
          >{loading ? "Joining..." : "Join"}</button>
        </div>
      </div>
    </div>
  );
}
