"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ACT1_QUESTIONS,
  ACT2_QUESTIONS,
  ACT3_QUESTIONS,
  ACT4_QUESTIONS,
  FINAL_PROMPT,
  ACT_LABELS,
  ACT_DESCRIPTIONS,
  type GuidedQuestion,
} from "@/lib/guided-questions";
import type { Person } from "@/components/sections/PersonSelector";

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

interface AnswerRecord {
  person: string;
  act: number;
  question_id: string;
  answer_text: string;
}

function ActHeader({ act, description }: { act: 1 | 2 | 3 | 4; description: string }) {
  return (
    <div className="mb-8">
      <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>
        Act {act}
      </p>
      <h2 className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: I.text }}>
        {ACT_LABELS[act]}
      </h2>
      <p style={{ fontSize: "12px", color: I.textMuted }}>{description}</p>
    </div>
  );
}

function ActTextarea({
  q,
  value,
  onChange,
  saved,
}: {
  q: GuidedQuestion;
  value: string;
  onChange: (v: string) => void;
  saved: boolean;
}) {
  return (
    <div className="mb-6">
      <p
        className="mb-3 leading-snug"
        style={{ fontSize: "17px", color: I.text, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600 }}
      >
        {q.completeSentence ? (
          <>
            <span style={{ color: I.textMuted }}>{q.completeSentence}</span>
            <span style={{ color: I.textFaint }}>___</span>
          </>
        ) : q.text}
      </p>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          rows={3}
          className="w-full rounded-lg outline-none resize-none leading-relaxed"
          style={{
            background: "rgba(13,11,16,0.6)",
            border: `1px solid ${I.edge}`,
            color: I.text,
            fontSize: "13px",
            padding: "10px 12px",
            fontFamily: "var(--font-dm-mono), monospace",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = I.edgeHi; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = I.edge; }}
        />
        {saved && (
          <span className="absolute bottom-2 right-2" style={{ fontSize: "9px", color: I.rose, letterSpacing: "0.1em" }}>
            ✓ saved
          </span>
        )}
      </div>
    </div>
  );
}

function SideBySide({
  question,
  maryText,
  mdText,
}: {
  question: string;
  maryText?: string;
  mdText?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-3" style={{ fontSize: "15px", color: I.text, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600 }}>
        {question}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(["mary", "md"] as const).map((p) => {
          const val = p === "mary" ? maryText : mdText;
          return (
            <div key={p} className="rounded-lg p-3" style={{ background: "rgba(13,11,16,0.5)", border: `1px solid ${I.edgeHi}` }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 6 }}>
                {p === "mary" ? "Mary" : "MD"}
              </p>
              <p style={{ fontSize: "13px", color: I.text, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {val || <span style={{ color: I.textDim, fontStyle: "italic" }}>—</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WaitingForPartner({ name, onRefresh }: { name: string; onRefresh: () => void }) {
  return (
    <div className="mt-6 rounded-lg p-4 text-center" style={{ background: "rgba(13,11,16,0.4)", border: `1px solid ${I.edge}` }}>
      <p style={{ fontSize: "12px", color: I.textMuted }}>Waiting for {name}…</p>
      <button onClick={onRefresh} className="mt-3 rounded" style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textDim, background: "none", border: `1px solid ${I.edge}`, padding: "5px 12px", cursor: "pointer" }}>
        Refresh
      </button>
    </div>
  );
}

export default function TogetherExperiencePage() {
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [currentAct, setCurrentAct] = useState<1 | 2 | 3 | 4>(1);
  const [myAnswers, setMyAnswers] = useState<Record<string, string>>({});
  const [savedFlags, setSavedFlags] = useState<Record<string, boolean>>({});
  const [actAnswers, setActAnswers] = useState<Record<number, AnswerRecord[]>>({});
  const [finalInput, setFinalInput] = useState("");
  const [finalSaved, setFinalSaved] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState<{ mary?: string; md?: string }>({});
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const p = localStorage.getItem("intimacy_person") as Person | null;
    setPerson(p);
    setHydrated(true);
  }, []);

  const loadActAnswers = useCallback(async (act: number) => {
    const res = await fetch(`/api/guided/answers?act=${act}`);
    if (!res.ok) return;
    const { answers } = await res.json();
    setActAnswers((prev) => ({ ...prev, [act]: answers ?? [] }));
  }, []);

  // Load all acts on mount
  useEffect(() => {
    if (!person) return;
    (async () => {
      for (const act of [1, 2, 3, 4, 5]) {
        const res = await fetch(`/api/guided/answers?act=${act}`);
        if (!res.ok) continue;
        const { answers } = await res.json();
        if (act <= 4) {
          setActAnswers((prev) => ({ ...prev, [act]: answers ?? [] }));
          const mine = (answers ?? []).filter((r: AnswerRecord) => r.person === person);
          setMyAnswers((prev) => {
            const updated = { ...prev };
            for (const r of mine) updated[r.question_id] = r.answer_text || "";
            return updated;
          });
        } else {
          // act 5 = final prompt
          const m = (answers ?? []).find((r: AnswerRecord) => r.person === "mary");
          const d = (answers ?? []).find((r: AnswerRecord) => r.person === "md");
          if (m || d) setFinalAnswers({ mary: m?.answer_text, md: d?.answer_text });
          const mine = (answers ?? []).find((r: AnswerRecord) => r.person === person);
          if (mine) setFinalInput(mine.answer_text || "");
        }
      }
    })();
  }, [person]);

  function handleAnswerChange(q: GuidedQuestion, value: string) {
    setMyAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (saveTimers.current[q.id]) clearTimeout(saveTimers.current[q.id]);
    saveTimers.current[q.id] = setTimeout(async () => {
      if (!person) return;
      await fetch("/api/guided/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, act: q.act, question_id: q.id, answer_text: value }),
      });
      setSavedFlags((prev) => ({ ...prev, [q.id]: true }));
      setTimeout(() => setSavedFlags((prev) => ({ ...prev, [q.id]: false })), 2000);
      loadActAnswers(q.act);
    }, 800);
  }

  function handleFinalChange(value: string) {
    setFinalInput(value);
    if (saveTimers.current["final"]) clearTimeout(saveTimers.current["final"]);
    saveTimers.current["final"] = setTimeout(async () => {
      if (!person) return;
      await fetch("/api/guided/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, act: 5, question_id: "final", answer_text: value }),
      });
      setFinalSaved(true);
      setTimeout(() => setFinalSaved(false), 2000);
      const res = await fetch("/api/guided/answers?act=5");
      if (res.ok) {
        const { answers } = await res.json();
        const m = (answers ?? []).find((r: AnswerRecord) => r.person === "mary");
        const d = (answers ?? []).find((r: AnswerRecord) => r.person === "md");
        setFinalAnswers({ mary: m?.answer_text, md: d?.answer_text });
      }
    }, 800);
  }

  function getByPerson(act: number): { mary: Record<string, string>; md: Record<string, string> } {
    const rows = actAnswers[act] ?? [];
    const mary: Record<string, string> = {};
    const md: Record<string, string> = {};
    for (const r of rows) {
      if (r.person === "mary") mary[r.question_id] = r.answer_text;
      else if (r.person === "md") md[r.question_id] = r.answer_text;
    }
    return { mary, md };
  }

  function bothComplete(act: number, qs: GuidedQuestion[]) {
    const { mary, md } = getByPerson(act);
    return qs.every((q) => mary[q.id]?.trim()) && qs.every((q) => md[q.id]?.trim());
  }

  function myComplete(qs: GuidedQuestion[]) {
    return qs.every((q) => myAnswers[q.id]?.trim());
  }

  if (!hydrated || !person) return null;

  const partnerName = person === "mary" ? "MD" : "Mary";

  return (
    <div className="min-h-screen" style={{ background: I.bg }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${I.edge}` }}>
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link
            href="/intimacy"
            style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}
          >
            ← Intimacy
          </Link>
          <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>
            ✦ Guided Experience
          </p>
          <h1 className="font-display italic" style={{ fontSize: "clamp(28px, 7vw, 44px)", color: I.text }}>
            The Experience
          </h1>

          {/* Act tabs */}
          <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
            {([1, 2, 3, 4] as const).map((act) => {
              const qs = act === 1 ? ACT1_QUESTIONS : act === 2 ? ACT2_QUESTIONS : act === 3 ? ACT3_QUESTIONS : ACT4_QUESTIONS;
              const done = bothComplete(act, qs);
              return (
                <button
                  key={act}
                  onClick={() => setCurrentAct(act)}
                  className="flex-shrink-0 rounded-lg px-3 py-1.5 transition-all"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: currentAct === act ? "rgba(196,126,160,0.15)" : "transparent",
                    border: `1px solid ${currentAct === act ? I.rose : I.edge}`,
                    color: currentAct === act ? I.text : I.textFaint,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Act {act}{done ? " ✓" : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* ── Act I: Settle In ──────────────────────────────── */}
        {currentAct === 1 && (
          <div className="fade-up">
            <div className="rounded-xl p-5 mb-8 text-center" style={{ background: "rgba(196,126,160,0.04)", border: `1px solid ${I.edge}` }}>
              <p style={{ fontSize: "18px", color: I.textMuted, fontFamily: "var(--font-barlow), sans-serif", fontStyle: "italic", fontWeight: 600 }}>
                Pour something. Put the phone down.
              </p>
            </div>

            <ActHeader act={1} description={ACT_DESCRIPTIONS[1]} />

            {ACT1_QUESTIONS.map((q) => (
              <ActTextarea
                key={q.id}
                q={q}
                value={myAnswers[q.id] ?? ""}
                onChange={(v) => handleAnswerChange(q, v)}
                saved={savedFlags[q.id] ?? false}
              />
            ))}

            {/* Act I shows both answers in real time */}
            {(() => {
              const { mary, md } = getByPerson(1);
              const hasSomething = ACT1_QUESTIONS.some((q) => mary[q.id] || md[q.id]);
              if (!hasSomething) return null;
              return (
                <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${I.edge}` }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.rose, marginBottom: 16 }}>
                    — Both answers —
                  </p>
                  {ACT1_QUESTIONS.map((q) => (
                    <SideBySide key={q.id} question={q.text} maryText={mary[q.id]} mdText={md[q.id]} />
                  ))}
                </div>
              );
            })()}

            <div className="mt-8 flex justify-end">
              <button onClick={() => { setCurrentAct(2); loadActAnswers(2); }} className="rounded-lg px-5 py-2.5 transition-opacity active:scale-[0.99]" style={{ background: "rgba(196,126,160,0.12)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "12px", cursor: "pointer" }}>
                Act II →
              </button>
            </div>
          </div>
        )}

        {/* ── Act II: What I Know About You ─────────────────── */}
        {currentAct === 2 && (
          <div className="fade-up">
            <ActHeader act={2} description={ACT_DESCRIPTIONS[2]} />

            {ACT2_QUESTIONS.map((q) => (
              <ActTextarea
                key={q.id}
                q={q}
                value={myAnswers[q.id] ?? ""}
                onChange={(v) => handleAnswerChange(q, v)}
                saved={savedFlags[q.id] ?? false}
              />
            ))}

            {myComplete(ACT2_QUESTIONS) && !bothComplete(2, ACT2_QUESTIONS) && (
              <WaitingForPartner name={partnerName} onRefresh={() => loadActAnswers(2)} />
            )}

            {bothComplete(2, ACT2_QUESTIONS) && (() => {
              const { mary, md } = getByPerson(2);
              return (
                <div className="mt-8 pt-8 fade-up" style={{ borderTop: `1px solid ${I.edge}` }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.rose, marginBottom: 16 }}>
                    — Guesses revealed —
                  </p>
                  {ACT2_QUESTIONS.map((q) => (
                    <SideBySide key={q.id} question={q.text} maryText={mary[q.id]} mdText={md[q.id]} />
                  ))}
                </div>
              );
            })()}

            <div className="mt-8 flex justify-end">
              <button onClick={() => { setCurrentAct(3); loadActAnswers(3); }} className="rounded-lg px-5 py-2.5 transition-opacity active:scale-[0.99]" style={{ background: "rgba(196,126,160,0.12)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "12px", cursor: "pointer" }}>
                Act III →
              </button>
            </div>
          </div>
        )}

        {/* ── Act III: Tell Me What You Want ────────────────── */}
        {currentAct === 3 && (
          <div className="fade-up">
            <ActHeader act={3} description={ACT_DESCRIPTIONS[3]} />

            {ACT3_QUESTIONS.map((q) => (
              <ActTextarea
                key={q.id}
                q={q}
                value={myAnswers[q.id] ?? ""}
                onChange={(v) => handleAnswerChange(q, v)}
                saved={savedFlags[q.id] ?? false}
              />
            ))}

            {myComplete(ACT3_QUESTIONS) && !bothComplete(3, ACT3_QUESTIONS) && (
              <WaitingForPartner name={partnerName} onRefresh={() => loadActAnswers(3)} />
            )}

            {bothComplete(3, ACT3_QUESTIONS) && (() => {
              const { mary, md } = getByPerson(3);
              return (
                <div className="mt-8 pt-8 fade-up" style={{ borderTop: `1px solid ${I.edge}` }}>
                  <p style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.rose, marginBottom: 16 }}>
                    — Both answers —
                  </p>
                  {ACT3_QUESTIONS.map((q) => (
                    <SideBySide key={q.id} question={q.text} maryText={mary[q.id]} mdText={md[q.id]} />
                  ))}
                </div>
              );
            })()}

            <div className="mt-8 flex justify-end">
              <button onClick={() => { setCurrentAct(4); loadActAnswers(4); }} className="rounded-lg px-5 py-2.5 transition-opacity active:scale-[0.99]" style={{ background: "rgba(196,126,160,0.12)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "12px", cursor: "pointer" }}>
                Act IV →
              </button>
            </div>
          </div>
        )}

        {/* ── Act IV: The Invitation ────────────────────────── */}
        {currentAct === 4 && (
          <div className="fade-up">
            <ActHeader act={4} description={ACT_DESCRIPTIONS[4]} />

            {ACT4_QUESTIONS.map((q) => (
              <ActTextarea
                key={q.id}
                q={q}
                value={myAnswers[q.id] ?? ""}
                onChange={(v) => handleAnswerChange(q, v)}
                saved={savedFlags[q.id] ?? false}
              />
            ))}

            {myComplete(ACT4_QUESTIONS) && !bothComplete(4, ACT4_QUESTIONS) && (
              <WaitingForPartner name={partnerName} onRefresh={() => loadActAnswers(4)} />
            )}

            {bothComplete(4, ACT4_QUESTIONS) && (() => {
              const { mary, md } = getByPerson(4);
              return (
                <div className="mt-8 fade-up">
                  {/* Invitations side by side */}
                  <div className="pt-8 mb-10" style={{ borderTop: `1px solid ${I.edge}` }}>
                    <p style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.rose, marginBottom: 16 }}>
                      — Your invitations —
                    </p>
                    {ACT4_QUESTIONS.map((q) => (
                      <div key={q.id} className="mb-6">
                        <p className="mb-3" style={{ fontSize: "15px", color: I.text, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600 }}>
                          {q.text}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(["mary", "md"] as const).map((p) => (
                            <div key={p} className="rounded-lg p-3" style={{ background: "rgba(13,11,16,0.5)", border: `1px solid ${I.edgeHi}` }}>
                              <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 6 }}>
                                {p === "mary" ? "Mary" : "MD"}
                              </p>
                              <p style={{ fontSize: "14px", color: I.text, lineHeight: 1.5, fontFamily: "var(--font-barlow), sans-serif", fontStyle: "italic", whiteSpace: "pre-wrap" }}>
                                {q.completeSentence}{(p === "mary" ? mary : md)[q.id] || "…"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Final shared prompt */}
                  <div className="rounded-xl p-6" style={{ background: "rgba(196,126,160,0.05)", border: `1px solid ${I.rose}` }}>
                    <p className="font-display italic text-center mb-6" style={{ fontSize: "clamp(18px, 5vw, 26px)", color: I.text }}>
                      {FINAL_PROMPT}
                    </p>
                    <div className="relative">
                      <textarea
                        value={finalInput}
                        onChange={(e) => handleFinalChange(e.target.value)}
                        placeholder="Write freely…"
                        rows={4}
                        className="w-full rounded-lg outline-none resize-none leading-relaxed"
                        style={{ background: "rgba(13,11,16,0.6)", border: `1px solid ${I.edge}`, color: I.text, fontSize: "14px", padding: "12px 14px", fontFamily: "var(--font-dm-mono), monospace" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = I.edgeHi; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = I.edge; }}
                      />
                      {finalSaved && (
                        <span className="absolute bottom-2 right-2" style={{ fontSize: "9px", color: I.rose, letterSpacing: "0.1em" }}>✓ saved</span>
                      )}
                    </div>

                    {(finalAnswers.mary || finalAnswers.md) && (
                      <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${I.edge}` }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(["mary", "md"] as const).map((p) => (
                            <div key={p} className="rounded-lg p-3" style={{ background: "rgba(13,11,16,0.4)", border: `1px solid ${I.edgeHi}` }}>
                              <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 6 }}>
                                {p === "mary" ? "Mary" : "MD"}
                              </p>
                              <p style={{ fontSize: "14px", color: I.text, lineHeight: 1.6, fontStyle: "italic", fontFamily: "var(--font-barlow), sans-serif", whiteSpace: "pre-wrap" }}>
                                {(p === "mary" ? finalAnswers.mary : finalAnswers.md) || <span style={{ color: I.textDim }}>—</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </main>

      <footer className="text-center py-8 border-t" style={{ borderColor: I.edge }}>
        <p className="font-display" style={{ fontSize: "18px", color: I.textDim }}>pecanandpoplar.com</p>
      </footer>
    </div>
  );
}
