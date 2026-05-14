"use client";

import { useEffect, useState, useCallback } from "react";
import type { TripDay } from "@/types";

interface UpNextBannerProps {
  days: TripDay[];
}

const TYPE_BADGE: Record<string, string> = {
  travel:     "TRAVEL",
  lodging:    "LODGING",
  restaurant: "DINING",
  activity:   "ACTIVITY",
  experience: "EXPERIENCE",
};

const DAY_NAMES: Record<number, string> = { 1: "Friday", 2: "Saturday", 3: "Sunday" };

export default function UpNextBanner({ days }: UpNextBannerProps) {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/trip/state?key=active_event_id", { cache: "no-store" });
      const { value } = await res.json();
      setActiveEventId(value ?? null);
    } catch {
      // leave unchanged on error
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  if (!activeEventId) return null;

  let found: { event: (typeof days)[0]["events"][0]; day: (typeof days)[0] } | null = null;
  for (const day of days) {
    const event = day.events.find((e) => e.id === activeEventId);
    if (event) { found = { event, day }; break; }
  }
  if (!found) return null;

  const { event, day } = found;

  return (
    <div
      className="px-6 py-3"
      style={{
        background: "var(--t-banner-bg)",
        borderBottom: "1px solid var(--t-border-mid)",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      <div className="max-w-2xl mx-auto flex items-center gap-4">
        <div className="relative flex-shrink-0 pulse-dot" style={{ width: 8, height: 8 }}>
          <div className="absolute inset-0 rounded-full" style={{ background: "var(--t-accent)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[9px] tracking-[0.18em] uppercase mr-2" style={{ color: "var(--t-accent)" }}>
            Up next
          </span>
          <span className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "var(--t-accent-dim)" }}>
            {TYPE_BADGE[event.type] ?? event.type}
          </span>
          <p
            className="font-display italic truncate leading-tight mt-0.5"
            style={{ fontSize: "18px", color: "var(--t-text)" }}
          >
            {event.title}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-[10px] tracking-[0.08em]" style={{ color: "var(--t-text-muted)" }}>
            {DAY_NAMES[day.dayNumber]}
          </p>
        </div>
      </div>
    </div>
  );
}
