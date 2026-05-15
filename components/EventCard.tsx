"use client";

import { useState, useEffect, useRef } from "react";
import type { TripEvent, EventLink, EventOption } from "@/types";
import PlaylistCard from "./PlaylistCard";

interface EventCardProps {
  event: TripEvent;
  isNext: boolean;
  isPast: boolean;
  onLongPress?: () => void;
}

// ── Type config ──────────────────────────────────────────────
const TYPE_CONFIG = {
  travel:     { label: "Travel",     dot: "#6E8A74", accent: "#6E8A74" },
  lodging:    { label: "Lodging",    dot: "#9B8FC4", accent: "#9B8FC4" },
  restaurant: { label: "Dining",     dot: "#C49A45", accent: "#C49A45" },
  activity:   { label: "Activity",   dot: "#6DB87E", accent: "#6DB87E" },
  experience: { label: "Experience", dot: "#C47A8A", accent: "#C47A8A" },
} as const;

// ── Link button config ───────────────────────────────────────
const LINK_CONFIG = {
  waze:       { bg: "rgba(51,64,160,0.15)",   border: "#2A3580",  color: "#8090E8", text: "▲ " },
  website:    { bg: "rgba(196,154,69,0.1)",   border: "#6B4F1E",  color: "#C49A45", text: "↗ " },
  menu:       { bg: "rgba(109,184,126,0.1)",  border: "#2D5038",  color: "#6DB87E", text: "≡ " },
  reserve:    { bg: "rgba(155,143,196,0.1)",  border: "#4A4070",  color: "#9B8FC4", text: "◇ " },
  phone:      { bg: "rgba(110,138,116,0.1)",  border: "#2D4D28",  color: "#6E8A74", text: "○ " },
  tickets:    { bg: "rgba(196,167,69,0.1)",   border: "#5A4A10",  color: "#C4A745", text: "✦ " },
  connection: { bg: "rgba(196,122,138,0.15)", border: "#7A3A4A",  color: "#C47A8A", text: "♡ " },
  "star-tour": { bg: "rgba(155,143,196,0.12)", border: "#4A3A70",  color: "#B8AADF", text: "✦ " },
} as const;

const LOCK_MESSAGES: Record<string, string[]> = {
  "star-tour": [
    "Not yet, love. The stars will still be there. ✦",
    "Save the best for when the sky is truly dark. ☽",
    "Some things are worth the wait. This is one of them. ✦",
    "The universe has been patient for 13 billion years. You can manage a little longer. ☽",
  ],
  "connection": [
    "Easy, tiger. That one's for later tonight. ♡",
    "Good things come to those who wait — and tonight has very good things. ♡",
    "Build the anticipation a little. Trust the process. ♡",
    "Not yet. Pour a drink first. Then we'll talk. ♡",
  ],
};

function LinkButton({ link }: { link: EventLink }) {
  const cfg = LINK_CONFIG[link.kind] ?? LINK_CONFIG.website;
  const isInternal = link.kind === "phone" || link.kind === "connection" || link.kind === "star-tour";
  const [teaseMsg, setTeaseMsg] = useState<string | null>(null);

  function handleClick(e: React.MouseEvent) {
    const lockKey =
      link.kind === "star-tour"  ? "star_tour_locked" :
      link.kind === "connection" ? "connection_locked" : null;

    if (lockKey && localStorage.getItem(lockKey) === "true") {
      e.preventDefault();
      const msgs = LOCK_MESSAGES[link.kind] ?? ["Not yet. ♡"];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setTeaseMsg(msg);
      setTimeout(() => setTeaseMsg(null), 3200);
    }
  }

  if (teaseMsg) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded"
        style={{
          fontSize: "10px",
          letterSpacing: "0.06em",
          padding: "4px 10px",
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          color: cfg.color,
          whiteSpace: "normal",
          fontStyle: "italic",
          animation: "fadeUp 0.2s ease both",
        }}
      >
        {teaseMsg}
      </span>
    );
  }

  return (
    <a
      href={link.href}
      target={isInternal ? undefined : "_blank"}
      rel={isInternal ? undefined : "noopener noreferrer"}
      onClick={handleClick}
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

// ── Backup plans panel (reference only, no selection) ────────
function BackupsPanel({ options }: { options: EventOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3" style={{ borderTop: "1px solid var(--t-border)", paddingTop: 12 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--t-text-faint)",
          }}
        >
          {open ? "▲" : "▼"}
        </span>
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--t-text-faint)",
          }}
        >
          Backup plans
        </span>
      </button>

      {open && (
        <div className="mt-2">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="rounded-lg p-3 mb-2 last:mb-0"
              style={{
                background: "var(--t-surface)",
                border: "1px solid var(--t-border)",
              }}
            >
              <p
                className="font-display italic mb-1"
                style={{ fontSize: "15px", color: "var(--t-text-muted)" }}
              >
                {opt.name}
              </p>
              <p className="leading-relaxed mb-2" style={{ fontSize: "11px", color: "var(--t-text-dim)" }}>
                {opt.description}
              </p>
              {opt.links.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {opt.links.map((l) => (
                    <LinkButton key={l.href + l.label} link={l} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
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
            background: "var(--t-surface-next)",
            border: "1px solid var(--t-border-hi)",
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <p
              className="font-display italic"
              style={{ fontSize: "17px", color: "var(--t-text)" }}
            >
              ✓ {chosen.name}
            </p>
            <button
              onClick={reset}
              style={{
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "var(--t-text-dim)",
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
          <p className="leading-relaxed mb-2" style={{ fontSize: "11px", color: "var(--t-text-muted)" }}>
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
          color: "var(--t-text-dim)",
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
              background: isExpanded ? "var(--t-surface-next)" : "var(--t-surface)",
              border: `1px solid ${isExpanded ? "var(--t-border-hi)" : "var(--t-border-mid)"}`,
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
                style={{ fontSize: "15px", color: isExpanded ? "var(--t-text)" : "var(--t-text-muted)" }}
              >
                {opt.name}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "var(--t-text-dim)",
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
                <p className="leading-relaxed mb-3" style={{ fontSize: "11px", color: "var(--t-text-muted)" }}>
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
                    background: "var(--t-surface-next)",
                    border: "1px solid var(--t-border-hi)",
                    color: "var(--t-accent)",
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

export default function EventCard({ event, isNext, isPast, onLongPress }: EventCardProps) {
  const cfg = TYPE_CONFIG[event.type];
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dotPulse, setDotPulse] = useState(false);

  let timeStr = "—";
  let period = "";
  if (event.time) {
    const [h, m] = event.time.split(":").map(Number);
    period = h >= 12 ? "pm" : "am";
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    timeStr = `${hour12}:${String(m).padStart(2, "0")}`;
  }

  function startPress() {
    pressTimer.current = setTimeout(() => {
      setDotPulse(true);
      setTimeout(() => setDotPulse(false), 600);
      onLongPress?.();
    }, 600);
  }
  function cancelPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }

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
        <span className="block" style={{ color: isNext ? cfg.accent : "var(--t-text-dim)" }}>{timeStr}</span>
        <span className="block" style={{ color: "var(--t-text-faint)", fontSize: "9px", letterSpacing: "0.05em" }}>{period}</span>
      </div>

      {/* Timeline dot — long-press to flag as current */}
      <div
        className="flex-shrink-0 relative"
        style={{ marginTop: 18, marginLeft: -5, zIndex: 1, padding: 6, margin: "12px -11px 0", cursor: "default" }}
        onPointerDown={onLongPress ? startPress : undefined}
        onPointerUp={onLongPress ? cancelPress : undefined}
        onPointerCancel={onLongPress ? cancelPress : undefined}
        onPointerLeave={onLongPress ? cancelPress : undefined}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: isNext ? cfg.dot : "var(--t-border-mid)",
            border: `1.5px solid ${isNext ? cfg.dot : "var(--t-border-hi)"}`,
            outline: dotPulse ? `5px solid rgba(109,184,126,0.35)` : isNext ? `3px solid rgba(109,184,126,0.15)` : "none",
            transition: "all 0.3s ease",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="event-card flex-1 rounded-xl p-4 ml-3 mb-0"
        style={{
          background: "var(--t-surface)",
          border: `1px solid var(--t-border)`,
          boxShadow: "var(--t-card-shadow)",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
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
          style={{ fontSize: "22px", color: "var(--t-text)", transition: "color 0.4s" }}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p className="leading-relaxed mb-0" style={{ fontSize: "12px", color: "var(--t-text-muted)", transition: "color 0.4s" }}>
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
              color: "var(--t-accent)",
              background: "var(--t-surface-next)",
              borderLeft: "2px solid var(--t-accent-dim)",
            }}
          >
            {event.note}
          </div>
        )}

        {/* Backup plans */}
        {event.bailouts && event.bailouts.length > 0 && (
          <BackupsPanel options={event.bailouts} />
        )}

        {/* Playlist */}
        {event.playlist && <PlaylistCard playlist={event.playlist} />}
      </div>
    </div>
  );
}
