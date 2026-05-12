"use client";

import type { GridResponse } from "@/lib/intimacy-questions";

interface ExplorationGridProps {
  items: string[];
  values: Record<string, GridResponse>;
  onChange: (item: string, value: GridResponse) => void;
  palette?: "forest" | "intimate";
}

const OPTIONS: { value: GridResponse; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "not_for_me", label: "Not for me" },
];

const COLORS: Record<GridResponse, { bg: string; border: string; text: string }> = {
  yes:        { bg: "rgba(196,126,160,0.15)", border: "#C47EA0", text: "#EDE0E8" },
  maybe:      { bg: "rgba(196,154,69,0.1)",  border: "#7A5F25", text: "#C49A45" },
  not_for_me: { bg: "rgba(13,11,16,0.5)",    border: "#2E1F40", text: "#6B4A7A" },
};

export default function ExplorationGrid({
  items,
  values,
  onChange,
}: ExplorationGridProps) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* Header row */}
      <div
        className="grid gap-1 mb-1"
        style={{ gridTemplateColumns: "1fr repeat(3, 80px)" }}
      >
        <div />
        {OPTIONS.map((o) => (
          <div
            key={o.value}
            className="text-center"
            style={{
              fontSize: "8px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6B4A7A",
            }}
          >
            {o.label}
          </div>
        ))}
      </div>

      {items.map((item, idx) => {
        const current = values[item];
        return (
          <div
            key={idx}
            className="grid items-center gap-1 rounded-lg"
            style={{
              gridTemplateColumns: "1fr repeat(3, 80px)",
              background: current ? COLORS[current].bg : "rgba(13,11,16,0.3)",
              border: `1px solid ${current ? COLORS[current].border : "#2E1F40"}`,
              padding: "10px 12px",
              transition: "all 0.15s ease",
            }}
          >
            <p style={{ fontSize: "12px", color: "#EDE0E8", lineHeight: 1.3 }}>{item}</p>
            {OPTIONS.map((o) => {
              const isSelected = current === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => onChange(item, o.value)}
                  className="flex items-center justify-center rounded transition-all duration-100 active:scale-95"
                  style={{
                    height: 32,
                    background: isSelected ? COLORS[o.value].bg : "transparent",
                    border: `1px solid ${isSelected ? COLORS[o.value].border : "#2E1F40"}`,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: isSelected ? COLORS[o.value].text : "#3D2850",
                    }}
                  >
                    {isSelected ? "◆" : "◇"}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
