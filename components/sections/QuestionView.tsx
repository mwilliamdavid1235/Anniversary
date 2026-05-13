"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Question } from "@/lib/connection-questions";

export interface AnswerData {
  answer_text?: string;
  selected_option?: string;
}

interface QuestionViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  myAnswer: AnswerData;
  partnerAnswer?: AnswerData;
  partnerName: string;
  onSave: (qId: string, data: AnswerData) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  palette?: "forest" | "intimate";
  sectionLabel?: string;
  finishLabel?: string;
}

const FOREST = {
  bg: "#0B1309",
  cardBg: "rgba(255,255,255,0.025)",
  cardBorder: "#1A2E18",
  cardBorderAnswered: "#2D5038",
  questionText: "#E2D9C6",
  categoryText: "#3A5040",
  optionBg: "rgba(11,19,9,0.5)",
  optionBorder: "#1E3319",
  optionSelected: "rgba(196,154,69,0.08)",
  optionBorderSelected: "#C49A45",
  optionText: "#6E8A74",
  optionTextSelected: "#E2D9C6",
  selectedMark: "#6DB87E",
  inputBg: "rgba(11,19,9,0.6)",
  inputBorder: "#1E3319",
  inputBorderFocus: "#2D4D28",
  inputText: "#E2D9C6",
  inputPlaceholder: "#3A5040",
  savedColor: "#6DB87E",
  elabLabel: "#2D4D28",
  peekBg: "rgba(61,107,71,0.06)",
  peekBorder: "#2D4D28",
  peekLabel: "#3A5040",
  peekText: "#6E8A74",
  peekToggle: "#3A5040",
  navBtn: "rgba(196,154,69,0.1)",
  navBtnBorder: "#6B4F1E",
  navBtnText: "#C49A45",
  backText: "#3A5040",
  progressBg: "#1E3319",
  progressFill: "#C49A45",
  counterText: "#3A5040",
  numberColor: "#2D4D28",
};

const INTIMATE = {
  bg: "#0C0810",
  cardBg: "rgba(255,255,255,0.02)",
  cardBorder: "#2E1F40",
  cardBorderAnswered: "#4A2D5A",
  questionText: "#EDE0E8",
  categoryText: "#6B4A7A",
  optionBg: "rgba(13,11,16,0.5)",
  optionBorder: "#2E1F40",
  optionSelected: "rgba(196,126,160,0.08)",
  optionBorderSelected: "#C47EA0",
  optionText: "#9B7FA8",
  optionTextSelected: "#EDE0E8",
  selectedMark: "#C47EA0",
  inputBg: "rgba(13,11,16,0.6)",
  inputBorder: "#2E1F40",
  inputBorderFocus: "#4A2D5A",
  inputText: "#EDE0E8",
  inputPlaceholder: "#3D2850",
  savedColor: "#C47EA0",
  elabLabel: "#3D2850",
  peekBg: "rgba(196,126,160,0.05)",
  peekBorder: "#4A2D5A",
  peekLabel: "#6B4A7A",
  peekText: "#9B7FA8",
  peekToggle: "#6B4A7A",
  navBtn: "rgba(196,126,160,0.12)",
  navBtnBorder: "#C47EA0",
  navBtnText: "#EDE0E8",
  backText: "#3D2850",
  progressBg: "#2E1F40",
  progressFill: "#C47EA0",
  counterText: "#3D2850",
  numberColor: "#3D2850",
};

export default function QuestionView({
  question,
  questionNumber,
  totalQuestions,
  myAnswer,
  partnerAnswer,
  partnerName,
  onSave,
  onNext,
  onBack,
  isFirst,
  isLast,
  palette = "forest",
  sectionLabel,
  finishLabel,
}: QuestionViewProps) {
  const c = palette === "intimate" ? INTIMATE : FOREST;
  const [textVal, setTextVal] = useState(myAnswer.answer_text ?? "");
  const [selectedOpt, setSelectedOpt] = useState(myAnswer.selected_option ?? "");
  const [elaboration, setElaboration] = useState(myAnswer.answer_text ?? "");
  const [saved, setSaved] = useState(false);
  const [peekOpen, setPeekOpen] = useState(false);
  const textTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elabTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when parent answer updates (e.g. on load)
  useEffect(() => {
    setTextVal(myAnswer.answer_text ?? "");
    setSelectedOpt(myAnswer.selected_option ?? "");
    setElaboration(myAnswer.answer_text ?? "");
    setPeekOpen(false);
  }, [question.id, myAnswer.answer_text, myAnswer.selected_option]);

  const flashSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }, []);

  function handleTextChange(val: string) {
    setTextVal(val);
    if (textTimer.current) clearTimeout(textTimer.current);
    textTimer.current = setTimeout(() => {
      onSave(question.id, { answer_text: val });
      flashSaved();
    }, 800);
  }

  function handleChoiceSelect(opt: string) {
    const newOpt = opt === selectedOpt ? "" : opt;
    setSelectedOpt(newOpt);
    onSave(question.id, { selected_option: newOpt, answer_text: elaboration });
    flashSaved();
  }

  function handleElaborationChange(val: string) {
    setElaboration(val);
    if (elabTimer.current) clearTimeout(elabTimer.current);
    elabTimer.current = setTimeout(() => {
      onSave(question.id, { selected_option: selectedOpt, answer_text: val });
      flashSaved();
    }, 800);
  }

  const isAnswered =
    question.kind === "open"
      ? textVal.trim().length > 0
      : selectedOpt.length > 0;

  const canPeek =
    isAnswered &&
    partnerAnswer &&
    ((partnerAnswer.answer_text && partnerAnswer.answer_text.trim()) ||
      partnerAnswer.selected_option);

  const answeredProgress = questionNumber - 1; // 0-based count of how many we've passed

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: c.bg }}
    >
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div
        className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
        style={{ borderBottom: `1px solid ${c.progressBg}` }}
      >
        <button
          onClick={onBack}
          disabled={isFirst}
          style={{
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: isFirst ? "transparent" : c.backText,
            background: "none",
            border: "none",
            cursor: isFirst ? "default" : "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          ← Back
        </button>

        {/* Progress bar + counter */}
        <div className="flex-1 flex flex-col gap-1.5">
          {sectionLabel && (
            <span style={{ fontSize: "8px", color: c.counterText, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
              {sectionLabel}
            </span>
          )}
          <div className="rounded-full overflow-hidden" style={{ height: 2, background: c.progressBg }}>
            <div
              className="h-full rounded-full transition-all duration-400"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%`, background: c.progressFill }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "9px", color: c.counterText, letterSpacing: "0.1em" }}>
              {questionNumber} of {totalQuestions}
            </span>
            {saved && (
              <span style={{ fontSize: "9px", color: c.savedColor, letterSpacing: "0.08em" }}>
                ✓ saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Question card ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-xl mx-auto w-full">
        {/* Category */}
        <p
          className="mb-4"
          style={{
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: c.categoryText,
          }}
        >
          ✦ {question.category}
        </p>

        {/* Question number + text */}
        <div className="flex items-start gap-3 mb-8">
          <span
            className="font-display flex-shrink-0"
            style={{ fontSize: "36px", color: c.numberColor, lineHeight: 1.1, marginTop: 2 }}
          >
            {String(questionNumber).padStart(2, "0")}
          </span>
          <h2
            className="font-display italic leading-snug"
            style={{ fontSize: "clamp(20px, 5vw, 28px)", color: c.questionText }}
          >
            {question.text}
          </h2>
        </div>

        {/* ── Open-ended ────────────────────────────────────── */}
        {question.kind === "open" && (
          <textarea
            value={textVal}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={question.placeholder ?? "Your answer…"}
            rows={5}
            className="w-full rounded-xl outline-none resize-none leading-relaxed"
            style={{
              background: c.inputBg,
              border: `1px solid ${isAnswered ? c.cardBorderAnswered : c.inputBorder}`,
              color: c.inputText,
              fontSize: "14px",
              padding: "14px 16px",
              fontFamily: "var(--font-dm-mono), monospace",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = c.inputBorderFocus; }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = isAnswered ? c.cardBorderAnswered : c.inputBorder;
            }}
          />
        )}

        {/* ── Multiple choice + elaboration ─────────────────── */}
        {question.kind === "choice" && question.options && (
          <div>
            <div className="flex flex-col gap-2 mb-4">
              {question.options.map((opt) => {
                const isSelected = selectedOpt === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleChoiceSelect(opt)}
                    className="w-full text-left rounded-xl transition-all duration-150 active:scale-[0.99]"
                    style={{
                      padding: "11px 16px",
                      background: isSelected ? c.optionSelected : c.optionBg,
                      border: `1px solid ${isSelected ? c.optionBorderSelected : c.optionBorder}`,
                      color: isSelected ? c.optionTextSelected : c.optionText,
                      fontSize: "13px",
                      cursor: "pointer",
                      fontFamily: "var(--font-dm-mono), monospace",
                    }}
                  >
                    <span style={{ marginRight: 10, color: isSelected ? c.selectedMark : c.numberColor }}>
                      {isSelected ? "◆" : "◇"}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Elaboration — always visible once an option is selected */}
            {selectedOpt && (
              <div className="mt-1">
                <p style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: c.elabLabel, marginBottom: 6 }}>
                  Anything to add?
                </p>
                <textarea
                  value={elaboration}
                  onChange={(e) => handleElaborationChange(e.target.value)}
                  placeholder="Say more if you want…"
                  rows={3}
                  className="w-full rounded-xl outline-none resize-none leading-relaxed"
                  style={{
                    background: c.inputBg,
                    border: `1px solid ${c.inputBorder}`,
                    color: c.inputText,
                    fontSize: "13px",
                    padding: "10px 14px",
                    fontFamily: "var(--font-dm-mono), monospace",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = c.inputBorderFocus; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = c.inputBorder; }}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Partner peek ──────────────────────────────────── */}
        {canPeek && (
          <div className="mt-6">
            <button
              onClick={() => setPeekOpen((v) => !v)}
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: c.peekToggle,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{peekOpen ? "▲" : "▼"}</span>
              <span>See what {partnerName} said</span>
            </button>

            {peekOpen && (
              <div
                className="mt-3 rounded-xl p-4 fade-up"
                style={{ background: c.peekBg, border: `1px solid ${c.peekBorder}` }}
              >
                <p style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: c.peekLabel, marginBottom: 8 }}>
                  {partnerName}
                </p>
                {partnerAnswer?.selected_option && (
                  <p style={{ fontSize: "14px", color: c.peekText, marginBottom: partnerAnswer.answer_text ? 6 : 0 }}>
                    <span style={{ marginRight: 8 }}>◆</span>
                    {partnerAnswer.selected_option}
                  </p>
                )}
                {partnerAnswer?.answer_text && partnerAnswer.answer_text.trim() && (
                  <p style={{ fontSize: "13px", color: c.peekText, lineHeight: 1.6, fontStyle: "italic", whiteSpace: "pre-wrap" }}>
                    {partnerAnswer.answer_text}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom nav ───────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-5 flex-shrink-0"
        style={{ borderTop: `1px solid ${c.progressBg}` }}
      >
        <div style={{ width: 80 }} />
        <button
          onClick={onNext}
          className="rounded-xl transition-all duration-150 active:scale-[0.98]"
          style={{
            padding: "11px 24px",
            background: isAnswered ? c.navBtn : "transparent",
            border: `1px solid ${isAnswered ? c.navBtnBorder : c.progressBg}`,
            color: isAnswered ? c.navBtnText : c.counterText,
            fontSize: "12px",
            letterSpacing: "0.06em",
            cursor: "pointer",
            fontFamily: "var(--font-dm-mono), monospace",
          }}
        >
          {isLast ? (finishLabel ?? "Finish ✦") : isAnswered ? "Next →" : "Skip →"}
        </button>
      </div>
    </div>
  );
}
