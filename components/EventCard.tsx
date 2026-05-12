"use client";

import { useState, useEffect } from "react";
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

// ── Options panel with persistent selection ──────────────────
function OptionsPanel({ eventId, options }: { eventId: string; options: EventOption[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`option-selection-${eventId}`);
    if (stored) setSelectedId(stored);
  }, [eventId]);

  function choose(optionId: string) {
    localStorage.setItem(`option-selection-${eventId}`, optionId);
    setSelectedId(optionId);
    setExpandedId(null);
  }

  function reset() {
    localStorage.removeItem(`option-selection-${eventId}`);
    setSelectedId(null);
    setExpandedId(null);
  }

  // ── Chosen state ─────────────────────────────────────────
  if (selectedId) {
    const chosen = options.find((o) => o.id === selectedId);
    if (!chosen) return null;
    return (
      <div className="mt-3">
        <div
          className="rounded-lg p-3"
          style={{
            background: "rgba(61,107,71,0.12)",
            border: "1px solid #2D5038",
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <p
              className="font-display italic"
              style={{ fontSize: "17px", color: "#E2D9C6" }}
            >
              ✓ {chosen.name}
            </p>
            <button
              onClick={reset}
              style={{
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "#3A5040",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 0",
                flexShrink: 0,
                textTransform: "uppercase",
              }}
            >
              Change
            </button>
          </div>
          <p className="leading-relaxed mb-2" style={{ fontSize: "11px", color: "#6E8A74" }}>
            {chosen.description}
          </p>
          {chosen.links.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {chosen.links.map((l) => (
                <LinkButton key={l.href + l.label} link={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── No selection — collapsed list, one expandable at a time ──
  return (
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
      {options.map((opt) => {
        const isExpanded = expandedId === opt.id;
        return (
          <div
            key={opt.id}
            className="rounded-lg mb-2 last:mb-0 overflow-hidden"
            style={{
              background: isExpanded ? "rgba(11,19,9,0.8)" : "rgba(11,19,9,0.4)",
              border: `1px solid ${isExpanded ? "#2D5038" : "#1E3319"}`,
              transition: "background 0.15s ease, border-color 0.15s ease",
            }}
          >
            {/* Collapsed header — always visible */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : opt.id)}
              className="w-full flex items-center justify-between text-left"
              style={{
                padding: "10px 12px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span
                className="font-display italic"
                style={{ fontSize: "15px", color: isExpanded ? "#E2D9C6" : "#9BB09E" }}
              >
                {opt.name}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "#3A5040",
                  marginLeft: 8,
                  flexShrink: 0,
                }}
              >
                {isExpanded ? "▲" : "▼"}
              </span>
            </button>

            {/* Expanded details */}
            {isExpanded && (
              <div style={{ padding: "0 12px 12px" }}>
                <p className="leading-relaxed mb-3" style={{ fontSize: "11px", color: "#6E8A74" }}>
                  {opt.description}
                </p>
                {opt.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {opt.links.map((l) => (
                      <LinkButton key={l.href + l.label} link={l} />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => choose(opt.id)}
                  className="rounded transition-opacity duration-100 active:scale-95"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "6px 14px",
                    background: "rgba(61,107,71,0.25)",
                    border: "1px solid #2D5038",
                    color: "#6DB87E",
                    cursor: "pointer",
                  }}
                >
                  Choose this
                </button>
              </div>
            )}
          </div>
        );
      })}
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
          <OptionsPanel eventId={event.id} options={event.options} />
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
