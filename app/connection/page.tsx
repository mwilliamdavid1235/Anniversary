"use client";

import { useState } from "react";
import Link from "next/link";

const SECTIONS = [
  {
    id: "memories",
    label: "Memories",
    color: "#C47A8A",
    prompts: [
      "What's a moment from our life together that you still think about — one you haven't mentioned in a while?",
      "What's something I did early on that made you think 'this is the one'?",
      "What trip, night, or season was a turning point for us?",
      "What's your favorite version of us?",
    ],
  },
  {
    id: "right-now",
    label: "Right Now",
    color: "#6DB87E",
    prompts: [
      "What's something you've been carrying lately that you haven't said out loud?",
      "What's one thing about our life right now that you want to protect?",
      "When did you last feel really seen by me — and what was I doing?",
      "What do you need more of from me right now?",
    ],
  },
  {
    id: "us",
    label: "Us",
    color: "#9B8FC4",
    prompts: [
      "What's something about how we love each other that you think is rare?",
      "What do you think I still don't fully understand about you?",
      "What's a version of us you want to live into in the next few years?",
      "What are you most proud of about what we've built together?",
    ],
  },
  {
    id: "forward",
    label: "Looking Forward",
    color: "#C49A45",
    prompts: [
      "What's something you want us to do together that we haven't yet?",
      "If we could design next year from scratch — what does it look like?",
      "What's a dream you've been holding quietly that you want me to know about?",
      "What do you want us to say about this chapter when we look back on it?",
    ],
  },
];

export default function ConnectionPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  const section = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#060E05", color: "#E2D9C6" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
        style={{
          background: "rgba(6,14,5,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #0D1A0C",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#3A5040",
            textDecoration: "none",
          }}
        >
          ← Back
        </Link>
        <p
          style={{
            fontSize: "9px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#2D4D28",
          }}
        >
          Connection Guide
        </p>
        <div style={{ width: 40 }} />
      </div>

      <div className="px-5 pt-8 pb-16 max-w-lg mx-auto">
        {/* Title */}
        <h1
          className="font-display italic mb-1"
          style={{ fontSize: "34px", color: "#E2D9C6", lineHeight: 1.1 }}
        >
          A Night for Two
        </h1>
        <p
          className="mb-8 leading-relaxed"
          style={{ fontSize: "13px", color: "#4A6B50" }}
        >
          Take turns. Go as deep or as light as the night calls for.
          There are no wrong answers here.
        </p>

        {/* Section tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSection(s.id);
                setActivePrompt(null);
              }}
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: "4px",
                border: `1px solid ${activeSection === s.id ? s.color : "#1E3319"}`,
                background:
                  activeSection === s.id
                    ? `${s.color}20`
                    : "rgba(255,255,255,0.02)",
                color: activeSection === s.id ? s.color : "#3A5040",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Prompts */}
        <div>
          {section.prompts.map((prompt, i) => {
            const isOpen = activePrompt === `${section.id}-${i}`;
            return (
              <button
                key={i}
                onClick={() =>
                  setActivePrompt(isOpen ? null : `${section.id}-${i}`)
                }
                className="w-full text-left mb-3 rounded-xl"
                style={{
                  padding: "16px 18px",
                  background: isOpen
                    ? `${section.color}12`
                    : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isOpen ? section.color + "50" : "#1A2E18"}`,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <p
                    className="font-display italic leading-snug"
                    style={{
                      fontSize: isOpen ? "20px" : "17px",
                      color: isOpen ? "#E2D9C6" : "#7A9980",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {prompt}
                  </p>
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#2D4D28",
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  >
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
                {isOpen && (
                  <p
                    className="mt-3"
                    style={{
                      fontSize: "11px",
                      color: "#3A5040",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Take your time. There's no rush.
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div
          className="mt-10 rounded-xl p-4 text-center"
          style={{
            background: "rgba(196,122,138,0.06)",
            border: "1px solid #4A1F2A",
          }}
        >
          <p
            className="font-display italic mb-1"
            style={{ fontSize: "18px", color: "#9B5A6A" }}
          >
            Twenty-Eight Years
          </p>
          <p style={{ fontSize: "11px", color: "#4A2030" }}>
            May 15, 2026 — Stellara Resort
          </p>
        </div>
      </div>
    </div>
  );
}
