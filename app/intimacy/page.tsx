"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PasswordGate from "@/components/sections/PasswordGate";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import QuestionCard from "@/components/sections/QuestionCard";
import ExplorationGrid from "@/components/sections/ExplorationGrid";
import TogetherReveal from "@/components/sections/TogetherReveal";
import { INTIMACY_QUESTIONS, INTIMACY_CATEGORIES, TOTAL_INTIMACY, type GridResponse } from "@/lib/intimacy-questions";

// ── Intimate palette ──────────────────────────────────────────
const I = {
  bg: "#0C0810",
  surface: "#120F1A",
  edge: "#2E1F40",
  edgeHi: "#4A2D5A",
  text: "#EDE0E8",
  textMuted: "#9B7FA8",
  textFaint: "#6B4A7A",
  textDim: "#3D2850",
  rose: "#C47EA0",
  gold: "#C49A45",
  progressBar: "#C47EA0",
};

interface AnswerMap {
  [qId: string]: { answer_text?: string; selected_option?: string };
}

interface StatusData {
  mary: { answered_ids: string[]; count: number; total: number };
  md: { answered_ids: string[]; count: number; total: number };
  both_complete: boolean;
  is_unlocked: boolean;
}

export default function IntimacyPage() {
  const [pwUnlocked, setPwUnlocked] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [status, setStatus] = useState<StatusData | null>(null);
  const [togetherAnswers, setTogetherAnswers] = useState<{ mary: AnswerMap; md: AnswerMap } | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pw = localStorage.getItem("intimacy_unlocked");
    const p = localStorage.getItem("intimacy_person") as Person | null;
    if (pw === "true") setPwUnlocked(true);
    if (p) setPerson(p);
    setHydrated(true);
  }, []);

  function selectPerson(p: Person) {
    localStorage.setItem("intimacy_person", p);
    setPerson(p);
  }

  const loadAnswers = useCallback(async (p: Person) => {
    const res = await fetch(`/api/intimacy/answers?person=${p}`);
    if (!res.ok) return;
    const { answers: rows } = await res.json();
    const map: AnswerMap = {};
    for (const row of rows ?? []) {
      map[row.question_id] = { answer_text: row.answer_text, selected_option: row.selected_option };
    }
    setAnswers(map);
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
    if (data.is_unlocked && !togetherAnswers) loadTogetherAnswers();
  }, [togetherAnswers, loadTogetherAnswers]);

  useEffect(() => {
    if (!person || !pwUnlocked) return;
    loadAnswers(person);
    loadStatus();
    pollRef.current = setInterval(loadStatus, 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, pwUnlocked, loadAnswers, loadStatus]);

  async function saveAnswer(qId: string, data: { answer_text?: string; selected_option?: string }) {
    if (!person) return;
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], ...data } }));
    await fetch("/api/intimacy/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ person, question_id: qId, ...data }),
    });
    loadStatus();
  }

  function handleGridChange(questionId: string, item: string, value: GridResponse) {
    const existing = answers[questionId]?.answer_text;
    let grid: Record<string, GridResponse> = {};
    try { grid = JSON.parse(existing || "{}"); } catch {}
    grid[item] = value;
    saveAnswer(questionId, { answer_text: JSON.stringify(grid) });
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
    return (
      <div style={{ background: I.bg, minHeight: "100vh" }}>
        <PersonSelector onSelect={selectPerson} />
      </div>
    );
  }

  const myAnsweredCount = Object.keys(answers).filter((id) => {
    const a = answers[id];
    return (a.answer_text && a.answer_text.trim()) || a.selected_option;
  }).length;

  const myProgress = Math.round((myAnsweredCount / TOTAL_INTIMACY) * 100);
  const partnerName = person === "mary" ? "MD" : "Mary";
  const myName = person === "mary" ? "Mary" : "MD";
  const partnerCount = status ? (person === "mary" ? status.md.count : status.mary.count) : null;

  // ── Together view ────────────────────────────────────────────
  if (status?.is_unlocked && togetherAnswers) {
    return (
      <div className="min-h-screen" style={{ background: I.bg }}>
        <div style={{ borderBottom: `1px solid ${I.edge}` }}>
          <div className="max-w-3xl mx-auto px-6 py-6">
            <Link
              href="/"
              style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}
            >
              ← Back
            </Link>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>
              ✦ Together
            </p>
            <h1 className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 52px)", color: I.text }}>
              Intimacy
            </h1>
            <p style={{ fontSize: "12px", color: I.textMuted, marginTop: 6 }}>
              Both of your answers, together.
            </p>
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
            questions={INTIMACY_QUESTIONS as Parameters<typeof TogetherReveal>[0]["questions"]}
            maryAnswers={togetherAnswers.mary}
            mdAnswers={togetherAnswers.md}
            palette="intimate"
          />

          {/* Link to guided experience */}
          <div
            className="mt-12 rounded-xl p-6 text-center"
            style={{ background: "rgba(196,126,160,0.06)", border: `1px solid ${I.edgeHi}` }}
          >
            <p className="font-display italic mb-2" style={{ fontSize: "18px", color: I.text }}>
              Ready to go deeper?
            </p>
            <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 16 }}>
              The guided experience is waiting.
            </p>
            <Link
              href="/intimacy/together-experience"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                background: "rgba(196,126,160,0.15)",
                border: `1px solid ${I.rose}`,
                color: I.text,
                fontSize: "13px",
                fontFamily: "var(--font-barlow), sans-serif",
                fontWeight: 600,
                fontStyle: "italic",
                textDecoration: "none",
                borderRadius: 12,
                letterSpacing: "0.02em",
              }}
            >
              Begin the Experience ✦
            </Link>
          </div>
        </main>

        <footer className="text-center py-8 border-t" style={{ borderColor: I.edge }}>
          <p className="font-display" style={{ fontSize: "18px", color: I.textDim }}>pecanandpoplar.com</p>
        </footer>
      </div>
    );
  }

  // ── Questionnaire view ────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: I.bg }}>
      {showUnlockAnim && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center fade-up"
          style={{ background: "rgba(12,8,16,0.97)" }}
        >
          <p className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 56px)", color: I.rose }}>
            Together ✦
          </p>
          <p style={{ fontSize: "13px", color: I.textMuted, marginTop: 12 }}>Reading together now…</p>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${I.edge}` }}>
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link
            href="/"
            style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}
          >
            ← Back
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>
                ✦ {myName}
              </p>
              <h1 className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 48px)", color: I.text }}>
                Intimacy
              </h1>
            </div>
            <div className="text-right flex-shrink-0">
              <p style={{ fontSize: "22px", color: I.rose, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600 }}>
                {myAnsweredCount}/{TOTAL_INTIMACY}
              </p>
              <p style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.1em" }}>answered</p>
            </div>
          </div>
          <div className="mt-4 rounded-full overflow-hidden" style={{ height: 2, background: I.edge }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${myProgress}%`, background: I.rose }} />
          </div>
          {status && (
            <p className="mt-3" style={{ fontSize: "11px", color: I.textDim }}>
              {partnerName}:{" "}
              <span style={{ color: partnerCount === TOTAL_INTIMACY ? I.rose : I.textDim }}>
                {partnerCount === TOTAL_INTIMACY ? "Done ✓" : `${partnerCount ?? 0}/${TOTAL_INTIMACY}`}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Questions */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        {INTIMACY_CATEGORIES.map((cat) => {
          const qs = INTIMACY_QUESTIONS.filter((q) => q.category === cat);
          const catAnswered = qs.filter((q) => {
            const a = answers[q.id];
            return a && ((a.answer_text && a.answer_text.trim()) || a.selected_option);
          }).length;

          return (
            <div key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-display italic" style={{ fontSize: "19px", color: I.text }}>
                  {cat}
                </span>
                <div className="flex-1 h-px" style={{ background: I.edge }} />
                <span style={{ fontSize: "10px", color: catAnswered === qs.length ? I.rose : I.textDim }}>
                  {catAnswered === qs.length ? "✓ done" : `${catAnswered}/${qs.length}`}
                </span>
              </div>

              {qs.map((q) => {
                const globalIndex = INTIMACY_QUESTIONS.indexOf(q) + 1;
                const a = answers[q.id] ?? {};

                // Special: exploration grid
                if (q.kind === "grid" && q.gridItems) {
                  let gridValues: Record<string, GridResponse> = {};
                  try { gridValues = JSON.parse(a.answer_text || "{}"); } catch {}

                  return (
                    <div
                      key={q.id}
                      className="rounded-xl p-5 mb-4"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${Object.keys(gridValues).length > 0 ? I.edgeHi : I.edge}`,
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-display" style={{ fontSize: "28px", color: I.textDim, lineHeight: 1 }}>
                          {String(globalIndex).padStart(2, "0")}
                        </span>
                        <span style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: I.textFaint }}>
                          {q.category}
                        </span>
                      </div>
                      <p
                        className="leading-snug mb-4"
                        style={{ fontSize: "15px", color: I.text, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600 }}
                      >
                        {q.text}
                      </p>
                      <ExplorationGrid
                        items={q.gridItems}
                        values={gridValues}
                        onChange={(item, value) => handleGridChange(q.id, item, value)}
                        palette="intimate"
                      />
                    </div>
                  );
                }

                return (
                  <QuestionCard
                    key={q.id}
                    question={q as Parameters<typeof QuestionCard>[0]["question"]}
                    answerText={a.answer_text ?? ""}
                    selectedOption={a.selected_option ?? ""}
                    onSave={saveAnswer}
                    palette="intimate"
                    number={globalIndex}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Completion / unlock zone */}
        <div className="mt-8 mb-16">
          {myAnsweredCount < TOTAL_INTIMACY ? (
            <p style={{ fontSize: "12px", color: I.textDim, textAlign: "center" }}>
              {TOTAL_INTIMACY - myAnsweredCount} question{TOTAL_INTIMACY - myAnsweredCount !== 1 ? "s" : ""} left
            </p>
          ) : !status?.both_complete ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "rgba(196,126,160,0.05)", border: `1px solid ${I.edgeHi}` }}
            >
              <p style={{ fontSize: "22px", color: I.rose, fontFamily: "var(--font-barlow), sans-serif", fontStyle: "italic", fontWeight: 600, marginBottom: 6 }}>
                You're done ✓
              </p>
              <p style={{ fontSize: "12px", color: I.textMuted }}>
                Waiting for {partnerName} ({partnerCount ?? 0}/{TOTAL_INTIMACY}).
              </p>
              <button
                onClick={loadStatus}
                className="mt-4 rounded transition-opacity"
                style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.textDim, background: "none", border: `1px solid ${I.edge}`, padding: "6px 14px", cursor: "pointer" }}
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-display italic mb-2" style={{ fontSize: "20px", color: I.text }}>
                You both finished.
              </p>
              <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 20 }}>
                Ready to read together?
              </p>
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="rounded-xl transition-all duration-200 active:scale-[0.98]"
                style={{
                  padding: "14px 32px",
                  background: "rgba(196,126,160,0.12)",
                  border: `1px solid ${I.rose}`,
                  color: I.text,
                  fontSize: "14px",
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 600,
                  fontStyle: "italic",
                  cursor: unlocking ? "wait" : "pointer",
                  opacity: unlocking ? 0.6 : 1,
                  letterSpacing: "0.02em",
                }}
              >
                {unlocking ? "Opening…" : "We're ready to read together ✦"}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 border-t" style={{ borderColor: I.edge }}>
        <p className="font-display" style={{ fontSize: "18px", color: I.textDim }}>pecanandpoplar.com</p>
      </footer>
    </div>
  );
}
