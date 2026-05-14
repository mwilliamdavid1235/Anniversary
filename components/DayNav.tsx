"use client";

import type { TripDay } from "@/types";

interface DayNavProps {
  days: TripDay[];
  activeDay: number | null;
  onSelect: (dayNumber: number) => void;
}

export default function DayNav({ days, activeDay, onSelect }: DayNavProps) {
  return (
    <nav
      className="sticky top-0 z-20"
      style={{
        background: "var(--t-nav-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--t-border-mid)",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex">
          {days.map((day) => {
            const active = activeDay !== null && day.dayNumber === activeDay;
            const d = new Date(day.date + "T12:00:00");
            const dateNum = d.getDate();
            const monthAbbr = d.toLocaleDateString("en-US", { month: "short" });

            return (
              <button
                key={day.id}
                onClick={() => onSelect(day.dayNumber)}
                className="flex-1 py-4 text-left transition-colors duration-150 relative group"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] transition-opacity duration-200"
                  style={{
                    background: `linear-gradient(90deg, transparent, var(--t-gold), transparent)`,
                    opacity: active ? 1 : 0,
                  }}
                />
                <span
                  className="block text-[9px] tracking-[0.18em] uppercase mb-0.5 transition-colors"
                  style={{ color: active ? "var(--t-gold)" : "var(--t-text-dim)" }}
                >
                  {day.label}
                </span>
                <span
                  className="font-display block leading-none transition-colors"
                  style={{ fontSize: "22px", color: active ? "var(--t-text)" : "var(--t-text-dim)" }}
                >
                  {dateNum}
                </span>
                <span
                  className="block text-[9px] tracking-[0.1em] uppercase mt-0.5 transition-colors"
                  style={{ color: active ? "var(--t-text-muted)" : "var(--t-text-faint)" }}
                >
                  {monthAbbr}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
