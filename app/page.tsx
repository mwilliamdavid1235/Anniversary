"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
        className="text-center py-10 border-t"
        style={{ borderColor: "#1E3319" }}
      >
        {/* Section links */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          <Link
            href="/connection"
            className="group flex flex-col items-center gap-1 transition-opacity duration-150 hover:opacity-80"
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-display italic"
              style={{ fontSize: "22px", color: "#E2D9C6" }}
            >
              Connection
            </span>
            <span style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3A5040" }}>
              28 questions
            </span>
          </Link>

          <div style={{ width: 1, height: 36, background: "#1E3319" }} />

          <Link
            href="/intimacy"
            className="group flex flex-col items-center gap-1 transition-opacity duration-150 hover:opacity-80"
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-display italic"
              style={{ fontSize: "22px", color: "#E2D9C6" }}
            >
              Intimacy
            </span>
            <span style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3A5040" }}>
              Private ✦
            </span>
          </Link>

          <div style={{ width: 1, height: 36, background: "#1E3319" }} />

          <Link
            href="/exploration"
            className="group flex flex-col items-center gap-1 transition-opacity duration-150 hover:opacity-80"
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-display italic"
              style={{ fontSize: "22px", color: "#E2D9C6" }}
            >
              Exploration
            </span>
            <span style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3A5040" }}>
              Private ✦
            </span>
          </Link>
        </div>

        <p
          className="font-display mb-1"
          style={{ fontSize: "20px", color: "#3A5040" }}
        >
          pecanandpoplar.com
        </p>
        <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#2D4D28" }}>
          Made with love · Private itinerary
        </p>
        <Link
          href="/settings"
          className="mt-6 inline-block text-[9px] tracking-[0.15em] uppercase transition-opacity hover:opacity-60"
          style={{ color: "#1E3319", textDecoration: "none" }}
        >
          ⚙ Settings
        </Link>
      </footer>
    </div>
  );
}
