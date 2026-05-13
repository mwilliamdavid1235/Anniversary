"use client";

import { useState, useRef } from "react";
import {
  EXPLORATION_RESPONSE_ORDER,
  EXPLORATION_OPTION_LABELS,
  type GridResponse,
} from "@/lib/exploration-items";

const I = {
  bg: "#0C0810",
  edge: "#2E1F40",
  edgeHi: "#4A2D5A",
  text: "#EDE0E8",
  textMuted: "#9B7FA8",
  textFaint: "#6B4A7A",
  textDim: "#3D2850",
  rose: "#C47EA0",
  gold: "#C49A45",
};

const OPTION_COLORS: Record<GridResponse, { dot: string; border: string; textColor: string }> = {
  strong:       { dot: "#C49A45", border: "#C49A45",   textColor: I.text },
  yes:          { dot: "#C47EA0", border: "#C47EA0",   textColor: I.text },
  curious:      { dot: I.gold,   border: "#7A5F25",    textColor: I.text },
  fantasy_only: { dot: "#9B7FA8", border: "#4A2D5A",   textColor: I.text },
  no:           { dot: I.textDim, border: I.edge,      textColor: I.textMuted },
};

interface ExplorationAnswerData {
  response: GridResponse;
  comment?: string;
}

interface ExplorationGridProps {
  items: { id: string; label: string; description: string }[];
  values: Record<string, ExplorationAnswerData>;
  onResponseChange: (itemId: string, response: GridResponse) => void;
  onCommentChange: (itemId: string, comment: string) => void;
}

function ExplorationItem({
  item,
  value,
  onResponseChange,
  onCommentChange,
}: {
  item: { id: string; label: string; description: string };
  value: ExplorationAnswerData | undefined;
  onResponseChange: (response: GridResponse) => void;
  onCommentChange: (comment: string) => void;
}) {
  const commentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localComment, setLocalComment] = useState(value?.comment ?? "");

  const selected = value?.response;
  const colors = selected ? OPTION_COLORS[selected] : null;

  function handleCommentChange(val: string) {
    setLocalComment(val);
    if (commentTimer.current) clearTimeout(commentTimer.current);
    commentTimer.current = setTimeout(() => onCommentChange(val), 600);
  }

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200"
      style={{
        background: selected ? "rgba(196,126,160,0.04)" : "rgba(13,11,16,0.4)",
        border: `1px solid ${selected ? (colors?.border ?? I.edgeHi) : I.edge}`,
      }}
    >
      {/* Item label + description */}
      <p style={{ fontSize: "14px", color: I.text, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, marginBottom: 4 }}>
        {item.label}
      </p>
      <p style={{ fontSize: "11px", color: I.textFaint, lineHeight: 1.5, marginBottom: 14 }}>
        {item.description}
      </p>

      {/* 6 vertical radio options */}
      <div className="flex flex-col gap-2">
        {EXPLORATION_RESPONSE_ORDER.map((opt) => {
          const isSelected = selected === opt;
          const c = OPTION_COLORS[opt];
          const label = EXPLORATION_OPTION_LABELS[opt];
          return (
            <button
              key={opt}
              onClick={() => onResponseChange(opt)}
              className="flex items-start gap-3 rounded-lg text-left transition-all duration-100 active:scale-[0.99]"
              style={{
                padding: "9px 12px",
                background: isSelected ? `rgba(${hexToRgb(c.dot)}, 0.08)` : "transparent",
                border: `1px solid ${isSelected ? c.border : "transparent"}`,
                cursor: "pointer",
              }}
            >
              <span
                className="flex-shrink-0 mt-0.5"
                style={{ fontSize: "13px", color: isSelected ? c.dot : I.textDim, lineHeight: 1 }}
              >
                {isSelected ? "◆" : "◇"}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ fontSize: "13px", color: isSelected ? c.textColor : I.textMuted, fontFamily: "var(--font-dm-mono), monospace", display: "block", marginBottom: 1 }}>
                  {label.short}
                </span>
                <span style={{ fontSize: "11px", color: I.textFaint, lineHeight: 1.4 }}>
                  {label.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Optional comment — appears once any option selected */}
      {selected && (
        <div className="mt-4 fade-up">
          <p style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.textDim, marginBottom: 6 }}>
            Anything you want to add?
          </p>
          <textarea
            value={localComment}
            onChange={(e) => handleCommentChange(e.target.value)}
            placeholder="Optional note…"
            rows={2}
            className="w-full rounded-lg outline-none resize-none leading-relaxed"
            style={{
              background: "rgba(13,11,16,0.6)",
              border: `1px solid ${I.edge}`,
              color: I.text,
              fontSize: "13px",
              padding: "9px 12px",
              fontFamily: "var(--font-dm-mono), monospace",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = I.edgeHi; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = I.edge; }}
          />
        </div>
      )}
    </div>
  );
}

// Minimal hex → "r,g,b" helper for rgba() usage
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

export default function ExplorationGrid({
  items,
  values,
  onResponseChange,
  onCommentChange,
}: ExplorationGridProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <ExplorationItem
          key={item.id}
          item={item}
          value={values[item.id]}
          onResponseChange={(r) => onResponseChange(item.id, r)}
          onCommentChange={(c) => onCommentChange(item.id, c)}
        />
      ))}
    </div>
  );
}
