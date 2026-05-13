"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PasswordGate from "@/components/sections/PasswordGate";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import QuestionView, { type AnswerData } from "@/components/sections/QuestionView";
import TogetherReveal from "@/components/sections/TogetherReveal";
import { INTIMACY_QUESTIONS, INTIMACY_CATEGORIES } from "@/lib/intimacy-questions";

const SECTIONS = INTIMACY_CATEGORIES.map((cat) => ({
  name: cat,
  questions: INTIMACY_QUESTIONS.filter((q) => q.category === cat),
}));

type Phase = "answering" | "waiting" | "reveal" | "complete";
type AnswerMap = Record<string, AnswerData>;

const I = {
  bg: "#0C0810",
  edge: "#2E1F40",
  edgeHi: "#4A2D5A",
  text: "#EDE0E8",
  textMuted: "#9B7FA8",
  textFaint: "#6B4A7A",
  textDim: "#3D2850",
  rose: "#C47EA0",
};

export default function IntimacyPage() {
  const [pwUnlocked, setPwUnlocked] = useState(false);
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
    const pw = localStorage.getItem("intimacy_unlocked");
    const p = localStorage.getItem("intimacy_person") as Person | null;
    const si = parseInt(localStorage.getItem("intimacy_section") ?? "0", 10);
    const qi = parseInt(localStorage.getItem("intimacy_question") ?? "0", 10);
    const ph = (localStorage.getItem("intimacy_phase") ?? "answering") as Phase;
    if (pw === "true") setPwUnlocked(true);
    if (p) setPerson(p);
    const safeSection = isNaN(si) ? 0 : Math.min(si, SECTIONS.length - 1);
    const safeQuestion = isNaN(qi) ? 0 : Math.min(qi, SECTIONS[safeSection].questions.length - 1);
    setSectionIdx(safeSection);
    setQuestionIdx(safeQuestion);
    setPhase(ph);
    setHydrated(true);
  }, []);

  function selectPerson(p: Person) {
    localStorage.setItem("intimacy_person", p);
    setPerson(p);
  }

  function persist(si: number, qi: number, ph: Phase) {
    setSectionIdx(si);
    setQuestionIdx(qi);
    setPhase(ph);
    localStorage.setItem("intimacy_section", String(si));
    localStorage.setItem("intimacy_question", String(qi));
    localStorage.setItem("intimacy_phase", ph);
  }

  // ── Data loading ──────────────────────────────────────────
  const loadMyAnswers = useCallback(async (p: Person) => {
    const res = await fetch(`/api/intimacy/answers?person=${p}`);
    if (!res.ok) return;
    const { answers: rows } = await res.json();
    const map: AnswerMap = {};
    for (const r of rows ?? []) map[r.question_id] = { answer_text: r.answer_text, selected_option: r.selected_option };
    setAnswers(map);
  }, []);

  const loadPartnerAnswers = useCallback(async (p: Person) => {
    const partner = p === "mary" ? "md" : "mary";
    const res = await fetch(`/api/intimacy/answers?person=${partner}`);
    if (!res.ok) return;
    const { answers: rows } = await res.json();
    const map: AnswerMap = {};
    for (const r of rows ?? []) map[r.question_id] = { answer_text: r.answer_text, selected_option: r.selected_option };
    setPartnerAnswers(map);
  }, []);

  useEffect(() => {
    if (!person || !pwUnlocked) return;
    loadMyAnswers(person);
    loadPartnerAnswers(person);
    pollRef.current = setInterval(() => loadPartnerAnswers(person), 20_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, pwUnlocked, loadMyAnswers, loadPartnerAnswers]);

  // ── Save ──────────────────────────────────────────────────
  async function saveAnswer(qId: string, data: AnswerData) {
    if (!person) return;
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], ...data } }));
    await fetch("/api/intimacy/answers", {
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
  if (!pwUnlocked) return <PasswordGate onUnlock={() => setPwUnlocked(true)} />;
  if (!person) {
    return <div style={{ background: I.bg, minHeight: "100vh" }}><PersonSelector onSelect={selectPerson} /></div>;
  }

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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 fade-up" style={{ background: I.bg }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 8 }}>✦ Intimacy</p>
        <p className="font-display italic mb-3 text-center" style={{ fontSize: "clamp(28px, 7vw, 44px)", color: I.text }}>
          All six sections ✦
        </p>
        <p style={{ fontSize: "13px", color: I.textMuted, marginBottom: 32, textAlign: "center", maxWidth: 280 }}>
          You made it through all of Intimacy together.
        </p>
        <Link
          href="/exploration"
          style={{ display: "inline-block", padding: "12px 28px", background: "rgba(196,126,160,0.15)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "13px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", textDecoration: "none", borderRadius: 12, marginBottom: 24 }}
        >
          Go to Exploration Menu ✦
        </Link>
        <Link href="/" style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>
          ← Itinerary
        </Link>
      </div>
    );
  }

  // ── Reveal ────────────────────────────────────────────────
  if (phase === "reveal") {
    const { maryMap, mdMap } = buildRevealMaps();
    return (
      <div className="min-h-screen" style={{ background: I.bg }}>
        <div style={{ borderBottom: `1px solid ${I.edge}` }}>
          <div className="max-w-2xl mx-auto px-6 py-5">
            <button onClick={handleBack} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textDim, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}>
              ← Back
            </button>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>
              ✦ Section {sectionIdx + 1} of {SECTIONS.length}
            </p>
            <h1 className="font-display italic" style={{ fontSize: "clamp(26px, 6vw, 40px)", color: I.text }}>
              {section.name}
            </h1>
            <p style={{ fontSize: "12px", color: I.textMuted, marginTop: 6 }}>Both answers, side by side.</p>
            <div className="flex gap-4 mt-4">
              {(["mary", "md"] as const).map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: p === "mary" ? "#9B8FC4" : I.rose }} />
                  <span style={{ fontSize: "11px", color: I.textMuted }}>{p === "mary" ? "Mary" : "MD"}</span>
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
            palette="intimate"
          />
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleNextSection}
              className="rounded-xl transition-all duration-150 active:scale-[0.98]"
              style={{ padding: "12px 24px", background: "rgba(196,126,160,0.12)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "13px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", cursor: "pointer" }}
            >
              {isLastSection ? "Complete ✦" : `Next: ${SECTIONS[sectionIdx + 1].name} →`}
            </button>
          </div>
        </main>

        <footer className="text-center py-8 border-t" style={{ borderColor: I.edge }}>
          <p className="font-display" style={{ fontSize: "18px", color: I.textDim }}>pecanandpoplar.com</p>
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
      <div className="min-h-screen flex flex-col" style={{ background: I.bg }}>
        <div style={{ borderBottom: `1px solid ${I.edge}` }}>
          <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={handleBack} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textDim, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              ← Back
            </button>
            <p style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textFaint }}>
              {section.name} · {sectionIdx + 1} of {SECTIONS.length}
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 fade-up">
          <p className="font-display italic mb-3" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: I.text, textAlign: "center" }}>
            You&apos;re done ✓
          </p>
          <p style={{ fontSize: "13px", color: I.textMuted, marginBottom: 8, textAlign: "center" }}>
            Waiting for {partnerName} to finish this section.
          </p>
          <p style={{ fontSize: "11px", color: I.textDim, marginBottom: 28, textAlign: "center" }}>
            {partnerCount} of {section.questions.length} answered
          </p>
          <button
            onClick={() => loadPartnerAnswers(person)}
            style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.textDim, background: "none", border: `1px solid ${I.edge}`, padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}
          >
            Refresh
          </button>
        </div>
        <footer className="text-center py-6 border-t" style={{ borderColor: I.edge }}>
          <Link href="/" style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>
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
    <div style={{ background: I.bg, minHeight: "100vh" }}>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>← Home</Link>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.1em" }}>{myName}</span>
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
          palette="intimate"
        />
      </div>
    </div>
  );
}
