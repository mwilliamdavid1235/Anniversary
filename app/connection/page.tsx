"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import QuestionView, { type AnswerData } from "@/components/sections/QuestionView";
import TogetherReveal from "@/components/sections/TogetherReveal";
import { CONNECTION_QUESTIONS, TOTAL_CONNECTION } from "@/lib/connection-questions";

type AnswerMap = Record<string, AnswerData>;

interface StatusData {
  mary: { answered_ids: string[]; count: number; total: number };
  md: { answered_ids: string[]; count: number; total: number };
  both_complete: boolean;
  is_unlocked: boolean;
}

// ── Animated question wrapper ─────────────────────────────────
function AnimatedQuestion({ children, qKey }: { children: React.ReactNode; qKey: string }) {
  return (
    <div
      key={qKey}
      className="fade-up"
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      {children}
    </div>
  );
}

export default function ConnectionPage() {
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

  // ── Hydrate from localStorage ─────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("connection_person") as Person | null;
    const pos = parseInt(localStorage.getItem("connection_position") ?? "0", 10);
    setPerson(stored);
    if (!isNaN(pos) && pos >= 0 && pos < TOTAL_CONNECTION) setCurrentIndex(pos);
    setHydrated(true);
  }, []);

  function selectPerson(p: Person) {
    localStorage.setItem("connection_person", p);
    setPerson(p);
  }

  // ── Persist position ──────────────────────────────────────
  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(TOTAL_CONNECTION - 1, index));
    setCurrentIndex(clamped);
    localStorage.setItem("connection_position", String(clamped));
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

  const loadTogetherAnswers = useCallback(async () => {
    const [mRes, dRes] = await Promise.all([
      fetch("/api/connection/answers?person=mary"),
      fetch("/api/connection/answers?person=md"),
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
    const res = await fetch("/api/connection/status");
    if (!res.ok) return;
    const data: StatusData = await res.json();
    setStatus(data);
    if (data.is_unlocked) loadTogetherAnswers();
  }, [loadTogetherAnswers]);

  useEffect(() => {
    if (!person) return;
    loadMyAnswers(person);
    loadPartnerAnswers(person);
    loadStatus();
    // Poll partner answers + status every 30s
    pollRef.current = setInterval(() => {
      loadPartnerAnswers(person);
      loadStatus();
    }, 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, loadMyAnswers, loadPartnerAnswers, loadStatus]);

  // ── Save answer ───────────────────────────────────────────
  async function saveAnswer(qId: string, data: AnswerData) {
    if (!person) return;
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], ...data } }));
    await fetch("/api/connection/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ person, question_id: qId, ...data }),
    });
    loadStatus();
  }

  // ── Navigation ────────────────────────────────────────────
  function handleNext() {
    if (currentIndex < TOTAL_CONNECTION - 1) {
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

  // ── Unlock together ───────────────────────────────────────
  async function handleUnlock() {
    if (!person) return;
    setUnlocking(true);
    const res = await fetch("/api/connection/unlock", {
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
  if (!person) return <PersonSelector onSelect={selectPerson} />;

  const myName = person === "mary" ? "Mary" : "MD";
  const partnerName = person === "mary" ? "MD" : "Mary";
  const partnerCount = status ? (person === "mary" ? status.md.count : status.mary.count) : null;

  const myAnsweredCount = Object.values(answers).filter(
    (a) => (a.answer_text && a.answer_text.trim()) || a.selected_option
  ).length;

  // ── Together view ─────────────────────────────────────────
  if (status?.is_unlocked && togetherAnswers) {
    return (
      <div className="min-h-screen" style={{ background: "#0B1309" }}>
        {showUnlockAnim && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center fade-up" style={{ background: "rgba(11,19,9,0.97)" }}>
            <p className="gold-shimmer font-display italic" style={{ fontSize: "clamp(32px, 8vw, 56px)" }}>Together ✦</p>
            <p style={{ fontSize: "13px", color: "#6E8A74", marginTop: 12 }}>Reading together now…</p>
          </div>
        )}
        <div style={{ borderBottom: "1px solid #1E3319" }}>
          <div className="max-w-3xl mx-auto px-6 py-6">
            <Link href="/" style={{ fontSize: "10px", color: "#3A5040", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              ← Back
            </Link>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A5040", marginBottom: 4 }}>✦ Together</p>
            <h1 className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 52px)", color: "#E2D9C6" }}>Connection</h1>
            <p style={{ fontSize: "12px", color: "#6E8A74", marginTop: 6 }}>Both of your answers, side by side.</p>
            <div className="flex gap-4 mt-4">
              {(["mary", "md"] as const).map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: p === "mary" ? "#9B8FC4" : "#6DB87E" }} />
                  <span style={{ fontSize: "11px", color: "#6E8A74" }}>{p === "mary" ? "Mary" : "MD"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <main className="max-w-3xl mx-auto px-6 py-10 fade-up">
          <TogetherReveal questions={CONNECTION_QUESTIONS} maryAnswers={togetherAnswers.mary} mdAnswers={togetherAnswers.md} palette="forest" />
        </main>
        <footer className="text-center py-8 border-t" style={{ borderColor: "#1E3319" }}>
          <p className="font-display" style={{ fontSize: "18px", color: "#3A5040" }}>pecanandpoplar.com</p>
        </footer>
      </div>
    );
  }

  // ── Completion screen ─────────────────────────────────────
  if (showComplete) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#0B1309" }}>
        {showUnlockAnim && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center fade-up" style={{ background: "rgba(11,19,9,0.97)" }}>
            <p className="gold-shimmer font-display italic" style={{ fontSize: "clamp(32px, 8vw, 56px)" }}>Together ✦</p>
            <p style={{ fontSize: "13px", color: "#6E8A74", marginTop: 12 }}>Reading together now…</p>
          </div>
        )}
        <div style={{ borderBottom: "1px solid #1E3319" }}>
          <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={handleBack} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3A5040", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              ← Back
            </button>
            <div className="flex-1">
              <div className="rounded-full overflow-hidden" style={{ height: 2, background: "#1E3319" }}>
                <div className="h-full rounded-full" style={{ width: `${(myAnsweredCount / TOTAL_CONNECTION) * 100}%`, background: "#C49A45" }} />
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ fontSize: "9px", color: "#3A5040", letterSpacing: "0.1em" }}>{myAnsweredCount} of {TOTAL_CONNECTION} answered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 fade-up">
          {myAnsweredCount < TOTAL_CONNECTION ? (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: "#E2D9C6", textAlign: "center" }}>
                {TOTAL_CONNECTION - myAnsweredCount} left
              </p>
              <p style={{ fontSize: "12px", color: "#6E8A74", marginBottom: 24, textAlign: "center" }}>
                You can go back and fill them in, or skip them for now.
              </p>
              <button onClick={() => { setShowComplete(false); goTo(0); }} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3A5040", background: "none", border: "1px solid #1E3319", padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>
                Review from the start
              </button>
            </>
          ) : !status?.both_complete ? (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: "#E2D9C6", textAlign: "center" }}>
                You&apos;re done ✓
              </p>
              <p style={{ fontSize: "12px", color: "#6E8A74", marginBottom: 6, textAlign: "center" }}>
                Waiting for {partnerName} to finish.
              </p>
              <p style={{ fontSize: "11px", color: "#3A5040", marginBottom: 24, textAlign: "center" }}>
                {partnerCount ?? 0}/{TOTAL_CONNECTION} answered
              </p>
              <button onClick={() => { loadPartnerAnswers(person); loadStatus(); }} style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3A5040", background: "none", border: "1px solid #1E3319", padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}>
                Refresh
              </button>
            </>
          ) : (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: "#E2D9C6", textAlign: "center" }}>
                You both finished.
              </p>
              <p style={{ fontSize: "12px", color: "#6E8A74", marginBottom: 24, textAlign: "center" }}>
                Ready to read together?
              </p>
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="rounded-xl transition-all duration-200 active:scale-[0.98]"
                style={{ padding: "14px 32px", background: "rgba(196,154,69,0.12)", border: "1px solid #C49A45", color: "#E2D9C6", fontSize: "14px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", cursor: unlocking ? "wait" : "pointer", opacity: unlocking ? 0.6 : 1 }}
              >
                {unlocking ? "Opening…" : "We're ready to read together ✦"}
              </button>
            </>
          )}
        </div>

        <footer className="text-center py-6 border-t" style={{ borderColor: "#1E3319" }}>
          <Link href="/" style={{ fontSize: "10px", color: "#2D4D28", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>
            ← Itinerary
          </Link>
        </footer>
      </div>
    );
  }

  // ── Single-question view ──────────────────────────────────
  const q = CONNECTION_QUESTIONS[currentIndex];
  const myAns = answers[q.id] ?? {};
  const partnerAns = partnerAnswers[q.id];

  return (
    <div style={{ background: "#0B1309", minHeight: "100vh" }}>
      {/* Subtle header link */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" style={{ fontSize: "9px", color: "#2D4D28", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>
          ← Home
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span style={{ fontSize: "9px", color: "#2D4D28", letterSpacing: "0.1em" }}>{myName}</span>
      </div>

      <AnimatedQuestion qKey={`${q.id}-${currentIndex}`}>
        <QuestionView
          question={q}
          questionNumber={currentIndex + 1}
          totalQuestions={TOTAL_CONNECTION}
          myAnswer={myAns}
          partnerAnswer={partnerAns}
          partnerName={partnerName}
          onSave={saveAnswer}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentIndex === 0}
          isLast={currentIndex === TOTAL_CONNECTION - 1}
          palette="forest"
        />
      </AnimatedQuestion>
    </div>
  );
}
