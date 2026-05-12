"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PasswordGate from "@/components/sections/PasswordGate";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import ExplorationGrid from "@/components/sections/ExplorationGrid";
import {
  EXPLORATION_ITEMS,
  TOTAL_EXPLORATION,
  EXPLORATION_OPTION_LABELS,
  getRevealTier,
  type GridResponse,
  type RevealTier,
} from "@/lib/exploration-items";

// ── Palette ───────────────────────────────────────────────────
const I = {
  bg: "#0C0810",
  edge: "#2E1F40",
  edgeHi: "#4A2D5A",
  text: "#EDE0E8",
  textMuted: "#9B7FA8",
  textFaint: "#6B4A7A",
  textDim: "#3D2850",
  rose: "#C47EA0",
  gold: "#C49A45",
};

interface ExplorationAnswerData {
  response: GridResponse;
  comment?: string;
}

type AnswerMap = Record<string, ExplorationAnswerData>; // keyed by item_id

interface StatusData {
  mary: { count: number; total: number };
  md: { count: number; total: number };
  both_complete: boolean;
  is_unlocked: boolean;
}

// ── Tier display config ────────────────────────────────────────
const TIER_CONFIG: Record<
  Exclude<RevealTier, "hidden">,
  { label: string; accent: string; bg: string; border: string }
> = {
  strong:       { label: "Strong Alignment",  accent: I.rose,           bg: "rgba(196,126,160,0.10)", border: "#C47EA0" },
  explore:      { label: "Worth Exploring",   accent: I.gold,           bg: "rgba(196,154,69,0.08)", border: "#7A5F25" },
  conversation: { label: "Worth a Conversation", accent: "#8A9B6E",     bg: "rgba(138,155,110,0.07)", border: "#4A5E3A" },
  mismatch:     { label: "Different Answers", accent: I.textFaint,      bg: "rgba(46,31,64,0.3)",    border: I.edge },
};

// ── Reveal helpers ────────────────────────────────────────────

function ResponsePill({ response, name }: { response: GridResponse | undefined; name: string }) {
  if (!response) {
    return (
      <div className="rounded-lg p-3" style={{ background: "rgba(13,11,16,0.5)", border: `1px solid ${I.edge}` }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>{name}</p>
        <p style={{ fontSize: "13px", color: I.textDim, fontStyle: "italic" }}>—</p>
      </div>
    );
  }
  const label = EXPLORATION_OPTION_LABELS[response];
  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(13,11,16,0.5)", border: `1px solid ${I.edgeHi}` }}>
      <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>{name}</p>
      <p style={{ fontSize: "13px", color: I.text, marginBottom: 2 }}>
        <span style={{ marginRight: 6, color: I.rose }}>◆</span>
        {label.short}
      </p>
      <p style={{ fontSize: "11px", color: I.textFaint, paddingLeft: 19 }}>{label.description}</p>
    </div>
  );
}

function ResponsePillWithComment({
  answer,
  name,
}: {
  answer: ExplorationAnswerData | undefined;
  name: string;
}) {
  if (!answer) return <ResponsePill response={undefined} name={name} />;
  const label = EXPLORATION_OPTION_LABELS[answer.response];
  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(13,11,16,0.5)", border: `1px solid ${I.edgeHi}` }}>
      <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>{name}</p>
      <p style={{ fontSize: "13px", color: I.text, marginBottom: 2 }}>
        <span style={{ marginRight: 6, color: I.rose }}>◆</span>
        {label.short}
      </p>
      <p style={{ fontSize: "11px", color: I.textFaint, paddingLeft: 19, marginBottom: answer.comment ? 8 : 0 }}>{label.description}</p>
      {answer.comment && answer.comment.trim() && (
        <p style={{ fontSize: "12px", color: I.textMuted, paddingLeft: 19, fontStyle: "italic", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
          {answer.comment}
        </p>
      )}
    </div>
  );
}

function RevealSection({
  tier,
  items,
  maryAnswers,
  mdAnswers,
}: {
  tier: Exclude<RevealTier, "hidden">;
  items: typeof EXPLORATION_ITEMS;
  maryAnswers: AnswerMap;
  mdAnswers: AnswerMap;
}) {
  const cfg = TIER_CONFIG[tier];
  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      {/* Tier header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg px-3 py-1.5" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
          <span style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: cfg.accent }}>
            ✦ {cfg.label}
          </span>
        </div>
        <span style={{ fontSize: "10px", color: I.textDim }}>{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex flex-col gap-5">
        {items.map((item) => {
          const mAns = maryAnswers[item.id];
          const dAns = mdAnswers[item.id];
          return (
            <div key={item.id} className="rounded-xl p-4" style={{ background: "rgba(13,11,16,0.3)", border: `1px solid ${I.edge}` }}>
              <p style={{ fontSize: "14px", color: I.text, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, marginBottom: 2 }}>
                {item.label}
              </p>
              <p style={{ fontSize: "11px", color: I.textFaint, marginBottom: 12, lineHeight: 1.5 }}>
                {item.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ResponsePillWithComment answer={mAns} name="Mary" />
                <ResponsePillWithComment answer={dAns} name="MD" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ExplorationPage() {
  const [pwUnlocked, setPwUnlocked] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [partnerAnswers, setPartnerAnswers] = useState<AnswerMap>({});
  const [status, setStatus] = useState<StatusData | null>(null);
  const [togetherAnswers, setTogetherAnswers] = useState<{ mary: AnswerMap; md: AnswerMap } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

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

  function rowsToMap(rows: { item_id: string; response: GridResponse; comment?: string }[]): AnswerMap {
    const m: AnswerMap = {};
    for (const r of rows ?? []) m[r.item_id] = { response: r.response, comment: r.comment };
    return m;
  }

  const loadMyAnswers = useCallback(async (p: Person) => {
    const res = await fetch(`/api/exploration/answers?person=${p}`);
    if (!res.ok) return;
    const { answers: rows } = await res.json();
    setAnswers(rowsToMap(rows));
  }, []);

  const loadPartnerAnswers = useCallback(async (p: Person) => {
    const partner = p === "mary" ? "md" : "mary";
    const res = await fetch(`/api/exploration/answers?person=${partner}`);
    if (!res.ok) return;
    const { answers: rows } = await res.json();
    setPartnerAnswers(rowsToMap(rows));
  }, []);

  const loadTogetherAnswers = useCallback(async () => {
    const [mRes, dRes] = await Promise.all([
      fetch("/api/exploration/answers?person=mary"),
      fetch("/api/exploration/answers?person=md"),
    ]);
    const [{ answers: mRows }, { answers: dRows }] = await Promise.all([mRes.json(), dRes.json()]);
    setTogetherAnswers({ mary: rowsToMap(mRows), md: rowsToMap(dRows) });
  }, []);

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/exploration/status");
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

  function saveAnswer(itemId: string, data: Partial<ExplorationAnswerData>) {
    if (!person) return;
    setAnswers((prev) => {
      const existing = prev[itemId] ?? { response: "no" as GridResponse };
      return { ...prev, [itemId]: { ...existing, ...data } };
    });
    const key = `${itemId}`;
    if (saveTimers.current[key]) clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(async () => {
      const current = { ...answers[itemId], ...data };
      await fetch("/api/exploration/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, item_id: itemId, response: current.response, comment: current.comment ?? null }),
      });
      loadStatus();
    }, 300);
  }

  function handleResponseChange(itemId: string, response: GridResponse) {
    const existing = answers[itemId];
    const updated = { response, comment: existing?.comment };
    setAnswers((prev) => ({ ...prev, [itemId]: updated }));
    if (saveTimers.current[itemId]) clearTimeout(saveTimers.current[itemId]);
    saveTimers.current[itemId] = setTimeout(async () => {
      await fetch("/api/exploration/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, item_id: itemId, response, comment: updated.comment ?? null }),
      });
      loadStatus();
    }, 300);
  }

  function handleCommentChange(itemId: string, comment: string) {
    setAnswers((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      return { ...prev, [itemId]: { ...existing, comment } };
    });
    const key = `comment_${itemId}`;
    if (saveTimers.current[key]) clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(async () => {
      const current = answers[itemId];
      if (!current) return;
      await fetch("/api/exploration/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, item_id: itemId, response: current.response, comment }),
      });
    }, 800);
  }

  async function handleUnlock() {
    if (!person) return;
    setUnlocking(true);
    const res = await fetch("/api/exploration/unlock", {
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
  const myAnsweredCount = Object.keys(answers).length;
  const partnerCount = status ? (person === "mary" ? status.md.count : status.mary.count) : null;

  // ── Together / Reveal view ────────────────────────────────
  if (status?.is_unlocked && togetherAnswers) {
    // Build tiered item lists
    const tiers: Record<Exclude<RevealTier, "hidden">, typeof EXPLORATION_ITEMS> = {
      strong: [], explore: [], conversation: [], mismatch: [],
    };
    for (const item of EXPLORATION_ITEMS) {
      const mAns = togetherAnswers.mary[item.id];
      const dAns = togetherAnswers.md[item.id];
      if (!mAns || !dAns) continue;
      const tier = getRevealTier(mAns.response, dAns.response);
      if (tier !== "hidden") tiers[tier].push(item);
    }
    const totalShown = tiers.strong.length + tiers.explore.length + tiers.conversation.length + tiers.mismatch.length;

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
            <Link href="/intimacy" style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              ← Intimacy
            </Link>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: I.textFaint, marginBottom: 4 }}>✦ Together</p>
            <h1 className="font-display italic" style={{ fontSize: "clamp(32px, 8vw, 52px)", color: I.text }}>Exploration Menu</h1>
            <p style={{ fontSize: "12px", color: I.textMuted, marginTop: 6 }}>
              {totalShown} item{totalShown !== 1 ? "s" : ""} to talk about, grouped by alignment.
            </p>
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-6 py-10 fade-up">
          <RevealSection tier="strong"       items={tiers.strong}       maryAnswers={togetherAnswers.mary} mdAnswers={togetherAnswers.md} />
          <RevealSection tier="explore"      items={tiers.explore}      maryAnswers={togetherAnswers.mary} mdAnswers={togetherAnswers.md} />
          <RevealSection tier="conversation" items={tiers.conversation} maryAnswers={togetherAnswers.mary} mdAnswers={togetherAnswers.md} />
          <RevealSection tier="mismatch"     items={tiers.mismatch}     maryAnswers={togetherAnswers.mary} mdAnswers={togetherAnswers.md} />

          <div className="mt-12 rounded-xl p-6 text-center" style={{ background: "rgba(196,126,160,0.06)", border: `1px solid ${I.edgeHi}` }}>
            <p className="font-display italic mb-2" style={{ fontSize: "18px", color: I.text }}>Ready for the guided experience?</p>
            <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 16 }}>The real-time experience is waiting.</p>
            <Link href="/intimacy/together-experience" style={{ display: "inline-block", padding: "12px 28px", background: "rgba(196,126,160,0.15)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "13px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", textDecoration: "none", borderRadius: 12 }}>
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

  // ── Completion screen ─────────────────────────────────────
  if (showComplete) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: I.bg }}>
        <div style={{ borderBottom: `1px solid ${I.edge}` }}>
          <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
            <button onClick={() => setShowComplete(false)} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textDim, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              ← Back
            </button>
            <div className="flex-1">
              <div className="rounded-full overflow-hidden" style={{ height: 2, background: I.edge }}>
                <div className="h-full rounded-full" style={{ width: `${(myAnsweredCount / TOTAL_EXPLORATION) * 100}%`, background: I.rose }} />
              </div>
              <span style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.1em", marginTop: 4, display: "block" }}>
                {myAnsweredCount} of {TOTAL_EXPLORATION} answered
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 fade-up">
          {myAnsweredCount < TOTAL_EXPLORATION ? (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: I.text, textAlign: "center" }}>
                {TOTAL_EXPLORATION - myAnsweredCount} left
              </p>
              <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 24, textAlign: "center" }}>
                Go back and respond to the remaining items.
              </p>
              <button onClick={() => setShowComplete(false)} style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textDim, background: "none", border: `1px solid ${I.edge}`, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>
                Review
              </button>
            </>
          ) : !status?.both_complete ? (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: I.text, textAlign: "center" }}>
                You&apos;re done ✓
              </p>
              <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 6, textAlign: "center" }}>
                Waiting for {partnerName} to finish.
              </p>
              <p style={{ fontSize: "11px", color: I.textDim, marginBottom: 24, textAlign: "center" }}>
                {partnerCount ?? 0}/{TOTAL_EXPLORATION} answered
              </p>
              <button onClick={() => { loadPartnerAnswers(person); loadStatus(); }} style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: I.textDim, background: "none", border: `1px solid ${I.edge}`, padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}>
                Refresh
              </button>
            </>
          ) : (
            <>
              <p className="font-display italic mb-2" style={{ fontSize: "clamp(24px, 6vw, 36px)", color: I.text, textAlign: "center" }}>
                You both finished.
              </p>
              <p style={{ fontSize: "12px", color: I.textMuted, marginBottom: 24, textAlign: "center" }}>
                Ready to see where you align?
              </p>
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="rounded-xl transition-all duration-200 active:scale-[0.98]"
                style={{ padding: "14px 32px", background: "rgba(196,126,160,0.12)", border: `1px solid ${I.rose}`, color: I.text, fontSize: "14px", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", cursor: unlocking ? "wait" : "pointer", opacity: unlocking ? 0.6 : 1 }}
              >
                {unlocking ? "Opening…" : "Reveal together ✦"}
              </button>
            </>
          )}
        </div>

        <footer className="text-center py-6 border-t" style={{ borderColor: I.edge }}>
          <Link href="/" style={{ fontSize: "10px", color: I.textDim, letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}>
            ← Itinerary
          </Link>
        </footer>
      </div>
    );
  }

  // ── Main answering view ───────────────────────────────────
  return (
    <div style={{ background: I.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${I.edge}` }}>
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/intimacy" style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: I.textDim, textDecoration: "none", flexShrink: 0 }}>
            ← Intimacy
          </Link>
          <div className="flex-1">
            <div className="rounded-full overflow-hidden" style={{ height: 2, background: I.edge }}>
              <div className="h-full rounded-full transition-all duration-400" style={{ width: `${(myAnsweredCount / TOTAL_EXPLORATION) * 100}%`, background: I.rose }} />
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.1em" }}>{myAnsweredCount} of {TOTAL_EXPLORATION}</span>
              <span style={{ fontSize: "9px", color: I.textDim, letterSpacing: "0.1em" }}>{myName}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-xl mx-auto px-6 py-8">
        <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: I.textFaint, marginBottom: 8 }}>
          ✦ Exploration Menu
        </p>
        <h1 className="font-display italic mb-3" style={{ fontSize: "clamp(26px, 6vw, 38px)", color: I.text }}>
          What are you open to?
        </h1>
        <p style={{ fontSize: "12px", color: I.textMuted, lineHeight: 1.6, marginBottom: 32 }}>
          Go through each item privately. Your answers stay hidden until you both reveal together — only mutual matches will be highlighted.
        </p>

        <ExplorationGrid
          items={EXPLORATION_ITEMS}
          values={answers}
          onResponseChange={handleResponseChange}
          onCommentChange={handleCommentChange}
        />

        {/* Done button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowComplete(true)}
            className="rounded-xl transition-all duration-150 active:scale-[0.98]"
            style={{
              padding: "13px 28px",
              background: myAnsweredCount === TOTAL_EXPLORATION ? "rgba(196,126,160,0.12)" : "transparent",
              border: `1px solid ${myAnsweredCount === TOTAL_EXPLORATION ? I.rose : I.edge}`,
              color: myAnsweredCount === TOTAL_EXPLORATION ? I.text : I.textDim,
              fontSize: "13px",
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 600,
              fontStyle: "italic",
              cursor: "pointer",
            }}
          >
            {myAnsweredCount === TOTAL_EXPLORATION
              ? "I'm done with this section ✦"
              : `${myAnsweredCount}/${TOTAL_EXPLORATION} — I'm done for now`}
          </button>
        </div>
      </main>

      <footer className="text-center py-10 border-t mt-10" style={{ borderColor: I.edge }}>
        <p className="font-display" style={{ fontSize: "18px", color: I.textDim }}>pecanandpoplar.com</p>
      </footer>
    </div>
  );
}
