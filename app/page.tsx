"use client";

import { useState, useEffect } from "react";
import { TRIP } from "@/lib/data";
import Header from "@/components/Header";
import UpNextBanner from "@/components/UpNextBanner";
import DayNav from "@/components/DayNav";
import Timeline from "@/components/Timeline";

function getInitialDay(): number {
  const now = new Date();
  for (const day of TRIP.days) {
    const d = new Date(day.date + "T12:00:00");
    if (now.toDateString() === d.toDateString()) return day.dayNumber;
  }
  const start = new Date(TRIP.startDate + "T00:00:00");
  return now < start ? 1 : TRIP.days.length;
}

export default function Home() {
  // Initialize from client-side date detection after hydration
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const resolvedDay = activeDay ?? 1;

  // Sync active day with system clock after hydration (external system = current date)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActiveDay(getInitialDay()); }, []);

  const currentDay = TRIP.days.find((d) => d.dayNumber === resolvedDay) ?? TRIP.days[0];

  return (
    <div className="min-h-screen" style={{ background: "#0B1309" }}>
      <Header
        title={TRIP.title}
        subtitle={TRIP.subtitle}
        startDate={TRIP.startDate}
        endDate={TRIP.endDate}
      />

      <UpNextBanner days={TRIP.days} />

      <DayNav
        days={TRIP.days}
        activeDay={activeDay}
        onSelect={setActiveDay}
      />

      {/* Main content area */}
      <main className="max-w-2xl mx-auto px-6 py-8 relative">
        {/* Watermark day number */}
        <div
          className="day-watermark absolute select-none pointer-events-none"
          style={{ right: -20, top: -30, zIndex: 0 }}
          aria-hidden
        >
          {String(currentDay.dayNumber).padStart(2, "0")}
        </div>

        {/* Day label */}
        <div className="relative z-10 mb-6 flex items-center gap-3">
          <span
            className="font-display"
            style={{ fontSize: "13px", color: "#3A5040", letterSpacing: "0.04em" }}
          >
            {currentDay.label}
          </span>
          <div className="flex-1 h-px" style={{ background: "#1E3319" }} />
          <span className="text-[10px] tracking-[0.12em] uppercase" style={{ color: "#2D4D28" }}>
            {currentDay.events.length} stops
          </span>
        </div>

        {/* Timeline */}
        <div className="relative z-10 fade-up" key={activeDay}>
          <Timeline day={currentDay} />
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-8 border-t"
        style={{ borderColor: "#1E3319" }}
      >
        <p
          className="font-display mb-1"
          style={{ fontSize: "20px", color: "#3A5040" }}
        >
          pecanandpoplar.com
        </p>
        <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#2D4D28" }}>
          Made with love · Private itinerary
        </p>
      </footer>
    </div>
  );
}
