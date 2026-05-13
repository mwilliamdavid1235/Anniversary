"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PasswordGate from "@/components/sections/PasswordGate";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import {
  EXPLORATION_ITEMS,
  EXPLORATION_OPTION_LABELS,
  EXPLORATION_RESPONSE_ORDER,
  getRevealTier,
  type GridResponse,
  type RevealTier,
} from "@/lib/exploration-items";

const PALETTE = {
  bg: "#0C0810",
  edge: "#2E1F40",
  text: "#EDE0E8",
  textMuted: "#9B7FA8",
  textFaint: "#6B4A7A",
  textDim: "#3D2850",
  rose: "#C47EA0",
  gold: "#C49A45",
};

const RESPONSE_COLORS: Record<GridResponse, string> = {
  yes:          "#6DB87E",
  curious:      "#C47EA0",
  conditions:   "#C49A45",
  need_info:    "#9B8FC4",
  fantasy_only: "#C47A8A",
  no:           "#3D2850",
};

const TIER_CONFIG: Record<Exclude<RevealTier, "hidden">, { label: string; color: string; bg: string; border: string }> = {
  strong:       { label: "Strong Alignment",        color: PALETTE.rose,    bg: "rgba(196,126,160,0.08)", border: "#C47EA0" },
  explore:      { label: "Worth Exploring",         color: PALETTE.gold,    bg: "rgba(196,154,69,0.07)",  border: "#7A5F25" },
  conversation: { label: "Worth a Conversation",   color: "#8A9B6E",       bg: "rgba(138,155,110,0.07)", border: "#4A5E3A" },
  mismatch:     { label: "Different Answers",       color: PALETTE.textFaint, bg: "rgba(46,31,64,0.3)",  border: PALETTE.edge },
};

// ── ItemCard ──────────────────────────────────────────────────

function ItemCard({
  item,
  isOpen,
  onToggle,
  response,
  onSelect,
  locked,
}: {
  item: typeof EXPLORATION_ITEMS[0];
  isOpen: boolean;
  onToggle: () => void;
  response: GridResponse | null;
  onSelect: (r: GridResponse) => void;
  locked: boolean;
}) {
  const hasAnswer = !!response;
  const accentColor = hasAnswer ? RESPONSE_COLORS[response!] : PALETTE.edge;

  return (
    <div
      className="mb-3 rounded-xl overflow-hidden"
      style={{
        background: isOpen ? "rgba(196,126,160,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isOpen ? PALETTE.rose + "40" : hasAnswer ? accentColor + "40" : PALETTE.edge}`,
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Header */}
      <button
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        className="w-full text-left flex items-start justify-between gap-3"
        style={{ padding: "16px 18px", background: "none", border: "none", cursor: locked ? "default" : "pointer" }}
      >
        <div className="flex-1">
          <p
            style={{
              fontSize: isOpen ? "18px" : "16px",
              color: isOpen ? PALETTE.text : hasAnswer ? PALETTE.textMuted : PALETTE.textFaint,
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.3,
              transition: "font-size 0.15s ease, color 0.15s ease",
              marginBottom: hasAnswer && !isOpen ? 4 : 0,
            }}
          >
            {hasAnswer && !isOpen && (
              <span style={{ fontSize: "9px", color: accentColor, marginRight: 8, verticalAlign: "middle" }}>◆</span>
            )}
            {item.label}
          </p>
          {/* Response preview when collapsed */}
          {hasAnswer && !isOpen && (
            <p style={{ fontSize: "11px", color: accentColor, paddingLeft: 17 }}>
              {EXPLORATION_OPTION_LABELS[response!].short}
            </p>
          )}
          {/* Description when open */}
          {isOpen && (
            <p style={{ fontSize: "12px", color: PALETTE.textFaint, marginTop: 4, lineHeight: 1.5 }}>
              {item.description}
            </p>
          )}
        </div>
        {!locked && (
          <span style={{ fontSize: "9px", color: PALETTE.textDim, flexShrink: 0, marginTop: 4 }}>
            {isOpen ? "▲" : "▼"}
          </span>
        )}
      </button>

      {/* Response options when open */}
      {isOpen && !locked && (
        <div style={{ padding: "0 18px 18px" }} className="flex flex-col gap-2">
          {EXPLORATION_RESPONSE_ORDER.map((opt) => {
            const label = EXPLORATION_OPTION_LABELS[opt];
            const selected = response === opt;
            const color = RESPONSE_COLORS[opt];
            return (
              <button
                key={opt}
                onClick={() => onSelect(opt)}
                className="text-left rounded-lg px-4 py-3 transition-all duration-150"
                style={{
                  background: selected ? `${color}18` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selected ? color + "60" : PALETTE.edge}`,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "8px", marginRight: 10, color: selected ? color : PALETTE.textDim }}>
                  {selected ? "◆" : "◇"}
                </span>
                <span style={{ fontSize: "13px", color: selected ? PALETTE.text : PALETTE.textMuted }}>
                  {label.short}
                </span>
                <span style={{ fontSize: "11px", color: PALETTE.textFaint, display: "block", paddingLeft: 18, marginTop: 2 }}>
                  {label.description}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── DiscussScreen ─────────────────────────────────────────────

function DiscussScreen({
  person,
  myAnswers,
  partnerAnswers,
  summary,
}: {
  person: Person;
  myAnswers: Record<string, GridResponse>;
  partnerAnswers: Record<string, GridResponse>;
  summary: string;
}) {
  const myName = person === "mary" ? "Mary" : "MD";
  const partnerName = person === "mary" ? "MD" : "Mary";

  const tiers: Record<Exclude<RevealTier, "hidden">, typeof EXPLORATION_ITEMS> = {
    strong: [], explore: [], conversation: [], mismatch: [],
  };
  for (const item of EXPLORATION_ITEMS) {
    const m = myAnswers[item.id];
    const p = partnerAnswers[item.id];
    if (!m || !p) continue;
    const [maryR, mdR] = person === "mary" ? [m, p] : [p, m];
    const tier = getRevealTier(maryR, mdR);
    if (tier !== "hidden") tiers[tier].push(item);
  }

  return (
    <div className="fade-up">
      {/* AI summary */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ background: "rgba(196,126,160,0.08)", border: `1px solid ${PALETTE.rose}30` }}
      >
        <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: PALETTE.rose, marginBottom: 10, opacity: 0.7 }}>
          ✦ To discuss
        </p>
        <p className="font-display italic leading-relaxed" style={{ fontSize: "18px", color: PALETTE.text }}>
          {summary}
        </p>
      </div>

      {/* Tiered results */}
      {(["strong", "explore", "conversation", "mismatch"] as const).map((tier) => {
        const items = tiers[tier];
        if (items.length === 0) return null;
        const cfg = TIER_CONFIG[tier];
        return (
          <div key={tier} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg px-3 py-1" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <span style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: cfg.color }}>
                  ✦ {cfg.label}
                </span>
              </div>
              <span style={{ fontSize: "10px", color: PALETTE.textDim }}>{items.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const myR = myAnswers[item.id];
                const partnerR = partnerAnswers[item.id];
                return (
                  <div key={item.id} className="rounded-xl p-4" style={{ background: "rgba(13,11,16,0.3)", border: `1px solid ${PALETTE.edge}` }}>
                    <p style={{ fontSize: "14px", color: PALETTE.text, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", marginBottom: 4 }}>
                      {item.label}
                    </p>
                    <div className="flex gap-3 mt-2">
                      {myR && (
                        <div className="flex-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${PALETTE.edge}` }}>
                          <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: PALETTE.textDim, marginBottom: 3, textTransform: "uppercase" }}>{myName}</p>
                          <p style={{ fontSize: "12px", color: RESPONSE_COLORS[myR] }}>{EXPLORATION_OPTION_LABELS[myR].short}</p>
                        </div>
                      )}
                      {partnerR && (
                        <div className="flex-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${PALETTE.edge}` }}>
                          <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: PALETTE.textDim, marginBottom: 3, textTransform: "uppercase" }}>{partnerName}</p>
                          <p style={{ fontSize: "12px", color: RESPONSE_COLORS[partnerR] }}>{EXPLORATION_OPTION_LABELS[partnerR].short}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* End card */}
      <div
        className="rounded-xl p-5 text-center mt-4"
        style={{ background: "rgba(196,154,69,0.06)", border: "1px solid rgba(196,154,69,0.2)" }}
      >
        <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: PALETTE.gold, marginBottom: 10, opacity: 0.8 }}>
          ✦ That's everything
        </p>
        <p className="font-display italic mb-4" style={{ fontSize: "20px", color: PALETTE.text }}>
          Now talk about it.
        </p>
        <Link
          href="/"
          style={{
            display: "block",
            padding: "14px",
            background: "rgba(196,154,69,0.1)",
            border: "1px solid rgba(196,154,69,0.3)",
            color: PALETTE.gold,
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
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function ExplorationPage() {
  const [pwUnlocked, setPwUnlocked] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [myAnswers, setMyAnswers] = useState<Record<string, GridResponse>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, GridResponse>>({});
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const allAnswered = EXPLORATION_ITEMS.every((i) => myAnswers[i.id]);
  const partnerAllAnswered = EXPLORATION_ITEMS.every((i) => partnerAnswers[i.id]);
  const showDiscuss = submitted && partnerAllAnswered && !!summary;

  // ── Hydrate ──────────────────────────────────────────────
  useEffect(() => {
    const pw = localStorage.getItem("intimacy_unlocked");
    const p = localStorage.getItem("intimacy_person") as Person | null;
    const sub = localStorage.getItem("exploration_submitted") === "true";
    if (pw === "true") setPwUnlocked(true);
    if (p) setPerson(p);
    setSubmitted(sub);
    setHydrated(true);
  }, []);

  // ── Load answers ─────────────────────────────────────────
  const loadMyAnswers = useCallback(async (p: Person) => {
    const res = await fetch(`/api/exploration/answers?person=${p}`);
    if (!res.ok) return;
    const { answers } = await res.json();
    const map: Record<string, GridResponse> = {};
    for (const a of answers ?? []) map[a.item_id] = a.response;
    setMyAnswers(map);
  }, []);

  const loadPartnerAnswers = useCallback(async (p: Person) => {
    const partner = p === "mary" ? "md" : "mary";
    const res = await fetch(`/api/exploration/answers?person=${partner}`);
    if (!res.ok) return;
    const { answers } = await res.json();
    const map: Record<string, GridResponse> = {};
    for (const a of answers ?? []) map[a.item_id] = a.response;
    setPartnerAnswers(map);
  }, []);

  useEffect(() => {
    if (!person || !pwUnlocked) return;
    loadMyAnswers(person);
    loadPartnerAnswers(person);
    pollRef.current = setInterval(() => loadPartnerAnswers(person), 15_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [person, pwUnlocked, loadMyAnswers, loadPartnerAnswers]);

  // ── Generate summary ─────────────────────────────────────
  useEffect(() => {
    if (!submitted || !partnerAllAnswered || summary || generatingSummary || !person) return;
    setGeneratingSummary(true);
    const [maryMap, mdMap] =
      person === "mary" ? [myAnswers, partnerAnswers] : [partnerAnswers, myAnswers];
    fetch("/api/exploration/discuss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maryAnswers: maryMap, mdAnswers: mdMap }),
    })
      .then((r) => r.json())
      .then(({ summary: s }) => { if (s) setSummary(s); })
      .finally(() => setGeneratingSummary(false));
  }, [submitted, partnerAllAnswered, summary, generatingSummary, person, myAnswers, partnerAnswers]);

  // ── Save answer ──────────────────────────────────────────
  function handleSelect(itemId: string, response: GridResponse) {
    setMyAnswers((prev) => ({ ...prev, [itemId]: response }));
    setOpenItemId(null);
    if (saveTimers.current[itemId]) clearTimeout(saveTimers.current[itemId]);
    saveTimers.current[itemId] = setTimeout(async () => {
      if (!person) return;
      await fetch("/api/exploration/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person, item_id: itemId, response }),
      });
    }, 400);
  }

  // ── Submit ───────────────────────────────────────────────
  function handleSubmit() {
    setSubmitted(true);
    localStorage.setItem("exploration_submitted", "true");
    setOpenItemId(null);
  }

  // ── Person / unlock ──────────────────────────────────────
  function selectPerson(p: Person) {
    localStorage.setItem("intimacy_person", p);
    setPerson(p);
  }

  if (!hydrated) return null;
  if (!pwUnlocked) return <PasswordGate onUnlock={() => { localStorage.setItem("intimacy_unlocked", "true"); setPwUnlocked(true); }} />;
  if (!person) {
    return (
      <div style={{ background: PALETTE.bg, minHeight: "100vh" }}>
        <PersonSelector onSelect={selectPerson} />
      </div>
    );
  }

  const answeredCount = EXPLORATION_ITEMS.filter((i) => myAnswers[i.id]).length;

  return (
    <div className="min-h-screen" style={{ background: PALETTE.bg, color: PALETTE.text }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
        style={{
          background: "rgba(12,8,16,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${PALETTE.edge}`,
        }}
      >
        <Link
          href="/intimacy"
          style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: PALETTE.textFaint, textDecoration: "none" }}
        >
          ← Intimacy
        </Link>
        <p style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: PALETTE.textDim }}>
          Exploration
        </p>
        <p style={{ fontSize: "10px", color: PALETTE.textFaint }}>
          {person === "mary" ? "Mary" : "MD"}
        </p>
      </div>

      <div className="px-5 pt-8 pb-16 max-w-lg mx-auto">
        {/* Title */}
        <h1 className="font-display italic mb-1" style={{ fontSize: "34px", color: PALETTE.text, lineHeight: 1.1 }}>
          What Are You Open To?
        </h1>
        <p className="mb-8 leading-relaxed" style={{ fontSize: "13px", color: PALETTE.textFaint }}>
          Go through each one privately. Your answers stay hidden until you both submit — then you see where you align.
        </p>

        {/* Main content */}
        {showDiscuss ? (
          <DiscussScreen
            person={person}
            myAnswers={myAnswers}
            partnerAnswers={partnerAnswers}
            summary={summary}
          />
        ) : (
          <>
            {/* Progress */}
            {!submitted && (
              <div className="mb-5">
                <div className="rounded-full overflow-hidden mb-1" style={{ height: 2, background: PALETTE.edge }}>
                  <div
                    className="h-full rounded-full transition-all duration-400"
                    style={{ width: `${(answeredCount / EXPLORATION_ITEMS.length) * 100}%`, background: PALETTE.rose }}
                  />
                </div>
                <p style={{ fontSize: "10px", color: PALETTE.textDim }}>
                  {answeredCount} of {EXPLORATION_ITEMS.length}
                </p>
              </div>
            )}

            {/* Items */}
            {EXPLORATION_ITEMS.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isOpen={openItemId === item.id}
                onToggle={() => setOpenItemId((prev) => (prev === item.id ? null : item.id))}
                response={myAnswers[item.id] ?? null}
                onSelect={(r) => handleSelect(item.id, r)}
                locked={submitted}
              />
            ))}

            {/* Submit / waiting */}
            {submitted ? (
              <div
                className="mt-6 rounded-xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${PALETTE.edge}` }}
              >
                {generatingSummary ? (
                  <>
                    <p style={{ fontSize: "11px", color: PALETTE.textFaint, marginBottom: 4 }}>Reading your answers…</p>
                    <p style={{ fontSize: "10px", color: PALETTE.textDim }}>Just a moment</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "11px", color: PALETTE.textFaint, marginBottom: 4 }}>
                      Your answers are locked in. Waiting for {person === "mary" ? "MD" : "Mary"}…
                    </p>
                    <p style={{ fontSize: "10px", color: PALETTE.textDim }}>
                      The reveal opens when they finish.
                    </p>
                  </>
                )}
              </div>
            ) : allAnswered ? (
              <button
                onClick={handleSubmit}
                className="w-full mt-5 rounded-xl py-4 transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(196,126,160,0.12)",
                  border: `1px solid ${PALETTE.rose}40`,
                  color: PALETTE.rose,
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Submit my answers
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
