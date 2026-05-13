"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SECTIONS = [
  {
    id: "memories",
    label: "Memories",
    color: "#C47A8A",
    questions: [
      { id: "m1", text: "What's a moment from our life together that you still think about — one you haven't mentioned in a while?" },
      { id: "m2", text: "What's something I did early on that made you think 'this is the one'?" },
      { id: "m3", text: "What trip, night, or season was a turning point for us?" },
      { id: "m4", text: "What's your favorite version of us?" },
    ],
  },
  {
    id: "right-now",
    label: "Right Now",
    color: "#6DB87E",
    questions: [
      { id: "rn1", text: "What's something you've been carrying lately that you haven't said out loud?" },
      { id: "rn2", text: "What's one thing about our life right now that you want to protect?" },
      { id: "rn3", text: "When did you last feel really seen by me — and what was I doing?" },
      { id: "rn4", text: "What do you need more of from me right now?" },
    ],
  },
  {
    id: "us",
    label: "Us",
    color: "#9B8FC4",
    questions: [
      { id: "u1", text: "What's something about how we love each other that you think is rare?" },
      { id: "u2", text: "What do you think I still don't fully understand about you?" },
      { id: "u3", text: "What's a version of us you want to live into in the next few years?" },
      { id: "u4", text: "What are you most proud of about what we've built together?" },
    ],
  },
  {
    id: "forward",
    label: "Looking Forward",
    color: "#C49A45",
    questions: [
      { id: "f1", text: "What's something you want us to do together that we haven't yet?" },
      { id: "f2", text: "If we could design next year from scratch — what does it look like?" },
      { id: "f3", text: "What's a dream you've been holding quietly that you want me to know about?" },
      { id: "f4", text: "What do you want us to say about this chapter when we look back on it?" },
    ],
  },
];

function storageKey(questionId: string) {
  return `connection-answer-${questionId}`;
}

function AnswerCard({
  question,
  sectionColor,
}: {
  question: { id: string; text: string };
  sectionColor: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(question.id));
    if (stored) setAnswer(stored);
  }, [question.id]);

  useEffect(() => {
    if (isOpen && textareaRef.current && answer === "") {
      textareaRef.current.focus();
    }
  }, [isOpen, answer]);

  function handleChange(val: string) {
    setAnswer(val);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(storageKey(question.id), val);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 600);
  }

  const hasAnswer = answer.trim().length > 0;

  return (
    <div
      className="mb-3 rounded-xl overflow-hidden"
      style={{
        background: isOpen ? `${sectionColor}0D` : "rgba(255,255,255,0.025)",
        border: `1px solid ${isOpen ? sectionColor + "50" : hasAnswer ? "#2D5038" : "#1A2E18"}`,
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Question header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full text-left flex items-start justify-between gap-3"
        style={{ padding: "16px 18px", background: "none", border: "none", cursor: "pointer" }}
      >
        <p
          className="font-display italic leading-snug"
          style={{
            fontSize: isOpen ? "20px" : "17px",
            color: isOpen ? "#E2D9C6" : hasAnswer ? "#A8C0A8" : "#7A9980",
            transition: "font-size 0.15s ease, color 0.15s ease",
          }}
        >
          {hasAnswer && !isOpen && (
            <span style={{ fontSize: "10px", color: "#2D5038", marginRight: 8, verticalAlign: "middle" }}>✓</span>
          )}
          {question.text}
        </p>
        <span style={{ fontSize: "9px", color: "#2D4D28", flexShrink: 0, marginTop: 5 }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Answer area */}
      {isOpen && (
        <div style={{ padding: "0 18px 18px" }}>
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Your answer…"
            rows={4}
            className="w-full rounded-xl outline-none resize-none leading-relaxed"
            style={{
              background: "rgba(11,19,9,0.6)",
              border: `1px solid ${hasAnswer ? "#2D5038" : "#1E3319"}`,
              color: "#E2D9C6",
              fontSize: "14px",
              padding: "12px 14px",
              fontFamily: "var(--font-dm-mono), monospace",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#2D4D28"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = hasAnswer ? "#2D5038" : "#1E3319"; }}
          />
          {saved && (
            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#6DB87E", marginTop: 6 }}>
              ✓ saved
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ConnectionPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const section = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="min-h-screen" style={{ background: "#060E05", color: "#E2D9C6" }}>
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
          style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3A5040", textDecoration: "none" }}
        >
          ← Back
        </Link>
        <p style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#2D4D28" }}>
          Connection
        </p>
        <div style={{ width: 40 }} />
      </div>

      <div className="px-5 pt-8 pb-16 max-w-lg mx-auto">
        {/* Title */}
        <h1 className="font-display italic mb-1" style={{ fontSize: "34px", color: "#E2D9C6", lineHeight: 1.1 }}>
          A Night for Two
        </h1>
        <p className="mb-8 leading-relaxed" style={{ fontSize: "13px", color: "#4A6B50" }}>
          Take turns. Go as deep or as light as the night calls for. There are no wrong answers here.
        </p>

        {/* Section tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: "4px",
                border: `1px solid ${activeSection === s.id ? s.color : "#1E3319"}`,
                background: activeSection === s.id ? `${s.color}20` : "rgba(255,255,255,0.02)",
                color: activeSection === s.id ? s.color : "#3A5040",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div key={activeSection}>
          {section.questions.map((q) => (
            <AnswerCard key={q.id} question={q} sectionColor={section.color} />
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-10 rounded-xl p-4 text-center"
          style={{ background: "rgba(196,122,138,0.06)", border: "1px solid #4A1F2A" }}
        >
          <p className="font-display italic mb-1" style={{ fontSize: "18px", color: "#9B5A6A" }}>
            Twenty-Eight Years
          </p>
          <p style={{ fontSize: "11px", color: "#4A2030" }}>May 15, 2026 — Stellara Resort</p>
        </div>
      </div>
    </div>
  );
}
