"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import QuestionView, { type AnswerData } from "@/components/sections/QuestionView";
import TogetherReveal from "@/components/sections/TogetherReveal";
import { CONNECTION_QUESTIONS, CONNECTION_CATEGORIES } from "@/lib/connection-questions";

const SECTIONS = CONNECTION_CATEGORIES.map((cat) => ({
  name: cat,
  questions: CONNECTION_QUESTIONS.filter((q) => q.category === cat),
}));

type Phase = "answering" | "waiting" | "reveal" | "complete";
type AnswerMap = Record<string, AnswerData>;

const C = {
  bg: "#0B1309",
  edge: "#1E3319",
  text: "#E2D9C6",
  textMuted: "#6E8A74",
  textFaint: "#3A5040",
  textDim: "#2D4D28",
  gold: "#C49A45",
  green: "#6DB87E",
};

export default function ConnectionPage() {
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [partnerAnswers, setPartnerAnswers] = useState<AnswerMap>({});
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Hydrate ───────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("connection_person") as Person | null;
    const si = parseInt(localStorage.getItem("connection_section") ?? "0", 10);
    const qi = parseInt(localStorage.getItem("connection_question") ?? "0", 10);
    const ph = (localStorage.getItem("connection_phase") ?? "answering") as Phase;
    setPerson(stored);
    const safeSection = isNaN(si) ? 0 : Math.min(si, SECTIONS.length - 1);
    const safeQuestion = isNaN(qi) ? 0 : Math.min(qi, SECTIONS[safeSection].questions.length - 1);
    setSectionIdx(safeSection);
    setQuestionIdx(safeQuestion);
    setPhase(ph);
    setHydrated(true);
  }, []);

  function selectPerson(p: Person) {
    localStorage.setItem("connection_person", p);
    setPerson(p);
  }

  function persist(si: number, qi: number, ph: Phase) {
    setSectionIdx(si);
    setQuestionIdx(qi);
    setPhase(ph);
    localStorage.setItem("connection_section", String(si));
    localStorage.setItem("connection_question", String(qi));
    localStorage.setItem("connection_phase", ph);
  }

  // ── Data loading ──────────────────────────────────────────
  const loadMyAnswers = useCallback(async (p: Person) => {
    const res = await fetch(`/api/connection/answers?person=${p}`);
    if (!res.ok) return;
    const { answers: rows } = await res.json();
    const map: AnswerMap = {};
    for (const r of rows ?? []) map[r.question_id] = { answer_text: r.answer_text, selected_option: r.selected_option };
    setAnswers(map);
  }, []);

  const loadPartnerAnswers = useCallback(async (p: Person) => {
    const partner = p === "mary" ? "md" : "mary";
    const res = await fetch(`/api/connection/answers?person=${partner}`);
    if (!res.ok) return;
    const { answers: rows } = await res.json();
    const map: AnswerMap = {};
    for (const r of rows ?? []) map[r.question_id] = { answer_text: r.answer_text, selected_option: r.selected_option };
    setPartnerAnswers(map);
  }, []);

  useEffect(() => {
    if (!person) return;
    loadMyAnswers(person);
    loadPartnerAnswers(person);
    pollRef.current = setInterval(() => loadPartnerAnswers(person), 20_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, loadMyAnswers, loadPartnerAnswers]);

  // ── Save ──────────────────────────────────────────────────
  async function saveAnswer(qId: string, data: AnswerData) {
    if (!person) return;
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], ...data } }));
    await fetch("/api/connection/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ person, question_id: qId, ...data }),
    });
  }

  // ── Derived ───────────────────────────────────────────────
  const section = SECTIONS[sectionIdx] ?? SECTIONS[0];

  const partnerSectionDone = section.questions.every((q) => {
    const a = partnerAnswers[q.id];
    return (a?.answer_text?.trim()) || a?.selected_option;
  });

  // Auto-advance waiting → reveal when partner finishes
  useEffect(() => {
    if (phase === "waiting" && partnerSectionDone) {
      persist(sectionIdx, questionIdx, "reveal");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerSectionDone, phase]);

  // ── Navigation ────────────────────────────────────────────
  function handleSectionDone() {
    if (partnerSectionDone) {
      persist(sectionIdx, questionIdx, "reveal");
    } else {
      persist(sectionIdx, questionIdx, "waiting");
    }
  }

  function handleNext() {
    if (questionIdx < section.questions.length - 1) {
      persist(sectionIdx, questionIdx + 1, "answering");
    } else {
      handleSectionDone();
    }
  }

  function handleBack() {
    if (phase === "waiting" || phase === "reveal") {
      persist(sectionIdx, section.questions.length - 1, "answering");
    } else if (questionIdx > 0) {
      persist(sectionIdx, questionIdx - 1, "answering");
    } else if (sectionIdx > 0) {
      persist(sectionIdx - 1, SECTIONS[sectionIdx - 1].questions.length - 1, "reveal");
    }
  }

  function handleNextSection() {
    if (sectionIdx >= SECTIONS.length - 1) {
      persist(sectionIdx, questionIdx, "complete");
    } else {
      persist(sectionIdx + 1, 0, "answering");
    }
  }

  if (!hydrated) return null;
  if (!person) return <PersonSelector onSelect={selectPerson} />;

  const myName = person === "mary" ? "Mary" : "MD";
  const partnerName = person === "mary" ? "MD" : "Mary";
  const isLastSection = sectionIdx === SECTIONS.length - 1;

  // ── Build reveal maps for current section ─────────────────
  function buildRevealMaps() {
    const maryMap: AnswerMap = {};
    const mdMap: AnswerMap = {};
    for (const q of section.questions) {
      if (person === "mary") {
        if (answers[q.id]) maryMap[q.id] = answers[q.id];
        if (partnerAnswers[q.id]) mdMap[q.id] = partnerAnswers[q.id];
      } else {
        if (partnerAnswers[q.id]) maryMap[q.id] = partnerAnswers[q.id];
        if (answers[q.id]) mdMap[q.id] = answers[q.id];
      }
    }
    return { maryMap, mdMap };
  }

  // ── Complete ──────────────────────────────────────────────
  if (phase === "complete") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 fade-up" style={{ background: C.bg }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint, marginBottom: 8 }}>✦ Connection</p>
        <p className="font-display italic mb-3 text-center" style={{ fontSize: "clamp(28px, 7vw, 44px)", color: C.text }}>
          All seven sections ✦
        </p>
        <p style={{ fontSize: "13px", color: C.textMuted, marginBottom: 32, textAlign: "center", maxWidth: 280 }}>
          You made it through all of Connection together.
        </p>
        <Link href="/" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.textFaint, textDecoration: "none" }}>
          ← Back to itinerary
        </Link>
      </div>
    );
  }

  // ── Reveal ────────────────────────────────────────────────
  if (phase === "reveal") {
    const { maryMap, mdMap } = buildRevealMaps();
    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        <div style={{ borderBottom: `1px solid ${C.edge}` }}>
          <div className="max-w-2xl mx-auto px-6 py-5">
            <button onClick={handleBack} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.textDim, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}>
              ← Back
            </button>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint, marginBottom: 4 }}>
              ✦ Section {sectionIdx + 1} of {SECTIONS.length}
            </p>
            <h1 className="font-display italic" style={{ fontSize: "clamp(26px, 6vw, 40px)", color: C.text }}>
              {section.name}
            </h1>
            <p style={{ fontSize: "12px", color: C.textMuted, marginTop: 6 }}>Both answers, side by side.</p>
            <div className="flex gap-4 mt-4">
              {(["mary", "md"] as const).map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: p === "mary" ? "#9B8FC4" : C.green }} />
                  <span style={{ fontSize: "11px", color: C.textMuted }}>{p === "mary" ? "Mary" : "MD"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-6 py-8 fade-up">
          <TogetherReveal
            questions={section.questions}
            maryAnswers={maryMap}
            mdAnswers={mdMap}
            palette="forest"
          />
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleNextSection}
              className="rounded-xl transition-all duration-150 active:scale-[0.98]"
              style={{ padding: "12px 24px", background: "rgba(196,154,69,0.10)", border: `1px solid ${C.gold}`, color: C.text, fontSize: "13px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", cursor: "pointer" }}
            >
              {isLastSection ? "Complete ✦" : `Next: ${SECTIONS[sectionIdx + 1].name} →`}
            </button>
          </div>
        </main>

        <footer className="text-center py-8 border-t" style={{ borderColor: C.edge }}>
          <p className="font-display" style={{ fontSize: "18px", color: C.textDim }}>pecanandpoplar.com</p>
        </footer>
      </div>
    );
  }

  // ── Waiting ───────────────────────────────────────────────
  if (phase === "waiting") {
    const partnerCount = section.questions.filter((q) => {
      const a = partnerAnswers[q.id];
      return (a?.answer_text?.trim()) || a?.selected_option;
    }).length;
    return (
      <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
        <div style={{ borderBottom: `1px solid ${C.edge}` }}>
          <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={handleBack} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.textDim, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              ← Back
            </button>
            <p style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.textFaint }}>
              {section.name} · {sectionIdx + 1} of {SECTIONS.length}
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 fade-up">
          <p className="font-display italic mb-3" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: C.text, textAlign: "center" }}>
            You&apos;re done ✓
          </p>
          <p style={{ fontSize: "13px", color: C.textMuted, marginBottom: 8, textAlign: "center" }}>
            Waiting for {partnerName} to finish this section.
          </p>
          <p style={{ fontSize: "11px", color: C.textDim, marginBottom: 28, textAlign: "center" }}>
            {partnerCount} of {section.questions.length} answered
          </p>
          <button
            onClick={() => loadPartnerAnswers(person)}
            style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textDim, background: "none", border: `1px solid ${C.edge}`, padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Refresh
          </button>
        </div>
        <footer className="text-center py-6 border-t" style={{ borderColor: C.edge }}>
          <Link href="/" style={{ fontSize: "10px", color: C.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>
            ← Itinerary
          </Link>
        </footer>
      </div>
    );
  }

  // ── Answering ─────────────────────────────────────────────
  const q = section.questions[questionIdx];
  const myAns = answers[q.id] ?? {};
  const partnerAns = partnerAnswers[q.id];
  const isLastQuestion = questionIdx === section.questions.length - 1;
  const isVeryFirst = sectionIdx === 0 && questionIdx === 0;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" style={{ fontSize: "9px", color: C.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>
          ← Home
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span style={{ fontSize: "9px", color: C.textDim, letterSpacing: "0.1em" }}>{myName}</span>
      </div>
      <div key={`${sectionIdx}-${questionIdx}`} className="fade-up" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <QuestionView
          question={q}
          questionNumber={questionIdx + 1}
          totalQuestions={section.questions.length}
          sectionLabel={`${section.name}  ·  ${sectionIdx + 1} of ${SECTIONS.length}`}
          myAnswer={myAns}
          partnerAnswer={partnerAns}
          partnerName={partnerName}
          onSave={saveAnswer}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={isVeryFirst}
          isLast={isLastQuestion}
          finishLabel="I'm done with this section →"
          palette="forest"
        />
      </div>
    </div>
  );
}
