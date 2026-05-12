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
      className="sticky top-0 z-20 border-b border-[#1E3319]"
      style={{ background: "rgba(11,19,9,0.92)", backdropFilter: "blur(16px)" }}
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
                {/* Active indicator */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] transition-opacity duration-200"
                  style={{
                    background: "linear-gradient(90deg, transparent, #C49A45, transparent)",
                    opacity: active ? 1 : 0,
                  }}
                />

                <span
                  className="block text-[9px] tracking-[0.18em] uppercase mb-0.5 transition-colors"
                  style={{ color: active ? "#C49A45" : "#3A5040" }}
                >
                  {day.label}
                </span>
                <span
                  className="font-display italic block leading-none transition-colors"
                  style={{
                    fontSize: "22px",
                    color: active ? "#E2D9C6" : "#3A5040",
                  }}
                >
                  {dateNum}
                </span>
                <span
                  className="block text-[9px] tracking-[0.1em] uppercase mt-0.5 transition-colors"
                  style={{ color: active ? "#6E8A74" : "#2D4D28" }}
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
