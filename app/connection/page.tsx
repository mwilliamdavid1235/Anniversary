"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import QuestionCard from "@/components/sections/QuestionCard";
import TogetherReveal from "@/components/sections/TogetherReveal";
import { CONNECTION_QUESTIONS, CONNECTION_CATEGORIES, TOTAL_CONNECTION } from "@/lib/connection-questions";

interface AnswerMap {
  [qId: string]: { answer_text?: string; selected_option?: string };
}

interface StatusData {
  mary: { answered_ids: string[]; count: number; total: number };
  md: { answered_ids: string[]; count: number; total: number };
  both_complete: boolean;
  is_unlocked: boolean;
}

export default function ConnectionPage() {
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [status, setStatus] = useState<StatusData | null>(null);
  const [togetherAnswers, setTogetherAnswers] = useState<{ mary: AnswerMap; md: AnswerMap } | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate person from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("connection_person") as Person | null;
    setPerson(stored);
    setHydrated(true);
  }, []);

  function selectPerson(p: Person) {
    localStorage.setItem("connection_person", p);
    setPerson(p);
  }

  // Load this person's answers
  const loadAnswers = useCallback(async (p: Person) => {
    const res = await fetch(`/api/connection/answers?person=${p}`);
    if (!res.ok) return;
    const { answers: rows } = await res.json();
    const map: AnswerMap = {};
    for (const row of rows ?? []) {
      map[row.question_id] = {
        answer_text: row.answer_text,
        selected_option: row.selected_option,
      };
    }
    setAnswers(map);
  }, []);

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/connection/status");
    if (!res.ok) return;
    const data: StatusData = await res.json();
    setStatus(data);
    if (data.is_unlocked && !togetherAnswers) {
      loadTogetherAnswers();
    }
  }, [togetherAnswers]); // eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => {
    if (!person) return;
    loadAnswers(person);
    loadStatus();
    // Poll for partner completion every 30s
    pollRef.current = setInterval(loadStatus, 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, loadAnswers, loadStatus]);

  async function saveAnswer(qId: string, data: { answer_text?: string; selected_option?: string }) {
    if (!person) return;
    setAnswers((prev) => ({ ...prev, [qId]: { ...prev[qId], ...data } }));
    await fetch("/api/connection/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ person, question_id: qId, ...data }),
    });
    // Refresh status after saving
    loadStatus();
  }

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

  const myAnsweredCount = Object.keys(answers).filter((id) => {
    const a = answers[id];
    return (a.answer_text && a.answer_text.trim()) || a.selected_option;
  }).length;

  const myProgress = Math.round((myAnsweredCount / TOTAL_CONNECTION) * 100);
  const partnerName = person === "mary" ? "MD" : "Mary";
  const myName = person === "mary" ? "Mary" : "MD";
  const partnerCount = status ? (person === "mary" ? status.md.count : status.mary.count) : null;

  // ── Together view ────────────────────────────────────────────
  if (status?.is_unlocked && togetherAnswers) {
    return (
      <div className="min-h-screen" style={{ background: "#0B1309" }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid #1E3319" }}>
          <div className="max-w-3xl mx-auto px-6 py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6"
              style={{ fontSize: "10px", color: "#3A5040", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}
            >
              ← Back
            </Link>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A5040", marginBottom: 4 }}>
              ✦ Together
            </p>
            <h1 className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 52px)", color: "#E2D9C6" }}>
              Connection
            </h1>
            <p style={{ fontSize: "12px", color: "#6E8A74", marginTop: 6 }}>
              Both of your answers, side by side.
            </p>

            {/* Person key */}
            <div className="flex gap-4 mt-4">
              {(["mary", "md"] as const).map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: p === "mary" ? "#9B8FC4" : "#6DB87E",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#6E8A74" }}>{p === "mary" ? "Mary" : "MD"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-6 py-10 fade-up">
          <TogetherReveal
            questions={CONNECTION_QUESTIONS}
            maryAnswers={togetherAnswers.mary}
            mdAnswers={togetherAnswers.md}
            palette="forest"
          />
        </main>

        <footer className="text-center py-8 border-t" style={{ borderColor: "#1E3319" }}>
          <p className="font-display" style={{ fontSize: "18px", color: "#3A5040" }}>pecanandpoplar.com</p>
        </footer>
      </div>
    );
  }

  // ── Questionnaire view ────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#0B1309" }}>
      {/* Unlock reveal overlay */}
      {showUnlockAnim && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center fade-up"
          style={{ background: "rgba(11,19,9,0.97)" }}
        >
          <p className="gold-shimmer font-display italic" style={{ fontSize: "clamp(32px, 8vw, 56px)" }}>
            Together ✦
          </p>
          <p style={{ fontSize: "13px", color: "#6E8A74", marginTop: 12 }}>Reading together now…</p>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1E3319" }}>
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link
            href="/"
            style={{ fontSize: "10px", color: "#3A5040", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}
          >
            ← Back
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A5040", marginBottom: 4 }}>
                ✦ {myName}
              </p>
              <h1 className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 48px)", color: "#E2D9C6" }}>
                Connection
              </h1>
            </div>
            {/* Progress */}
            <div className="text-right flex-shrink-0">
              <p style={{ fontSize: "22px", color: "#C49A45", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600 }}>
                {myAnsweredCount}/{TOTAL_CONNECTION}
              </p>
              <p style={{ fontSize: "9px", color: "#3A5040", letterSpacing: "0.1em" }}>answered</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 rounded-full overflow-hidden" style={{ height: 2, background: "#1E3319" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${myProgress}%`, background: "#C49A45" }}
            />
          </div>

          {/* Partner status */}
          {status && (
            <p className="mt-3" style={{ fontSize: "11px", color: "#3A5040" }}>
              {partnerName}:{" "}
              <span style={{ color: partnerCount === TOTAL_CONNECTION ? "#6DB87E" : "#3A5040" }}>
                {partnerCount === TOTAL_CONNECTION ? "Done ✓" : `${partnerCount ?? 0}/${TOTAL_CONNECTION}`}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Questions */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        {CONNECTION_CATEGORIES.map((cat) => {
          const qs = CONNECTION_QUESTIONS.filter((q) => q.category === cat);
          const catAnswered = qs.filter((q) => {
            const a = answers[q.id];
            return a && ((a.answer_text && a.answer_text.trim()) || a.selected_option);
          }).length;

          return (
            <div key={cat} className="mb-10">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="font-display italic"
                  style={{ fontSize: "19px", color: "#E2D9C6" }}
                >
                  {cat}
                </span>
                <div className="flex-1 h-px" style={{ background: "#1E3319" }} />
                <span style={{ fontSize: "10px", color: catAnswered === qs.length ? "#6DB87E" : "#3A5040" }}>
                  {catAnswered === qs.length ? "✓ done" : `${catAnswered}/${qs.length}`}
                </span>
              </div>

              {qs.map((q, qi) => {
                const globalIndex = CONNECTION_QUESTIONS.indexOf(q) + 1;
                const a = answers[q.id] ?? {};
                return (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    answerText={a.answer_text ?? ""}
                    selectedOption={a.selected_option ?? ""}
                    onSave={saveAnswer}
                    palette="forest"
                    number={globalIndex}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Completion / unlock zone */}
        <div className="mt-8 mb-16">
          {myAnsweredCount < TOTAL_CONNECTION ? (
            <p style={{ fontSize: "12px", color: "#3A5040", textAlign: "center" }}>
              {TOTAL_CONNECTION - myAnsweredCount} question{TOTAL_CONNECTION - myAnsweredCount !== 1 ? "s" : ""} left
            </p>
          ) : !status?.both_complete ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "rgba(61,107,71,0.08)", border: "1px solid #2D4D28" }}
            >
              <p style={{ fontSize: "22px", color: "#6DB87E", fontFamily: "var(--font-barlow), sans-serif", fontStyle: "italic", fontWeight: 600, marginBottom: 6 }}>
                You're done ✓
              </p>
              <p style={{ fontSize: "12px", color: "#6E8A74" }}>
                Waiting for {partnerName} to finish ({partnerCount ?? 0}/{TOTAL_CONNECTION}).
              </p>
              <button
                onClick={loadStatus}
                className="mt-4 rounded transition-opacity"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#3A5040",
                  background: "none",
                  border: "1px solid #1E3319",
                  padding: "6px 14px",
                  cursor: "pointer",
                }}
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p
                className="font-display italic mb-2"
                style={{ fontSize: "20px", color: "#E2D9C6" }}
              >
                You both finished.
              </p>
              <p style={{ fontSize: "12px", color: "#6E8A74", marginBottom: 20 }}>
                Ready to read together?
              </p>
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="rounded-xl transition-all duration-200 active:scale-[0.98]"
                style={{
                  padding: "14px 32px",
                  background: "rgba(196,154,69,0.12)",
                  border: "1px solid #C49A45",
                  color: "#E2D9C6",
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

      <footer className="text-center py-8 border-t" style={{ borderColor: "#1E3319" }}>
        <p className="font-display" style={{ fontSize: "18px", color: "#3A5040" }}>pecanandpoplar.com</p>
      </footer>
    </div>
  );
}
