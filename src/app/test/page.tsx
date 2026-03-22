"use client";

import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>JS Test</h1>
        <p style={{ fontSize: "24px", marginBottom: "20px" }}>Count: {count}</p>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{ padding: "16px 32px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "12px", fontSize: "18px", cursor: "pointer" }}
        >
          Click Me
        </button>
        <p style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
          If you can click the button and the count goes up, JS works on this device.
        </p>
      </div>
    </div>
  );
}
