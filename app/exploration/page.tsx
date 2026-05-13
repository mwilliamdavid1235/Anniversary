"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PasswordGate from "@/components/sections/PasswordGate";
import PersonSelector, { type Person } from "@/components/sections/PersonSelector";
import {
  EXPLORATION_SECTIONS,
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
  strong:       "#C49A45",
  yes:          "#6DB87E",
  curious:      "#C47EA0",
  fantasy_only: "#9B8FC4",
  no:           "#3D2850",
};

const TIER_CONFIG: Record<Exclude<RevealTier, "hidden">, { label: string; color: string; bg: string; border: string }> = {
  both_strong:  { label: "You Both Love This",      color: "#C49A45", bg: "rgba(196,154,69,0.10)", border: "#C49A45" },
  strong:       { label: "Strong Alignment",         color: PALETTE.rose, bg: "rgba(196,126,160,0.08)", border: "#C47EA0" },
  explore:      { label: "Worth Exploring",          color: "#8A9B6E", bg: "rgba(138,155,110,0.07)", border: "#4A5E3A" },
  fantasy:      { label: "Worth a Conversation",    color: "#9B8FC4", bg: "rgba(155,143,196,0.07)", border: "#5A4A7A" },
  mismatch:     { label: "Different Answers",        color: PALETTE.textFaint, bg: "rgba(46,31,64,0.3)", border: PALETTE.edge },
};

const PARTNER: Record<Person, string> = { mary: "MD", md: "Mary" };

// ── ItemCard ──────────────────────────────────────────────────

function ItemCard({
  item,
  isOpen,
  onToggle,
  response,
  onSelect,
  locked,
}: {
  item: { id: string; label: string; description: string };
  isOpen: boolean;
  onToggle: () => void;
  response: GridResponse | null;
  onSelect: (r: GridResponse) => void;
  locked: boolean;
}) {
  const hasAnswer = !!response;
  const color = hasAnswer ? RESPONSE_COLORS[response!] : PALETTE.edge;
  const label = hasAnswer ? EXPLORATION_OPTION_LABELS[response!] : null;

  return (
    <div
      className="mb-3 rounded-xl overflow-hidden"
      style={{
        background: isOpen ? "rgba(196,126,160,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isOpen ? PALETTE.rose + "35" : hasAnswer ? color + "40" : PALETTE.edge}`,
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
    >
      <button
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        className="w-full text-left flex items-start justify-between gap-3"
        style={{ padding: "14px 18px", background: "none", border: "none", cursor: locked ? "default" : "pointer" }}
      >
        <div className="flex-1">
          <p
            style={{
              fontSize: "15px",
              color: isOpen ? PALETTE.text : hasAnswer ? PALETTE.textMuted : PALETTE.textFaint,
              fontFamily: "var(--font-barlow), sans-serif",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.3,
              marginBottom: 3,
            }}
          >
            {item.label}
          </p>
          <p style={{ fontSize: "11px", color: PALETTE.textFaint, lineHeight: 1.4 }}>
            {item.description}
          </p>
          {hasAnswer && !isOpen && label && (
            <p style={{ fontSize: "11px", color, marginTop: 5 }}>
              {label.emoji} {label.short}
            </p>
          )}
        </div>
        {!locked && (
          <span style={{ fontSize: "9px", color: PALETTE.textDim, flexShrink: 0, marginTop: 4 }}>
            {isOpen ? "▲" : "▼"}
          </span>
        )}
      </button>

      {isOpen && !locked && (
        <div style={{ padding: "0 18px 16px" }} className="flex flex-col gap-2">
          {EXPLORATION_RESPONSE_ORDER.map((opt) => {
            const optLabel = EXPLORATION_OPTION_LABELS[opt];
            const selected = response === opt;
            const optColor = RESPONSE_COLORS[opt];
            return (
              <button
                key={opt}
                onClick={() => onSelect(opt)}
                className="text-left rounded-lg px-4 py-3 transition-all duration-150"
                style={{
                  background: selected ? `${optColor}15` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selected ? optColor + "55" : PALETTE.edge}`,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "13px", color: selected ? PALETTE.text : PALETTE.textMuted }}>
                  {optLabel.emoji} {optLabel.short}
                </span>
                <span style={{ fontSize: "11px", color: PALETTE.textFaint, display: "block", marginTop: 2, paddingLeft: 22 }}>
                  {optLabel.description}
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
  section,
  person,
  myAnswers,
  partnerAnswers,
  summary,
  isLastSection,
  onNext,
}: {
  section: typeof EXPLORATION_SECTIONS[0];
  person: Person;
  myAnswers: Record<string, GridResponse>;
  partnerAnswers: Record<string, GridResponse>;
  summary: string;
  isLastSection: boolean;
  onNext: () => void;
}) {
  const myName = person === "mary" ? "Mary" : "MD";
  const partnerName = PARTNER[person];

  const tiers: Record<Exclude<RevealTier, "hidden">, typeof section.items> = {
    both_strong: [], strong: [], explore: [], fantasy: [], mismatch: [],
  };

  for (const item of section.items) {
    const myR = myAnswers[item.id];
    const partnerR = partnerAnswers[item.id];
    if (!myR || !partnerR) continue;
    const [maryR, mdR] = person === "mary" ? [myR, partnerR] : [partnerR, myR];
    const tier = getRevealTier(maryR, mdR);
    if (tier !== "hidden") tiers[tier].push(item);
  }

  const hasAnything = Object.values(tiers).some((t) => t.length > 0);

  return (
    <div className="fade-up">
      {/* AI summary */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ background: "rgba(196,126,160,0.06)", border: `1px solid ${PALETTE.rose}25` }}
      >
        <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: PALETTE.rose, marginBottom: 10, opacity: 0.6 }}>
          ✦ {section.label}
        </p>
        <p className="font-display italic leading-relaxed" style={{ fontSize: "17px", color: PALETTE.text }}>
          {summary}
        </p>
      </div>

      {/* Tiered results */}
      {hasAnything ? (
        (["both_strong", "strong", "explore", "fantasy", "mismatch"] as const).map((tier) => {
          const items = tiers[tier];
          if (items.length === 0) return null;
          const cfg = TIER_CONFIG[tier];
          return (
            <div key={tier} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg px-3 py-1" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <span style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
                <span style={{ fontSize: "10px", color: PALETTE.textDim }}>{items.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item) => {
                  const myR = myAnswers[item.id];
                  const partnerR = partnerAnswers[item.id];
                  return (
                    <div key={item.id} className="rounded-xl p-4" style={{ background: "rgba(13,11,16,0.3)", border: `1px solid ${PALETTE.edge}` }}>
                      <p style={{ fontSize: "14px", color: PALETTE.text, fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600, fontStyle: "italic", marginBottom: 2 }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: "11px", color: PALETTE.textFaint, marginBottom: 8, lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                      <div className="flex gap-3">
                        {myR && (
                          <div className="flex-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${PALETTE.edge}` }}>
                            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: PALETTE.textDim, marginBottom: 3, textTransform: "uppercase" }}>{myName}</p>
                            <p style={{ fontSize: "12px", color: RESPONSE_COLORS[myR] }}>
                              {EXPLORATION_OPTION_LABELS[myR].emoji} {EXPLORATION_OPTION_LABELS[myR].short}
                            </p>
                          </div>
                        )}
                        {partnerR && (
                          <div className="flex-1 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${PALETTE.edge}` }}>
                            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: PALETTE.textDim, marginBottom: 3, textTransform: "uppercase" }}>{partnerName}</p>
                            <p style={{ fontSize: "12px", color: RESPONSE_COLORS[partnerR] }}>
                              {EXPLORATION_OPTION_LABELS[partnerR].emoji} {EXPLORATION_OPTION_LABELS[partnerR].short}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ fontSize: "13px", color: PALETTE.textFaint, textAlign: "center", marginBottom: 24 }}>
          No strong overlap here — that's fine. Worth a quick conversation before moving on.
        </p>
      )}

      {/* Next / finish */}
      <div className="mt-6">
        {isLastSection ? (
          <div
            className="rounded-xl p-5 text-center"
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
              style={{ display: "block", padding: "14px", background: "rgba(196,154,69,0.1)", border: "1px solid rgba(196,154,69,0.3)", color: PALETTE.gold, fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", borderRadius: 12 }}
            >
              ← Back to itinerary
            </Link>
          </div>
        ) : (
          <button
            onClick={onNext}
            className="w-full rounded-xl py-4 transition-all duration-200 active:scale-95"
            style={{ background: "rgba(196,126,160,0.12)", border: `1px solid ${PALETTE.rose}40`, color: PALETTE.rose, fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Next section →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function ExplorationPage() {
  const [pwUnlocked, setPwUnlocked] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(EXPLORATION_SECTIONS[0].id);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [myAnswers, setMyAnswers] = useState<Record<string, GridResponse>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, GridResponse>>({});
  const [submittedSections, setSubmittedSections] = useState<Set<string>>(new Set());
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const section = EXPLORATION_SECTIONS.find((s) => s.id === activeSectionId) ?? EXPLORATION_SECTIONS[0];
  const sectionIdx = EXPLORATION_SECTIONS.findIndex((s) => s.id === activeSectionId);
  const isLastSection = sectionIdx === EXPLORATION_SECTIONS.length - 1;

  function sectionAllAnswered(sec: typeof EXPLORATION_SECTIONS[0], answers: Record<string, GridResponse>) {
    return sec.items.every((i) => answers[i.id]);
  }

  const myComplete = sectionAllAnswered(section, myAnswers);
  const partnerComplete = sectionAllAnswered(section, partnerAnswers);
  const isSubmitted = submittedSections.has(activeSectionId);
  const hasSummary = !!summaries[activeSectionId];
  const showDiscuss = isSubmitted && partnerComplete && hasSummary;

  // ── Hydrate ──────────────────────────────────────────────
  useEffect(() => {
    const pw = localStorage.getItem("intimacy_unlocked");
    const p = localStorage.getItem("intimacy_person") as Person | null;
    const sid = localStorage.getItem("exploration_section") ?? EXPLORATION_SECTIONS[0].id;
    const submitted = JSON.parse(localStorage.getItem("exploration_submitted_sections") ?? "[]") as string[];
    if (pw === "true") setPwUnlocked(true);
    if (p) setPerson(p);
    setActiveSectionId(EXPLORATION_SECTIONS.find((s) => s.id === sid) ? sid : EXPLORATION_SECTIONS[0].id);
    setSubmittedSections(new Set(submitted));
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
    if (!isSubmitted || !partnerComplete || hasSummary || generatingSummary || !person) return;
    setGeneratingSummary(true);
    const [maryMap, mdMap] = person === "mary" ? [myAnswers, partnerAnswers] : [partnerAnswers, myAnswers];
    fetch("/api/exploration/discuss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId: activeSectionId, maryAnswers: maryMap, mdAnswers: mdMap }),
    })
      .then((r) => r.json())
      .then(({ summary: s }) => { if (s) setSummaries((prev) => ({ ...prev, [activeSectionId]: s })); })
      .finally(() => setGeneratingSummary(false));
  }, [isSubmitted, partnerComplete, hasSummary, generatingSummary, person, activeSectionId, myAnswers, partnerAnswers]);

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

  // ── Submit section ───────────────────────────────────────
  function handleSubmit() {
    const next = new Set([...submittedSections, activeSectionId]);
    setSubmittedSections(next);
    localStorage.setItem("exploration_submitted_sections", JSON.stringify([...next]));
    setOpenItemId(null);
  }

  // ── Navigate ─────────────────────────────────────────────
  function goToSection(id: string) {
    setActiveSectionId(id);
    localStorage.setItem("exploration_section", id);
    setOpenItemId(null);
  }

  function goNextSection() {
    const nextIdx = sectionIdx + 1;
    if (nextIdx < EXPLORATION_SECTIONS.length) goToSection(EXPLORATION_SECTIONS[nextIdx].id);
  }

  // ── Person / unlock ──────────────────────────────────────
  function selectPerson(p: Person) {
    localStorage.setItem("intimacy_person", p);
    setPerson(p);
  }

  if (!hydrated) return null;
  if (!pwUnlocked) return <PasswordGate onUnlock={() => { localStorage.setItem("intimacy_unlocked", "true"); setPwUnlocked(true); }} />;
  if (!person) {
    return <div style={{ background: PALETTE.bg, minHeight: "100vh" }}><PersonSelector onSelect={selectPerson} /></div>;
  }

  const answeredInSection = section.items.filter((i) => myAnswers[i.id]).length;

  return (
    <div className="min-h-screen" style={{ background: PALETTE.bg, color: PALETTE.text }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
        style={{ background: "rgba(12,8,16,0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${PALETTE.edge}` }}
      >
        <Link href="/intimacy" style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: PALETTE.textFaint, textDecoration: "none" }}>
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
        <p className="mb-2 leading-relaxed" style={{ fontSize: "13px", color: PALETTE.textFaint }}>
          Go through each section privately. You&apos;ll see your overlap after you both submit.
        </p>
        <div className="flex gap-3 mb-8 flex-wrap">
          {EXPLORATION_RESPONSE_ORDER.map((r) => {
            const l = EXPLORATION_OPTION_LABELS[r];
            return (
              <span key={r} style={{ fontSize: "11px", color: RESPONSE_COLORS[r] }}>
                {l.emoji} {l.short}
              </span>
            );
          })}
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {EXPLORATION_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => goToSection(s.id)}
              style={{
                fontSize: "9px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "5px 11px",
                borderRadius: "4px",
                border: `1px solid ${activeSectionId === s.id ? PALETTE.rose : PALETTE.edge}`,
                background: activeSectionId === s.id ? "rgba(196,126,160,0.15)" : "rgba(255,255,255,0.02)",
                color: activeSectionId === s.id ? PALETTE.rose : PALETTE.textFaint,
                cursor: "pointer",
                transition: "all 0.15s ease",
                position: "relative",
              }}
            >
              {s.label}
              {submittedSections.has(s.id) && sectionAllAnswered(s, partnerAnswers) && (
                <span style={{ position: "absolute", top: -4, right: -4, width: 7, height: 7, borderRadius: "50%", background: PALETTE.rose, display: "block" }} />
              )}
            </button>
          ))}
        </div>

        {/* Section label + note */}
        <p className="font-display italic mb-1" style={{ fontSize: "22px", color: PALETTE.rose }}>
          {section.label}
        </p>
        {section.note && (
          <p style={{ fontSize: "11px", color: PALETTE.textFaint, marginBottom: 16, fontStyle: "italic" }}>
            {section.note}
          </p>
        )}

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
          <div key={activeSectionId} className="mt-4">
            {section.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isOpen={openItemId === item.id}
                onToggle={() => setOpenItemId((prev) => (prev === item.id ? null : item.id))}
                response={myAnswers[item.id] ?? null}
                onSelect={(r) => handleSelect(item.id, r)}
                locked={isSubmitted}
              />
            ))}

            {isSubmitted ? (
              <div className="mt-6 rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${PALETTE.edge}` }}>
                {generatingSummary ? (
                  <p style={{ fontSize: "11px", color: PALETTE.textFaint }}>Reading your answers…</p>
                ) : (
                  <>
                    <p style={{ fontSize: "11px", color: PALETTE.textFaint, marginBottom: 4 }}>
                      Locked in. Waiting for {PARTNER[person]}…
                    </p>
                    <p style={{ fontSize: "10px", color: PALETTE.textDim }}>
                      The reveal opens when they finish this section.
                    </p>
                  </>
                )}
              </div>
            ) : myComplete ? (
              <button
                onClick={handleSubmit}
                className="w-full mt-5 rounded-xl py-4 transition-all duration-200 active:scale-95"
                style={{ background: "rgba(196,126,160,0.12)", border: `1px solid ${PALETTE.rose}40`, color: PALETTE.rose, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Submit my answers
              </button>
            ) : (
              <p style={{ fontSize: "10px", color: PALETTE.textDim, textAlign: "center", marginTop: 16 }}>
                {answeredInSection} of {section.items.length} answered
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
