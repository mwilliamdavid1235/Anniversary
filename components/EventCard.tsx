"use client";

import type { TripEvent, EventLink, EventOption } from "@/types";
import PlaylistCard from "./PlaylistCard";

interface EventCardProps {
  event: TripEvent;
  isNext: boolean;
  isPast: boolean;
}

// ── Type config ──────────────────────────────────────────────
const TYPE_CONFIG = {
  travel:     { label: "Travel",    dot: "#6E8A74", accent: "#6E8A74" },
  lodging:    { label: "Lodging",   dot: "#9B8FC4", accent: "#9B8FC4" },
  restaurant: { label: "Dining",    dot: "#C49A45", accent: "#C49A45" },
  activity:   { label: "Activity",  dot: "#6DB87E", accent: "#6DB87E" },
} as const;

// ── Link button config ───────────────────────────────────────
const LINK_CONFIG = {
  waze:    { bg: "rgba(51,64,160,0.15)",  border: "#2A3580",  color: "#8090E8", text: "▲ " },
  website: { bg: "rgba(196,154,69,0.1)",  border: "#6B4F1E",  color: "#C49A45", text: "↗ " },
  menu:    { bg: "rgba(109,184,126,0.1)", border: "#2D5038",  color: "#6DB87E", text: "≡ " },
  reserve: { bg: "rgba(155,143,196,0.1)", border: "#4A4070",  color: "#9B8FC4", text: "◇ " },
  phone:   { bg: "rgba(110,138,116,0.1)", border: "#2D4D28",  color: "#6E8A74", text: "○ " },
  tickets: { bg: "rgba(196,167,69,0.1)",  border: "#5A4A10",  color: "#C4A745", text: "✦ " },
} as const;

function LinkButton({ link }: { link: EventLink }) {
  const cfg = LINK_CONFIG[link.kind] ?? LINK_CONFIG.website;
  return (
    <a
      href={link.href}
      target={link.kind === "phone" ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded transition-opacity duration-100 active:scale-95"
      style={{
        fontSize: "10px",
        letterSpacing: "0.06em",
        padding: "4px 10px",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden>{cfg.text}</span>
      {link.label}
    </a>
  );
}

function OptionItem({ option }: { option: EventOption }) {
  return (
    <div
      className="rounded-lg p-3 mb-2 last:mb-0"
      style={{
        background: "rgba(11,19,9,0.6)",
        border: "1px solid #1E3319",
      }}
    >
      <p className="font-display italic mb-1" style={{ fontSize: "17px", color: "#E2D9C6" }}>
        {option.name}
      </p>
      <p className="mb-2 leading-relaxed" style={{ fontSize: "11px", color: "#6E8A74" }}>
        {option.description}
      </p>
      {option.links.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {option.links.map((l) => <LinkButton key={l.href + l.label} link={l} />)}
        </div>
      )}
    </div>
  );
}

export default function EventCard({ event, isNext, isPast }: EventCardProps) {
  const cfg = TYPE_CONFIG[event.type];
  const [h, m] = event.time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const timeStr = `${hour12}:${String(m).padStart(2, "0")}`;

  return (
    <div className={`event-row flex gap-0 mb-3 ${isPast ? "is-past" : ""}`}>
      {/* Time column */}
      <div
        className="flex-shrink-0 text-right pt-4 select-none"
        style={{
          width: 56,
          paddingRight: 14,
          color: isNext ? cfg.accent : "#3A5040",
          fontSize: "11px",
          lineHeight: 1.2,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span className="block" style={{ color: isNext ? cfg.accent : "#3A5040" }}>{timeStr}</span>
        <span className="block" style={{ color: "#2D4D28", fontSize: "9px", letterSpacing: "0.05em" }}>{period}</span>
      </div>

      {/* Timeline dot */}
      <div className="flex-shrink-0 relative" style={{ marginTop: 18, marginLeft: -5, zIndex: 1 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: isNext ? cfg.dot : "#1E3319",
            border: `1.5px solid ${isNext ? cfg.dot : "#2D4D28"}`,
            outline: isNext ? `3px solid rgba(109,184,126,0.15)` : "none",
            transition: "all 0.3s ease",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="event-card flex-1 rounded-xl p-4 ml-3 mb-0"
        style={{
          background: isNext
            ? "rgba(109,184,126,0.05)"
            : "rgba(255,255,255,0.025)",
          border: `1px solid ${isNext ? "#2D5038" : "#1A2E18"}`,
        }}
      >
        {/* Type badge */}
        <p
          className="mb-1.5"
          style={{
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: cfg.accent,
          }}
        >
          ✦ {cfg.label}
        </p>

        {/* Title */}
        <h3
          className="font-display italic leading-tight mb-1"
          style={{ fontSize: "22px", color: "#E2D9C6" }}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p className="leading-relaxed mb-0" style={{ fontSize: "12px", color: "#6E8A74" }}>
          {event.description}
        </p>

        {/* Options */}
        {event.options && event.options.length > 0 && (
          <div className="mt-3">
            <p
              className="mb-2"
              style={{
                fontSize: "9px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#3A5040",
              }}
            >
              — Choose one —
            </p>
            {event.options.map((opt) => (
              <OptionItem key={opt.id} option={opt} />
            ))}
          </div>
        )}

        {/* Direct links */}
        {event.links && event.links.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.links.map((l) => <LinkButton key={l.href + l.label} link={l} />)}
          </div>
        )}

        {/* Confirmation note */}
        {event.note && (
          <div
            className="mt-3 rounded-r-lg px-3 py-2 leading-relaxed"
            style={{
              fontSize: "11px",
              color: "#6DB87E",
              background: "rgba(61,107,71,0.15)",
              borderLeft: "2px solid #3D6B47",
            }}
          >
            {event.note}
          </div>
        )}

        {/* Playlist */}
        {event.playlist && <PlaylistCard playlist={event.playlist} />}
      </div>
    </div>
  );
}
