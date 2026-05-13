"use client";

import { useEffect, useState } from "react";
import type { TripDay, TripEvent } from "@/types";
import EventCard from "./EventCard";

interface TimelineProps {
  day: TripDay;
}

function getNextEventId(day: TripDay): string | null {
  const now = new Date();
  for (const event of day.events) {
    if (!event.time) continue;
    const [h, m] = event.time.split(":").map(Number);
    const dt = new Date(`${day.date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`);
    if (dt > now) return event.id;
  }
  return null;
}

function getPastEventIds(day: TripDay, nextId: string | null): Set<string> {
  const past = new Set<string>();
  for (const event of day.events) {
    if (event.id === nextId) break;
    past.add(event.id);
  }
  return past;
}

export default function Timeline({ day }: TimelineProps) {
  const [nextId, setNextId] = useState<string | null>(null);
  const [pastIds, setPastIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    function tick() {
      const nid = getNextEventId(day);
      setNextId(nid);
      setPastIds(getPastEventIds(day, nid));
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [day]);

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
          />
        ))}
      </div>
    </div>
  );
}
