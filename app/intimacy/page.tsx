"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PasswordGate from "@/components/sections/PasswordGate";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import { INTIMACY_QUESTIONS, INTIMACY_CATEGORIES } from "@/lib/intimacy-questions";

const PALETTE = {
  bg: "var(--t-bg)",
  edge: "var(--t-border)",
  text: "var(--t-text)",
  textMuted: "var(--t-text-muted)",
  textFaint: "var(--t-text-dim)",
  textDim: "var(--t-text-faint)",
};

const SECTION_COLORS: Record<string, string> = {
  "Acknowledgment":  "#C47EA0",
  "Safety & Access": "#9B8FC4",
  "Desire & Turn-On":"#C47A8A",
  "Pleasure":        "#B07A9A",
  "Exploration":     "#8A6FA8",
  "The Real Talk":   "#C49A45",
};

const SECTIONS = INTIMACY_CATEGORIES.map((cat) => ({
  id: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  label: cat,
  color: SECTION_COLORS[cat] ?? "#9B8FC4",
  questions: INTIMACY_QUESTIONS.filter((q) => q.category === cat).map((q) => ({
    id: q.id,
    text: q.text,
    kind: q.kind,
    options: q.options,
    placeholder: q.placeholder,
  })),
}));

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
  question: { id: string; text: string; kind?: string; options?: string[]; placeholder?: string };
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
    if (isOpen && textareaRef.current && !answer && question.kind !== "choice") {
      textareaRef.current.focus();
    }
  }, [isOpen, answer, question.kind]);

  function handleTextChange(val: string) {
    onAnswerChange(val);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 600);
  }

  function handleChoice(opt: string) {
    const next = answer === opt ? "" : opt;
    onAnswerChange(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const hasAnswer = answer.trim().length > 0;
  const isChoice = question.kind === "choice";

  return (
    <div
      className="mb-3 rounded-xl overflow-hidden"
      style={{
        background: isOpen ? `${sectionColor}0D` : "var(--t-surface)",
        border: `1px solid ${isOpen ? sectionColor + "50" : hasAnswer ? sectionColor + "30" : PALETTE.edge}`,
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
            color: isOpen ? PALETTE.text : hasAnswer ? PALETTE.textMuted : PALETTE.textFaint,
            transition: "font-size 0.15s ease, color 0.15s ease",
          }}
        >
          {hasAnswer && !isOpen && (
            <span style={{ fontSize: "10px", color: sectionColor, marginRight: 8, verticalAlign: "middle", opacity: 0.8 }}>✓</span>
          )}
          {question.text}
        </p>
        {!locked && (
          <span style={{ fontSize: "9px", color: PALETTE.textDim, flexShrink: 0, marginTop: 5 }}>
            {isOpen ? "▲" : "▼"}
          </span>
        )}
      </button>

      {/* Preview when collapsed */}
      {!isOpen && hasAnswer && (
        <p style={{ padding: "0 18px 14px", fontSize: "12px", color: PALETTE.textFaint, lineHeight: 1.5, marginTop: -6 }}>
          {answer.length > 90 ? answer.slice(0, 90) + "…" : answer}
        </p>
      )}

      {/* Input when open */}
      {isOpen && !locked && (
        <div style={{ padding: "0 18px 18px" }}>
          {isChoice ? (
            <div className="flex flex-col gap-2">
              {question.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleChoice(opt)}
                  className="text-left rounded-lg px-4 py-3 transition-all duration-150"
                  style={{
                    background: answer === opt ? `${sectionColor}20` : "var(--t-surface)",
                    border: `1px solid ${answer === opt ? sectionColor + "60" : PALETTE.edge}`,
                    color: answer === opt ? PALETTE.text : PALETTE.textMuted,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "8px", marginRight: 10, color: answer === opt ? sectionColor : PALETTE.textDim }}>
                    {answer === opt ? "◆" : "◇"}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={question.placeholder ?? "Your answer…"}
              rows={4}
              className="w-full rounded-xl outline-none resize-none leading-relaxed"
              style={{
                background: "var(--t-surface)",
                border: `1px solid ${hasAnswer ? sectionColor + "40" : PALETTE.edge}`,
                color: PALETTE.text,
                fontSize: "14px",
                padding: "12px 14px",
                fontFamily: "var(--font-dm-mono), monospace",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = sectionColor + "60"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = hasAnswer ? sectionColor + "40" : PALETTE.edge; }}
            />
          )}
          {saved && (
            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: sectionColor, marginTop: 6, opacity: 0.8 }}>
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
      <div
        className="rounded-xl p-5 mb-6"
        style={{ background: `${section.color}0D`, border: `1px solid ${section.color}30` }}
      >
        <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: section.color, marginBottom: 10, opacity: 0.7 }}>
          ✦ To discuss
        </p>
        <p className="font-display italic leading-relaxed" style={{ fontSize: "18px", color: PALETTE.text }}>
          {summary}
        </p>
      </div>

      <div className="space-y-5 mb-8">
        {section.questions.map((q) => {
          const myA = myAnswers[q.id]?.trim();
          const partnerA = partnerAnswers[q.id]?.trim();
          return (
            <div key={q.id}>
              <p style={{ fontSize: "11px", color: PALETTE.textFaint, marginBottom: 8, lineHeight: 1.4, fontStyle: "italic" }}>
                {q.text}
              </p>
              <div className="flex flex-col gap-2">
                {myA && (
                  <div className="rounded-lg px-3 py-2" style={{ background: "var(--t-surface)", border: `1px solid ${PALETTE.edge}` }}>
                    <p style={{ fontSize: "9px", letterSpacing: "0.12em", color: PALETTE.textDim, marginBottom: 4, textTransform: "uppercase" }}>{myName}</p>
                    <p style={{ fontSize: "13px", color: PALETTE.textMuted, lineHeight: 1.5 }}>{myA}</p>
                  </div>
                )}
                {partnerA && (
                  <div className="rounded-lg px-3 py-2" style={{ background: "var(--t-surface)", border: `1px solid ${PALETTE.edge}` }}>
                    <p style={{ fontSize: "9px", letterSpacing: "0.12em", color: PALETTE.textDim, marginBottom: 4, textTransform: "uppercase" }}>{partnerName}</p>
                    <p style={{ fontSize: "13px", color: PALETTE.textMuted, lineHeight: 1.5 }}>{partnerA}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isLastSection ? (
        <div
          className="rounded-xl p-5 text-center"
          style={{ background: "rgba(196,154,69,0.08)", border: "1px solid rgba(196,154,69,0.25)" }}
        >
          <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C49A45", marginBottom: 10, opacity: 0.8 }}>
            ✦ All six sections
          </p>
          <p className="font-display italic mb-2" style={{ fontSize: "22px", color: PALETTE.text }}>
            You made it through.
          </p>
          <p style={{ fontSize: "13px", color: PALETTE.textFaint, marginBottom: 20, lineHeight: 1.5 }}>
            That took honesty. Take a breath, then keep talking.
          </p>
          <Link
            href="/"
            style={{
              display: "block",
              padding: "14px",
              background: "rgba(196,154,69,0.12)",
              border: "1px solid rgba(196,154,69,0.35)",
              color: "#C49A45",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 12,
            }}
          >
            ← Back to itinerary
          </Link>
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

// ── Main page ─────────────────────────────────────────────────

export default function IntimacyPage() {
  const [pwUnlocked, setPwUnlocked] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
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

  const section = SECTIONS.find((s) => s.id === activeSectionId) ?? SECTIONS[0];
  const sectionIdx = SECTIONS.findIndex((s) => s.id === activeSectionId);
  const isLastSection = sectionIdx === SECTIONS.length - 1;

  // ── Hydrate ──────────────────────────────────────────────
  useEffect(() => {
    const pw = localStorage.getItem("intimacy_unlocked");
    const p = localStorage.getItem("intimacy_person") as Person | null;
    const sid = localStorage.getItem("intimacy_active_section") ?? SECTIONS[0].id;
    const submitted = JSON.parse(localStorage.getItem("intimacy_submitted") ?? "[]") as string[];
    if (pw === "true") setPwUnlocked(true);
    if (p) setPerson(p);
    setActiveSectionId(SECTIONS.find((s) => s.id === sid) ? sid : SECTIONS[0].id);
    setSubmittedSections(new Set(submitted));
    setHydrated(true);
  }, []);

  // ── Load answers ─────────────────────────────────────────
  const loadMyAnswers = useCallback(async (p: Person) => {
    const res = await fetch(`/api/intimacy/answers?person=${p}`);
    if (!res.ok) return;
    const { answers } = await res.json();
    const map: Record<string, string> = {};
    for (const a of answers ?? []) {
      map[a.question_id] = a.answer_text ?? a.selected_option ?? "";
    }
    setMyAnswers(map);
  }, []);

  const loadPartnerAnswers = useCallback(async (p: Person) => {
    const partner = p === "mary" ? "md" : "mary";
    const res = await fetch(`/api/intimacy/answers?person=${partner}`);
    if (!res.ok) return;
    const { answers } = await res.json();
    const map: Record<string, string> = {};
    for (const a of answers ?? []) {
      map[a.question_id] = a.answer_text ?? a.selected_option ?? "";
    }
    setPartnerAnswers(map);
  }, []);

  useEffect(() => {
    if (!person || !pwUnlocked) return;
    loadMyAnswers(person);
    loadPartnerAnswers(person);
    pollRef.current = setInterval(() => loadPartnerAnswers(person), 15_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, pwUnlocked, loadMyAnswers, loadPartnerAnswers]);

  // ── Save answer ──────────────────────────────────────────
  function handleAnswerChange(questionId: string, val: string) {
    setMyAnswers((prev) => ({ ...prev, [questionId]: val }));
    if (saveTimers.current[questionId]) clearTimeout(saveTimers.current[questionId]);
    saveTimers.current[questionId] = setTimeout(async () => {
      if (!person) return;
      await fetch("/api/intimacy/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, question_id: questionId, answer_text: val }),
      });
    }, 800);
  }

  // ── Section helpers ──────────────────────────────────────
  function sectionAllAnswered(sec: typeof SECTIONS[0], answers: Record<string, string>) {
    return sec.questions.every((q) => answers[q.id]?.trim());
  }

  const myComplete = sectionAllAnswered(section, myAnswers);
  const partnerComplete = sectionAllAnswered(section, partnerAnswers);
  const isSubmitted = submittedSections.has(activeSectionId);
  const hasSummary = !!summaries[activeSectionId];
  const showDiscuss = isSubmitted && partnerComplete && hasSummary;

  // ── Generate summary when both complete ─────────────────
  useEffect(() => {
    if (!isSubmitted || !partnerComplete || hasSummary || generatingRef.current || !person) return;
    generatingRef.current = true;
    setWaitingForSummary(true);
    const [maryMap, mdMap] =
      person === "mary"
        ? [myAnswers, partnerAnswers]
        : [partnerAnswers, myAnswers];
    fetch("/api/intimacy/discuss", {
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

  // ── Submit section ───────────────────────────────────────
  function handleSubmit() {
    const next = new Set([...submittedSections, activeSectionId]);
    setSubmittedSections(next);
    localStorage.setItem("intimacy_submitted", JSON.stringify([...next]));
    setOpenQuestionId(null);
  }

  // ── Person / unlock ──────────────────────────────────────
  function selectPerson(p: Person) {
    localStorage.setItem("intimacy_person", p);
    setPerson(p);
  }

  function handleUnlock() {
    localStorage.setItem("intimacy_unlocked", "true");
    setPwUnlocked(true);
  }

  // ── Navigate ─────────────────────────────────────────────
  function goToSection(id: string) {
    setActiveSectionId(id);
    localStorage.setItem("intimacy_active_section", id);
    setOpenQuestionId(null);
  }

  function goNextSection() {
    const nextIdx = sectionIdx + 1;
    if (nextIdx < SECTIONS.length) goToSection(SECTIONS[nextIdx].id);
  }

  function toggleQuestion(qid: string) {
    setOpenQuestionId((prev) => (prev === qid ? null : qid));
  }

  if (!hydrated) return null;
  if (!pwUnlocked) return <PasswordGate onUnlock={handleUnlock} />;
  if (!person) {
    return (
      <div style={{ background: PALETTE.bg, minHeight: "100vh" }}>
        <PersonSelector onSelect={selectPerson} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: PALETTE.bg, color: PALETTE.text }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
        style={{
          background: "var(--t-nav-bg)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${PALETTE.edge}`,
        }}
      >
        <Link
          href="/"
          style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: PALETTE.textFaint, textDecoration: "none" }}
        >
          ← Back
        </Link>
        <p style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: PALETTE.textDim }}>
          Intimacy
        </p>
        <p style={{ fontSize: "10px", color: PALETTE.textFaint }}>
          {person === "mary" ? "Mary" : "MD"}
        </p>
      </div>

      <div className="px-5 pt-8 pb-16 max-w-lg mx-auto">
        {/* Title */}
        <h1 className="font-display italic mb-1" style={{ fontSize: "34px", color: PALETTE.text, lineHeight: 1.1 }}>
          Just the Two of Us
        </h1>
        <p className="mb-8 leading-relaxed" style={{ fontSize: "13px", color: PALETTE.textFaint }}>
          Answer honestly, for yourself. The conversation happens after.
        </p>

        {/* Section tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => goToSection(s.id)}
              style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "6px 12px",
                borderRadius: "4px",
                border: `1px solid ${activeSectionId === s.id ? s.color : PALETTE.edge}`,
                background: activeSectionId === s.id ? `${s.color}20` : "var(--t-surface)",
                color: activeSectionId === s.id ? s.color : PALETTE.textFaint,
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
        <p className="font-display italic mb-5" style={{ fontSize: "22px", color: section.color }}>
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

            {isSubmitted ? (
              <div
                className="mt-6 rounded-xl p-4 text-center"
                style={{ background: "var(--t-surface)", border: `1px solid ${PALETTE.edge}` }}
              >
                {waitingForSummary ? (
                  <>
                    <p style={{ fontSize: "11px", color: PALETTE.textFaint, marginBottom: 4 }}>Reading your answers…</p>
                    <p style={{ fontSize: "10px", color: PALETTE.textDim }}>Just a moment</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "11px", color: PALETTE.textFaint, marginBottom: 4 }}>
                      Your answers are in. Waiting for {PARTNER[person]}…
                    </p>
                    <p style={{ fontSize: "10px", color: PALETTE.textDim }}>
                      The discussion opens when they finish this section.
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
                <p style={{ fontSize: "10px", color: PALETTE.textDim, textAlign: "center" }}>
                  {section.questions.filter((q) => myAnswers[q.id]?.trim()).length} / {section.questions.length} answered
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
