"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PasswordGate from "@/components/sections/PasswordGate";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import QuestionView, { type AnswerData } from "@/components/sections/QuestionView";
import TogetherReveal from "@/components/sections/TogetherReveal";
import { INTIMACY_QUESTIONS, TOTAL_INTIMACY } from "@/lib/intimacy-questions";

// ── Intimate palette ──────────────────────────────────────────
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

type AnswerMap = Record<string, AnswerData>;

interface StatusData {
  mary: { answered_ids: string[]; count: number; total: number };
  md: { answered_ids: string[]; count: number; total: number };
  both_complete: boolean;
  is_unlocked: boolean;
}

function AnimatedQuestion({ children, qKey }: { children: React.ReactNode; qKey: string }) {
  return (
    <div key={qKey} className="fade-up" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  );
}

export default function IntimacyPage() {
  const [pwUnlocked, setPwUnlocked] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [partnerAnswers, setPartnerAnswers] = useState<AnswerMap>({});
  const [status, setStatus] = useState<StatusData | null>(null);
  const [togetherAnswers, setTogetherAnswers] = useState<{ mary: AnswerMap; md: AnswerMap } | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pw = localStorage.getItem("intimacy_unlocked");
    const p = localStorage.getItem("intimacy_person") as Person | null;
    const pos = parseInt(localStorage.getItem("intimacy_position") ?? "0", 10);
    if (pw === "true") setPwUnlocked(true);
    if (p) setPerson(p);
    if (!isNaN(pos) && pos >= 0 && pos < TOTAL_INTIMACY) setCurrentIndex(pos);
    setHydrated(true);
  }, []);

  function selectPerson(p: Person) {
    localStorage.setItem("intimacy_person", p);
    setPerson(p);
  }

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(TOTAL_INTIMACY - 1, index));
    setCurrentIndex(clamped);
    localStorage.setItem("intimacy_position", String(clamped));
  }

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

  const loadTogetherAnswers = useCallback(async () => {
    const [mRes, dRes] = await Promise.all([
      fetch("/api/intimacy/answers?person=mary"),
      fetch("/api/intimacy/answers?person=md"),
    ]);
    const [{ answers: mRows }, { answers: dRows }] = await Promise.all([mRes.json(), dRes.json()]);
    function toMap(rows: { question_id: string; answer_text?: string; selected_option?: string }[]): AnswerMap {
      const m: AnswerMap = {};
      for (const r of rows ?? []) m[r.question_id] = { answer_text: r.answer_text, selected_option: r.selected_option };
      return m;
    }
    setTogetherAnswers({ mary: toMap(mRows), md: toMap(dRows) });
  }, []);

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/intimacy/status");
    if (!res.ok) return;
    const data: StatusData = await res.json();
    setStatus(data);
    if (data.is_unlocked) loadTogetherAnswers();
  }, [loadTogetherAnswers]);

  useEffect(() => {
    if (!person || !pwUnlocked) return;
    loadMyAnswers(person);
    loadPartnerAnswers(person);
    loadStatus();
    pollRef.current = setInterval(() => {
      loadPartnerAnswers(person);
      loadStatus();
    }, 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, pwUnlocked, loadMyAnswers, loadPartnerAnswers, loadStatus]);

  async function saveAnswer(qId: string, data: AnswerData) {
    if (!person) return;
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], ...data } }));
    await fetch("/api/intimacy/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ person, question_id: qId, ...data }),
    });
    loadStatus();
  }

  function handleNext() {
    if (currentIndex < TOTAL_INTIMACY - 1) {
      goTo(currentIndex + 1);
    } else {
      setShowComplete(true);
    }
  }

  function handleBack() {
    if (showComplete) {
      setShowComplete(false);
    } else {
      goTo(currentIndex - 1);
    }
  }

  async function handleUnlock() {
    if (!person) return;
    setUnlocking(true);
    const res = await fetch("/api/intimacy/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ person }),
    });
    setUnlocking(false);
    if (res.ok) {
      setShowUnlockAnim(true);
      await loadTogetherAnswers();
      await loadStatus();
      setTimeout(() => setShowUnlockAnim(false), 2500);
    }
  }

  if (!hydrated) return null;
  if (!pwUnlocked) return <PasswordGate onUnlock={() => setPwUnlocked(true)} />;
  if (!person) {
    return <div style={{ background: I.bg, minHeight: "100vh" }}><PersonSelector onSelect={selectPerson} /></div>;
  }

  const myName = person === "mary" ? "Mary" : "MD";
  const partnerName = person === "mary" ? "MD" : "Mary";
  const partnerCount = status ? (person === "mary" ? status.md.count : status.mary.count) : null;
  const myAnsweredCount = Object.values(answers).filter(
    (a) => (a.answer_text && a.answer_text.trim()) || a.selected_option
  ).length;

  // ── Together view ─────────────────────────────────────────
  if (status?.is_unlocked && togetherAnswers) {
    return (
      <div className="min-h-screen" style={{ background: I.bg }}>
        {showUnlockAnim && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center fade-up" style={{ background: "rgba(12,8,16,0.97)" }}>
            <p className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 56px)", color: I.rose }}>Together ✦</p>
            <p style={{ fontSize: "13px", color: I.textMuted, marginTop: 12 }}>Reading together now…</p>
          </div>
        )}
        <div style={{ borderBottom: `1px solid ${I.edge}` }}>
          <div className="max-w-3xl mx-auto px-6 py-6">
            <Link href="/" style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>← Back</Link>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>✦ Together</p>
            <h1 className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 52px)", color: I.text }}>Intimacy</h1>
            <p style={{ fontSize: "12px", color: I.textMuted, marginTop: 6 }}>Both of your answers, together.</p>
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
        <main className="max-w-3xl mx-auto px-6 py-10 fade-up">
          <TogetherReveal
            questions={INTIMACY_QUESTIONS}
            maryAnswers={togetherAnswers.mary}
            mdAnswers={togetherAnswers.md}
            palette="intimate"
          />
          <div className="mt-12 rounded-xl p-6 text-center" style={{ background: "rgba(196,126,160,0.06)", border: `1px solid ${I.edgeHi}` }}>
            <p className="font-display italic mb-2" style={{ fontSize: "18px", color: I.text }}>Ready to go deeper?</p>
            <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 16 }}>The Exploration Menu is next.</p>
            <Link href="/exploration" style={{ display: "inline-block", padding: "12px 28px", background: "rgba(196,126,160,0.15)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "13px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", textDecoration: "none", borderRadius: 12 }}>
              Go to Exploration Menu ✦
            </Link>
          </div>
        </main>
        <footer className="text-center py-8 border-t" style={{ borderColor: I.edge }}>
          <p className="font-display" style={{ fontSize: "18px", color: I.textDim }}>pecanandpoplar.com</p>
        </footer>
      </div>
    );
  }

  // ── Completion screen ─────────────────────────────────────
  if (showComplete) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: I.bg }}>
        {showUnlockAnim && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center fade-up" style={{ background: "rgba(12,8,16,0.97)" }}>
            <p className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 56px)", color: I.rose }}>Together ✦</p>
            <p style={{ fontSize: "13px", color: I.textMuted, marginTop: 12 }}>Reading together now…</p>
          </div>
        )}
        <div style={{ borderBottom: `1px solid ${I.edge}` }}>
          <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={handleBack} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textDim, background: "none", border: "none", cursor: "pointer", padding: 0 }}>← Back</button>
            <div className="flex-1">
              <div className="rounded-full overflow-hidden" style={{ height: 2, background: I.edge }}>
                <div className="h-full rounded-full" style={{ width: `${(myAnsweredCount / TOTAL_INTIMACY) * 100}%`, background: I.rose }} />
              </div>
              <span style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.1em", marginTop: 4, display: "block" }}>{myAnsweredCount} of {TOTAL_INTIMACY} answered</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 fade-up">
          {myAnsweredCount < TOTAL_INTIMACY ? (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: I.text, textAlign: "center" }}>
                {TOTAL_INTIMACY - myAnsweredCount} left
              </p>
              <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 24, textAlign: "center" }}>Go back and fill them in whenever you're ready.</p>
              <button onClick={() => { setShowComplete(false); goTo(0); }} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textDim, background: "none", border: `1px solid ${I.edge}`, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>
                Review from the start
              </button>
            </>
          ) : !status?.both_complete ? (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: I.text, textAlign: "center" }}>You&apos;re done ✓</p>
              <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 6, textAlign: "center" }}>Waiting for {partnerName} to finish.</p>
              <p style={{ fontSize: "11px", color: I.textDim, marginBottom: 24, textAlign: "center" }}>{partnerCount ?? 0}/{TOTAL_INTIMACY}</p>
              <button onClick={() => { loadPartnerAnswers(person); loadStatus(); }} style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.textDim, background: "none", border: `1px solid ${I.edge}`, padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}>
                Refresh
              </button>
            </>
          ) : (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: I.text, textAlign: "center" }}>You both finished.</p>
              <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 24, textAlign: "center" }}>Ready to read together?</p>
              <button onClick={handleUnlock} disabled={unlocking} className="rounded-xl transition-all duration-200 active:scale-[0.98]" style={{ padding: "14px 32px", background: "rgba(196,126,160,0.12)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "14px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", cursor: unlocking ? "wait" : "pointer", opacity: unlocking ? 0.6 : 1 }}>
                {unlocking ? "Opening…" : "We're ready to read together ✦"}
              </button>
            </>
          )}
        </div>

        <footer className="text-center py-6 border-t" style={{ borderColor: I.edge }}>
          <Link href="/" style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>← Itinerary</Link>
        </footer>
      </div>
    );
  }

  // ── Single-question view ──────────────────────────────────
  const q = INTIMACY_QUESTIONS[currentIndex];
  const myAns = answers[q.id] ?? {};
  const partnerAns = partnerAnswers[q.id];

  return (
    <div style={{ background: I.bg, minHeight: "100vh" }}>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>← Home</Link>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.1em" }}>{myName}</span>
      </div>
      <AnimatedQuestion qKey={`${q.id}-${currentIndex}`}>
        <QuestionView
          question={q}
          questionNumber={currentIndex + 1}
          totalQuestions={TOTAL_INTIMACY}
          myAnswer={myAns}
          partnerAnswer={partnerAns}
          partnerName={partnerName}
          onSave={saveAnswer}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentIndex === 0}
          isLast={currentIndex === TOTAL_INTIMACY - 1}
          palette="intimate"
        />
      </AnimatedQuestion>
    </div>
  );
}
