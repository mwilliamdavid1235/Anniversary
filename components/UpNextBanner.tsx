"use client";

import { useEffect, useState, useCallback } from "react";
import type { TripDay, TripEvent } from "@/types";

interface EventWithMeta {
  event: TripEvent;
  day: TripDay;
  dateTime: Date | null; // null when event has no time (manual flag)
}

interface UpNextBannerProps {
  days: TripDay[];
}

function findNextByTime(days: TripDay[]): EventWithMeta | null {
  const now = new Date();
  const timed = days
    .flatMap((day) =>
      day.events
        .filter((e) => !!e.time)
        .map((event) => {
          const [h, m] = event.time!.split(":").map(Number);
          const dt = new Date(`${day.date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`);
          return { event, day, dateTime: dt };
        })
    )
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  return timed.find((e) => e.dateTime > now) ?? null;
}

function findById(days: TripDay[], eventId: string): EventWithMeta | null {
  for (const day of days) {
    const event = day.events.find((e) => e.id === eventId);
    if (event) return { event, day, dateTime: null };
  }
  return null;
}

function formatTime(dt: Date): string {
  return dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function UpNextBanner({ days }: UpNextBannerProps) {
  const [next, setNext] = useState<EventWithMeta | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/trip/state?key=active_event_id", { cache: "no-store" });
      const { value } = await res.json();
      if (value) {
        const found = findById(days, value);
        setNext(found);
        return;
      }
    } catch {
      // fall through to time-based
    }
    setNext(findNextByTime(days));
  }, [days]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  if (!next) return null;

  const dayNames: Record<number, string> = { 1: "Friday", 2: "Saturday", 3: "Sunday" };
  const typeBadge: Record<string, string> = {
    travel:     "TRAVEL",
    lodging:    "LODGING",
    restaurant: "DINING",
    activity:   "ACTIVITY",
    experience: "EXPERIENCE",
  };

  return (
    <div
      className="border-b border-[#1E3319] px-6 py-3"
      style={{ background: "rgba(109,184,126,0.07)" }}
    >
      <div className="max-w-2xl mx-auto flex items-center gap-4">
        {/* Pulse dot */}
        <div className="relative flex-shrink-0 pulse-dot" style={{ width: 8, height: 8 }}>
          <div className="absolute inset-0 rounded-full" style={{ background: "#6DB87E" }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="text-[9px] tracking-[0.18em] uppercase mr-2" style={{ color: "#6DB87E" }}>
            Up next
          </span>
          <span className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "#3D6B47" }}>
            {typeBadge[next.event.type] ?? next.event.type}
          </span>
          <p
            className="font-display italic truncate leading-tight mt-0.5"
            style={{ fontSize: "18px", color: "#E2D9C6" }}
          >
            {next.event.title}
          </p>
        </div>

        {/* Time / day */}
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] tracking-[0.08em]" style={{ color: "#6E8A74" }}>
            {dayNames[next.day.dayNumber]}
          </p>
          {next.dateTime && (
            <p className="text-[13px] tracking-[0.05em]" style={{ color: "#C49A45" }}>
              {formatTime(next.dateTime)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
