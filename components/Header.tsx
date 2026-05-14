"use client";

import { useTheme } from "./ThemeProvider";

interface HeaderProps {
  title: string;
  subtitle?: string;
  startDate: string;
  endDate: string;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T12:00:00");
  const e = new Date(end + "T12:00:00");
  const month = s.toLocaleDateString("en-US", { month: "long" });
  const year  = s.getFullYear();
  return `${month} ${s.getDate()}–${e.getDate()}, ${year}`;
}

export default function Header({ title, subtitle, startDate, endDate }: HeaderProps) {
  const dateRange = formatDateRange(startDate, endDate);
  const { theme, toggle, isOverride } = useTheme();
  const isDay = theme === "day";

  return (
    <header className="relative overflow-hidden" style={{ borderBottom: "1px solid var(--t-border-mid)" }}>
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--t-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--t-grid-line) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transition: "background-image 0.4s",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 pt-12 pb-10">
        {/* Top row: eyebrow + theme toggle */}
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "var(--t-gold)", fontFamily: "var(--font-dm-mono)" }}
          >
            Pecan &amp; Poplar &nbsp;·&nbsp; Private Itinerary
          </p>

          {/* Theme toggle pill */}
          <button
            onClick={toggle}
            title={isOverride ? "Override active — tap to auto" : "Tap to switch theme"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 20,
              border: `1px solid var(--t-border-hi)`,
              background: "var(--t-surface)",
              color: "var(--t-text-muted)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              cursor: "pointer",
              fontFamily: "var(--font-dm-mono)",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <span>{isDay ? "☽" : "☀"}</span>
            <span>{isDay ? "Night" : "Day"}</span>
            {isOverride && (
              <span style={{ opacity: 0.5, fontSize: 8, marginLeft: 2 }}>●</span>
            )}
          </button>
        </div>

        {/* Title */}
        <h1
          className="font-display italic leading-none mb-2"
          style={{
            fontSize: "clamp(42px, 10vw, 72px)",
            color: "var(--t-text)",
            letterSpacing: "-0.02em",
            transition: "color 0.4s",
          }}
        >
          {title}
        </h1>

        {/* Subtitle row */}
        <div className="flex items-center gap-3 mt-4">
          <div
            className="h-px flex-1"
            style={{
              background: `linear-gradient(90deg, var(--t-gold) 0%, transparent 100%)`,
              maxWidth: "60px",
              transition: "background 0.4s",
            }}
          />
          <span
            className="text-[11px] tracking-[0.12em] uppercase"
            style={{ color: "var(--t-text-muted)", transition: "color 0.4s" }}
          >
            {subtitle ?? "A weekend for two"}
          </span>
          <span className="text-[10px]" style={{ color: "var(--t-text-dim)" }}>·</span>
          <span
            className="text-[11px] tracking-[0.06em]"
            style={{ color: "var(--t-text-muted)", transition: "color 0.4s" }}
          >
            {dateRange}
          </span>
        </div>
      </div>
    </header>
  );
}
