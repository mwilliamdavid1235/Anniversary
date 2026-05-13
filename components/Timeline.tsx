"use client";

import { useEffect, useState, useCallback } from "react";
import type { TripDay, TripEvent } from "@/types";
import EventCard from "./EventCard";

interface TimelineProps {
  day: TripDay;
}

function getTimedNextId(day: TripDay): string | null {
  const now = new Date();
  for (const event of day.events) {
    if (!event.time) continue;
    const [h, m] = event.time.split(":").map(Number);
    const dt = new Date(`${day.date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`);
    if (dt > now) return event.id;
  }
  return null;
}

function getPastIds(day: TripDay, nextId: string | null): Set<string> {
  if (!nextId) return new Set(); // no next → nothing is dimmed
  const past = new Set<string>();
  for (const event of day.events) {
    if (event.id === nextId) break;
    past.add(event.id);
  }
  return past;
}

async function fetchActiveEventId(): Promise<string | null> {
  try {
    const res = await fetch("/api/trip/state?key=active_event_id", { cache: "no-store" });
    const data = await res.json();
    return data.value ?? null;
  } catch {
    return null;
  }
}

export default function Timeline({ day }: TimelineProps) {
  const [nextId, setNextId] = useState<string | null>(null);
  const [pastIds, setPastIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    const manualId = await fetchActiveEventId();
    // Manual flag wins over clock; clock only used when no manual flag set
    const effectiveNextId = manualId ?? getTimedNextId(day);
    setNextId(effectiveNextId);
    setPastIds(getPastIds(day, effectiveNextId));
  }, [day]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleSetActive(eventId: string) {
    // Toggle off if already active
    const value = eventId === nextId ? null : eventId;
    setNextId(value);
    setPastIds(getPastIds(day, value));
    await fetch("/api/trip/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "active_event_id", value }),
    });
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        className="absolute"
        style={{
          left: 51,
          top: 0,
          bottom: 0,
          width: 1,
          background: "linear-gradient(180deg, transparent 0%, #1E3319 8%, #1E3319 92%, transparent 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        {day.events.map((event: TripEvent) => (
          <EventCard
            key={event.id}
            event={event}
            isNext={event.id === nextId}
            isPast={pastIds.has(event.id)}
            onLongPress={() => handleSetActive(event.id)}
          />
        ))}
      </div>
    </div>
  );
}
