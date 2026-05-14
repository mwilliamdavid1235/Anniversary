"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── All known localStorage keys ──────────────────────────────
const DATA_KEYS = [
  "connection_person",
  "connection_section",
  "connection_submitted",
  "intimacy_unlocked",
  "intimacy_person",
  "intimacy_active_section",
  "intimacy_submitted",
  "exploration_section",
  "exploration_submitted_sections",
  "option-selection-d1-e2",
  "option-selection-d1-e3",
  "option-selection-d1-e4",
  "option-selection-d2-e2",
  "option-selection-d2-e3",
  "option-selection-d2-e5",
  "option-selection-d2-e8",
  "option-selection-d3-e2",
  "option-selection-d3-e4",
  "option-selection-d3-e5",
];

const LOCK_KEYS = ["star_tour_locked", "connection_locked", "intimacy_exploration_locked"];

// ── Palette ──────────────────────────────────────────────────
const C = {
  bg:         "#0B1309",
  card:       "rgba(255,255,255,0.025)",
  border:     "#1A2E18",
  borderMid:  "#1E3319",
  borderHi:   "#2D5038",
  text:       "#E2D9C6",
  muted:      "#6E8A74",
  dim:        "#3A5040",
  faint:      "#2D4D28",
  accent:     "#6DB87E",
  accentDim:  "#3D6B47",
  gold:       "#C49A45",
  rose:       "#C47A8A",
  danger:     "#C47A7A",
};

type ToastType = "success" | "danger";

export default function SettingsPage() {
  const [locks, setLocks] = useState({ star_tour: false, connection: false, intimacy_exploration: false });
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  useEffect(() => {
    setLocks({
      star_tour:           localStorage.getItem("star_tour_locked")           === "true",
      connection:          localStorage.getItem("connection_locked")          === "true",
      intimacy_exploration: localStorage.getItem("intimacy_exploration_locked") === "true",
    });
  }, []);

  function showToast(msg: string, type: ToastType = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  // ── Lock toggle ─────────────────────────────────────────────
  function toggleLock(key: "star_tour" | "connection" | "intimacy_exploration") {
    const storageKey = `${key}_locked`;
    const next = !locks[key];
    if (next) {
      localStorage.setItem(storageKey, "true");
      if (key === "intimacy_exploration") {
        // also remove the unlock flag so PasswordGate kicks in
        localStorage.removeItem("intimacy_unlocked");
      }
    } else {
      localStorage.removeItem(storageKey);
    }
    setLocks((prev) => ({ ...prev, [key]: next }));
    showToast(next ? "Locked." : "Unlocked.", "success");
  }

  // ── Fill test data ───────────────────────────────────────────
  function fillTestData() {
    localStorage.setItem("connection_person", "michael");
    localStorage.setItem("connection_section", "memories");
    localStorage.setItem("connection_submitted", JSON.stringify(["memories", "right-now"]));
    localStorage.setItem("intimacy_person", "michael");
    localStorage.setItem("option-selection-d1-e2", "opt-peaceful-side-fri");
    localStorage.setItem("option-selection-d2-e2", "opt-breakfast-cabin");
    localStorage.setItem("option-selection-d2-e8", "opt-star-tour-sat");
    localStorage.setItem("option-selection-d3-e2", "opt-breakfast-cabin-sun");
    localStorage.setItem("option-selection-d3-e4", "opt-laurel-falls");
    showToast("Test data loaded.", "success");
  }

  // ── Clear all data ───────────────────────────────────────────
  async function clearAllData() {
    [...DATA_KEYS, ...LOCK_KEYS].forEach((k) => localStorage.removeItem(k));
    setLocks({ star_tour: false, connection: false, intimacy_exploration: false });
    await Promise.all([
      fetch("/api/connection/answers", { method: "DELETE" }),
      fetch("/api/intimacy/answers", { method: "DELETE" }),
      fetch("/api/exploration/answers", { method: "DELETE" }),
    ]);
    showToast("All data cleared.", "danger");
  }

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${C.borderMid}`,
          background: "rgba(11,19,9,0.92)",
          backdropFilter: "blur(12px)",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.muted,
            textDecoration: "none",
          }}
        >
          ← Itinerary
        </Link>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.dim,
          }}
        >
          Settings
        </span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Title */}
        <h1
          className="font-display italic"
          style={{ fontSize: "36px", color: C.text, marginBottom: 6, lineHeight: 1.1 }}
        >
          App Settings
        </h1>
        <p style={{ fontSize: "12px", color: C.muted, marginBottom: 40, lineHeight: 1.6 }}>
          Dev tools and feature controls. Settings are local to this device.
        </p>

        {/* ── Section: Data ── */}
        <SectionLabel>Data</SectionLabel>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
          <ActionCard
            label="Fill Test Data"
            description="Loads sample answers and selections across connection, intimacy, and event options."
            buttonLabel="Fill"
            buttonColor={C.accentDim}
            buttonBorder={C.borderHi}
            buttonText={C.accent}
            onClick={fillTestData}
          />
          <ActionCard
            label="Clear All Answers"
            description="Wipes every stored answer, selection, person, and section from this device. Cannot be undone."
            buttonLabel="Clear"
            buttonColor="rgba(196,122,122,0.12)"
            buttonBorder="#5A2828"
            buttonText={C.danger}
            onClick={clearAllData}
          />
        </div>

        {/* ── Section: Locks ── */}
        <SectionLabel>Feature Locks</SectionLabel>
        <p style={{ fontSize: "11px", color: C.dim, marginBottom: 20, lineHeight: 1.6 }}>
          Locked features show a teasing message when tapped instead of opening. Unlock anytime.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <LockRow
            label="Star Tour"
            description="The guided 10-stop telescope experience."
            locked={locks.star_tour}
            onToggle={() => toggleLock("star_tour")}
            accentColor="#B8AADF"
          />
          <LockRow
            label="Connection Guide"
            description="The 28-question shared conversation guide."
            locked={locks.connection}
            onToggle={() => toggleLock("connection")}
            accentColor={C.rose}
          />
          <LockRow
            label="Intimacy + Exploration"
            description="The private password-protected sections."
            locked={locks.intimacy_exploration}
            onToggle={() => toggleLock("intimacy_exploration")}
            accentColor={C.gold}
          />
        </div>

      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.type === "danger" ? "rgba(80,20,20,0.95)" : "rgba(20,40,22,0.95)",
            border: `1px solid ${toast.type === "danger" ? "#5A2828" : C.borderHi}`,
            color: toast.type === "danger" ? C.danger : C.accent,
            fontSize: "12px",
            letterSpacing: "0.04em",
            padding: "10px 22px",
            borderRadius: 24,
            backdropFilter: "blur(12px)",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            animation: "fadeUp 0.25s ease both",
            zIndex: 50,
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ── Section label ──────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.dim }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

// ── Action card ────────────────────────────────────────────────
function ActionCard({
  label, description, buttonLabel, buttonColor, buttonBorder, buttonText, onClick,
}: {
  label: string; description: string; buttonLabel: string;
  buttonColor: string; buttonBorder: string; buttonText: string;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "14px", color: C.text, marginBottom: 3, fontWeight: 500 }}>
          {label}
        </p>
        <p style={{ fontSize: "11px", color: C.muted, lineHeight: 1.55 }}>
          {description}
        </p>
      </div>
      <button
        onClick={onClick}
        style={{
          flexShrink: 0,
          padding: "8px 18px",
          borderRadius: 8,
          border: `1px solid ${buttonBorder}`,
          background: buttonColor,
          color: buttonText,
          fontSize: "10px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "var(--font-dm-mono), monospace",
          transition: "opacity 0.15s",
        }}
        onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

// ── Lock row ────────────────────────────────────────────────────
function LockRow({
  label, description, locked, onToggle, accentColor,
}: {
  label: string; description: string; locked: boolean; onToggle: () => void; accentColor: string;
}) {
  return (
    <div
      style={{
        background: locked ? "rgba(255,255,255,0.015)" : C.card,
        border: `1px solid ${locked ? accentColor + "33" : C.border}`,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "border-color 0.3s",
      }}
    >
      {/* Lock icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: locked ? `${accentColor}18` : "rgba(255,255,255,0.03)",
          border: `1px solid ${locked ? accentColor + "44" : C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          flexShrink: 0,
          transition: "all 0.3s",
        }}
      >
        {locked ? "🔒" : "🔓"}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "14px", color: locked ? accentColor : C.text, marginBottom: 2, fontWeight: 500, transition: "color 0.3s" }}>
          {label}
        </p>
        <p style={{ fontSize: "11px", color: C.muted, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        style={{
          flexShrink: 0,
          width: 48,
          height: 26,
          borderRadius: 13,
          border: `1px solid ${locked ? accentColor + "66" : C.border}`,
          background: locked ? `${accentColor}22` : "rgba(255,255,255,0.04)",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.25s",
          padding: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: locked ? accentColor : C.dim,
            position: "absolute",
            top: 3,
            left: locked ? 26 : 3,
            transition: "left 0.25s, background 0.25s",
          }}
        />
      </button>
    </div>
  );
}
