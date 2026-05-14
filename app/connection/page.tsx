"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";

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

const PARTNER: Record<Person, string> = { mary: "MD", md: "Mary" };

// ── AnswerCard ────────────────────────────────────────────────

function AnswerCard({
  question,
  sectionColor,
  isOpen,
  onToggle,
  answer,
  onAnswerChange,
  locked,
}: {
  question: { id: string; text: string };
  sectionColor: string;
  isOpen: boolean;
  onToggle: () => void;
  answer: string;
  onAnswerChange: (val: string) => void;
  locked: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current && !answer) {
      textareaRef.current.focus();
    }
  }, [isOpen, answer]);

  function handleChange(val: string) {
    onAnswerChange(val);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
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
      <button
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        className="w-full text-left flex items-start justify-between gap-3"
        style={{ padding: "16px 18px", background: "none", border: "none", cursor: locked ? "default" : "pointer" }}
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
        {!locked && (
          <span style={{ fontSize: "9px", color: "#2D4D28", flexShrink: 0, marginTop: 5 }}>
            {isOpen ? "▲" : "▼"}
          </span>
        )}
      </button>

      {/* Answer preview when collapsed */}
      {!isOpen && hasAnswer && (
        <p
          style={{
            padding: "0 18px 14px",
            fontSize: "12px",
            color: "#4A6B50",
            lineHeight: 1.5,
            marginTop: -6,
          }}
        >
          {answer.length > 90 ? answer.slice(0, 90) + "…" : answer}
        </p>
      )}

      {/* Answer textarea when open */}
      {isOpen && !locked && (
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

// ── DiscussScreen ─────────────────────────────────────────────

function DiscussScreen({
  section,
  person,
  myAnswers,
  partnerAnswers,
  summary,
  isLastSection,
  onNext,
}: {
  section: typeof SECTIONS[0];
  person: Person;
  myAnswers: Record<string, string>;
  partnerAnswers: Record<string, string>;
  summary: string;
  isLastSection: boolean;
  onNext: () => void;
}) {
  const myName = person === "mary" ? "Mary" : "MD";
  const partnerName = PARTNER[person];

  return (
    <div className="fade-up">
      {/* Summary card */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{
          background: `${section.color}0D`,
          border: `1px solid ${section.color}30`,
        }}
      >
        <p
          style={{
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: section.color,
            marginBottom: 10,
            opacity: 0.7,
          }}
        >
          ✦ To discuss
        </p>
        <p
          className="font-display italic leading-relaxed"
          style={{ fontSize: "18px", color: "#E2D9C6" }}
        >
          {summary}
        </p>
      </div>

      {/* Both sets of answers */}
      <div className="space-y-5 mb-8">
        {section.questions.map((q) => {
          const myA = myAnswers[q.id]?.trim();
          const partnerA = partnerAnswers[q.id]?.trim();
          return (
            <div key={q.id}>
              <p
                style={{
                  fontSize: "11px",
                  color: "#4A6B50",
                  marginBottom: 8,
                  lineHeight: 1.4,
                  fontStyle: "italic",
                }}
              >
                {q.text}
              </p>
              <div className="flex flex-col gap-2">
                {myA && (
                  <div
                    className="rounded-lg px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1E3319" }}
                  >
                    <p style={{ fontSize: "9px", letterSpacing: "0.12em", color: "#3A5040", marginBottom: 4, textTransform: "uppercase" }}>{myName}</p>
                    <p style={{ fontSize: "13px", color: "#B8C8B8", lineHeight: 1.5 }}>{myA}</p>
                  </div>
                )}
                {partnerA && (
                  <div
                    className="rounded-lg px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1E3319" }}
                  >
                    <p style={{ fontSize: "9px", letterSpacing: "0.12em", color: "#3A5040", marginBottom: 4, textTransform: "uppercase" }}>{partnerName}</p>
                    <p style={{ fontSize: "13px", color: "#B8C8B8", lineHeight: 1.5 }}>{partnerA}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next section / intimacy teaser */}
      {isLastSection ? (
        <div
          className="rounded-xl p-5 text-center"
          style={{ background: "rgba(155,143,196,0.08)", border: "1px solid rgba(155,143,196,0.25)" }}
        >
          <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9B8FC4", marginBottom: 10, opacity: 0.8 }}>
            ✦ You finished Connection
          </p>
          <p className="font-display italic mb-2" style={{ fontSize: "22px", color: "#E2D9C6" }}>
            Ready to go deeper?
          </p>
          <p style={{ fontSize: "13px", color: "#6B5A8A", marginBottom: 20, lineHeight: 1.5 }}>
            Intimacy picks up where this left off — what you want, what you need, and what you haven&apos;t said yet.
          </p>
          <a
            href="/intimacy"
            className="block w-full rounded-xl py-4 transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(155,143,196,0.15)",
              border: "1px solid rgba(155,143,196,0.4)",
              color: "#C4B8E8",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "block",
            }}
          >
            Begin Intimacy →
          </a>
        </div>
      ) : (
        <button
          onClick={onNext}
          className="w-full rounded-xl py-4 transition-all duration-200 active:scale-95"
          style={{
            background: `${section.color}20`,
            border: `1px solid ${section.color}50`,
            color: section.color,
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Next section →
        </button>
      )}
    </div>
  );
}

// ── Locked screen ─────────────────────────────────────────────
const LOCKED_MSGS = [
  "Easy, tiger. That one's for later tonight. ♡",
  "Good things come to those who wait — and tonight has very good things. ♡",
  "Build the anticipation a little. Trust the process. ♡",
  "Not yet. Pour a drink first. Then we'll talk. ♡",
];

function LockedScreen() {
  const msg = LOCKED_MSGS[Math.floor(Math.random() * LOCKED_MSGS.length)];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#0B1309" }}>
      <div style={{ fontSize: 36, marginBottom: 20 }}>🔒</div>
      <h1 className="font-display italic mb-4" style={{ fontSize: "clamp(26px,7vw,38px)", color: "#E2D9C6", lineHeight: 1.2 }}>
        Not quite yet.
      </h1>
      <p style={{ fontSize: "14px", color: "#6E8A74", maxWidth: 300, lineHeight: 1.75, fontStyle: "italic" }}>
        {msg}
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function ConnectionPage() {
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [locked, setLocked] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(SECTIONS[0].id);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [myAnswers, setMyAnswers] = useState<Record<string, string>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, string>>({});
  const [submittedSections, setSubmittedSections] = useState<Set<string>>(new Set());
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [waitingForSummary, setWaitingForSummary] = useState(false);
  const generatingRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const section = SECTIONS.find((s) => s.id === activeSectionId)!;
  const sectionIdx = SECTIONS.findIndex((s) => s.id === activeSectionId);
  const isLastSection = sectionIdx === SECTIONS.length - 1;

  // ── Hydrate ──────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem("connection_locked") === "true") { setLocked(true); setHydrated(true); return; }
    const p = localStorage.getItem("connection_person") as Person | null;
    const sid = localStorage.getItem("connection_section") ?? SECTIONS[0].id;
    const submitted = JSON.parse(localStorage.getItem("connection_submitted") ?? "[]") as string[];
    if (p) setPerson(p);
    setActiveSectionId(SECTIONS.find((s) => s.id === sid) ? sid : SECTIONS[0].id);
    setSubmittedSections(new Set(submitted));
    setHydrated(true);
  }, []);

  // ── Load answers from Supabase ────────────────────────────
  const loadMyAnswers = useCallback(async (p: Person) => {
    const res = await fetch(`/api/connection/answers?person=${p}`);
    if (!res.ok) return;
    const { answers } = await res.json();
    const map: Record<string, string> = {};
    for (const a of answers ?? []) map[a.question_id] = a.answer_text ?? "";
    setMyAnswers(map);
  }, []);

  const loadPartnerAnswers = useCallback(async (p: Person) => {
    const partner = p === "mary" ? "md" : "mary";
    const res = await fetch(`/api/connection/answers?person=${partner}`);
    if (!res.ok) return;
    const { answers } = await res.json();
    const map: Record<string, string> = {};
    for (const a of answers ?? []) map[a.question_id] = a.answer_text ?? "";
    setPartnerAnswers(map);
  }, []);

  useEffect(() => {
    if (!person || !hydrated) return;
    loadMyAnswers(person);
    loadPartnerAnswers(person);
    pollRef.current = setInterval(() => loadPartnerAnswers(person), 15_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, hydrated, loadMyAnswers, loadPartnerAnswers]);

  // ── Save answer ───────────────────────────────────────────
  function handleAnswerChange(questionId: string, val: string) {
    setMyAnswers((prev) => ({ ...prev, [questionId]: val }));
    if (saveTimers.current[questionId]) clearTimeout(saveTimers.current[questionId]);
    saveTimers.current[questionId] = setTimeout(async () => {
      if (!person) return;
      await fetch("/api/connection/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, question_id: questionId, answer_text: val }),
      });
    }, 800);
  }

  // ── Section state helpers ─────────────────────────────────
  function sectionAllAnswered(sec: typeof SECTIONS[0], answers: Record<string, string>) {
    return sec.questions.every((q) => answers[q.id]?.trim());
  }

  const myComplete = sectionAllAnswered(section, myAnswers);
  const partnerComplete = sectionAllAnswered(section, partnerAnswers);
  const isSubmitted = submittedSections.has(activeSectionId);
  const hasSummary = !!summaries[activeSectionId];
  const showDiscuss = isSubmitted && partnerComplete && hasSummary;

  // ── Generate summary when both complete ──────────────────
  useEffect(() => {
    if (!isSubmitted || !partnerComplete || hasSummary || generatingRef.current || !person) return;
    generatingRef.current = true;
    setWaitingForSummary(true);
    const [maryMap, mdMap] =
      person === "mary"
        ? [myAnswers, partnerAnswers]
        : [partnerAnswers, myAnswers];
    fetch("/api/connection/discuss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionLabel: section.label,
        questions: section.questions,
        maryAnswers: maryMap,
        mdAnswers: mdMap,
      }),
    })
      .then((r) => r.json())
      .then(({ summary }) => {
        setSummaries((prev) => ({
          ...prev,
          [activeSectionId]: summary || "Talk through what stood out in this section together.",
        }));
      })
      .catch(() => {
        setSummaries((prev) => ({
          ...prev,
          [activeSectionId]: "Talk through what stood out in this section together.",
        }));
      })
      .finally(() => {
        generatingRef.current = false;
        setWaitingForSummary(false);
      });
  }, [isSubmitted, partnerComplete, hasSummary, person, activeSectionId, section.label, myAnswers, partnerAnswers]);

  // ── Submit section ────────────────────────────────────────
  function handleSubmit() {
    const next = new Set([...submittedSections, activeSectionId]);
    setSubmittedSections(next);
    localStorage.setItem("connection_submitted", JSON.stringify([...next]));
    setOpenQuestionId(null);
  }

  // ── Select person ─────────────────────────────────────────
  function selectPerson(p: Person) {
    localStorage.setItem("connection_person", p);
    setPerson(p);
  }

  // ── Navigate sections ─────────────────────────────────────
  function goToSection(id: string) {
    setActiveSectionId(id);
    localStorage.setItem("connection_section", id);
    setOpenQuestionId(null);
  }

  function goNextSection() {
    const nextIdx = sectionIdx + 1;
    if (nextIdx < SECTIONS.length) goToSection(SECTIONS[nextIdx].id);
  }

  // ── Toggle accordion ──────────────────────────────────────
  function toggleQuestion(qid: string) {
    setOpenQuestionId((prev) => (prev === qid ? null : qid));
  }

  if (!hydrated) return null;
  if (locked) return <LockedScreen />;
  if (!person) return <PersonSelector onSelect={selectPerson} />;

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
        <p style={{ fontSize: "10px", color: "#3A5040" }}>
          {person === "mary" ? "Mary" : "MD"}
        </p>
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
              onClick={() => goToSection(s.id)}
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: "4px",
                border: `1px solid ${activeSectionId === s.id ? s.color : "#1E3319"}`,
                background: activeSectionId === s.id ? `${s.color}20` : "rgba(255,255,255,0.02)",
                color: activeSectionId === s.id ? s.color : "#3A5040",
                cursor: "pointer",
                transition: "all 0.15s ease",
                position: "relative",
              }}
            >
              {s.label}
              {submittedSections.has(s.id) && sectionAllAnswered(s, partnerAnswers) && (
                <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: s.color, display: "block" }} />
              )}
            </button>
          ))}
        </div>

        {/* Section label */}
        <p
          className="font-display italic mb-5"
          style={{ fontSize: "22px", color: section.color }}
        >
          {section.label}
        </p>

        {/* Main content */}
        {showDiscuss ? (
          <DiscussScreen
            section={section}
            person={person}
            myAnswers={myAnswers}
            partnerAnswers={partnerAnswers}
            summary={summaries[activeSectionId]}
            isLastSection={isLastSection}
            onNext={goNextSection}
          />
        ) : (
          <div key={activeSectionId}>
            {/* Questions accordion */}
            {section.questions.map((q) => (
              <AnswerCard
                key={q.id}
                question={q}
                sectionColor={section.color}
                isOpen={openQuestionId === q.id}
                onToggle={() => toggleQuestion(q.id)}
                answer={myAnswers[q.id] ?? ""}
                onAnswerChange={(val) => handleAnswerChange(q.id, val)}
                locked={isSubmitted}
              />
            ))}

            {/* Waiting / Submit area */}
            {isSubmitted ? (
              <div
                className="mt-6 rounded-xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1A2E18" }}
              >
                {waitingForSummary ? (
                  <>
                    <p style={{ fontSize: "11px", color: "#4A6B50", marginBottom: 4 }}>Reading your answers…</p>
                    <p style={{ fontSize: "10px", color: "#2D4D28" }}>Just a moment</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "11px", color: "#4A6B50", marginBottom: 4 }}>
                      Your answers are in. Waiting for {PARTNER[person]}…
                    </p>
                    <p style={{ fontSize: "10px", color: "#2D4D28" }}>
                      The discussion will open when they finish this section.
                    </p>
                  </>
                )}
              </div>
            ) : myComplete ? (
              <button
                onClick={handleSubmit}
                className="w-full mt-5 rounded-xl py-4 transition-all duration-200 active:scale-95"
                style={{
                  background: `${section.color}18`,
                  border: `1px solid ${section.color}40`,
                  color: section.color,
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Submit my answers
              </button>
            ) : (
              <div className="mt-4">
                <p style={{ fontSize: "10px", color: "#2D4D28", textAlign: "center" }}>
                  {section.questions.filter((q) => myAnswers[q.id]?.trim()).length} / {section.questions.length} answered
                </p>
              </div>
            )}
          </div>
        )}

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
