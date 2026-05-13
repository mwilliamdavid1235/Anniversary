"use client";

import { useState } from "react";

interface PasswordGateProps {
  onUnlock: () => void;
}

export default function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw.trim()) return;
    setChecking(true);
    setError("");

    const res = await fetch("/api/intimacy/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });

    setChecking(false);

    if (res.ok) {
      localStorage.setItem("intimacy_unlocked", "true");
      onUnlock();
    } else {
      setError("That's not right. Try again.");
      setPw("");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0C0810" }}
    >
      <p
        className="mb-2 text-center"
        style={{
          fontSize: "9px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#3D2850",
        }}
      >
        ✦ Private
      </p>
      <h1
        className="font-display italic text-center mb-2"
        style={{ fontSize: "clamp(28px, 7vw, 40px)", color: "#EDE0E8" }}
      >
        This section is private.
      </h1>
      <p
        className="text-center mb-10"
        style={{ fontSize: "12px", color: "#9B7FA8", maxWidth: 280 }}
      >
        Enter the shared password to continue.
      </p>

      <form onSubmit={handleSubmit} className="w-full" style={{ maxWidth: 320 }}>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="password"
          autoFocus
          className="w-full rounded-lg outline-none mb-3"
          style={{
            background: "rgba(13,11,16,0.8)",
            border: `1px solid ${error ? "#C47EA0" : "#2E1F40"}`,
            color: "#EDE0E8",
            fontSize: "14px",
            padding: "12px 16px",
            fontFamily: "var(--font-dm-mono), monospace",
            letterSpacing: "0.1em",
          }}
        />

        {error && (
          <p
            className="mb-3 text-center"
            style={{ fontSize: "11px", color: "#C47EA0" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={checking || !pw.trim()}
          className="w-full rounded-lg transition-opacity duration-150 active:scale-[0.99]"
          style={{
            padding: "12px",
            background: "rgba(196,126,160,0.15)",
            border: "1px solid #4A2D5A",
            color: "#EDE0E8",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: checking ? "wait" : "pointer",
            opacity: checking ? 0.6 : 1,
          }}
        >
          {checking ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
