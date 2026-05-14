"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Question } from "@/lib/connection-questions";

interface QuestionCardProps {
  question: Question;
  answerText?: string;
  selectedOption?: string;
  onSave: (qId: string, data: { answer_text?: string; selected_option?: string }) => void;
  palette?: "forest" | "intimate";
  number: number;
}

const FOREST = {
  cardBg: "rgba(255,255,255,0.025)",
  cardBorder: "#1A2E18",
  cardBorderSaved: "#2D5038",
  questionText: "#E2D9C6",
  optionBg: "rgba(11,19,9,0.5)",
  optionBorder: "#1E3319",
  optionBorderActive: "#C49A45",
  optionTextActive: "#E2D9C6",
  optionText: "#6E8A74",
  inputBg: "rgba(11,19,9,0.6)",
  inputBorder: "#1E3319",
  inputBorderFocus: "#2D4D28",
  inputText: "#E2D9C6",
  savedDot: "#6DB87E",
  categoryColor: "#3A5040",
  numberColor: "#2D4D28",
};

const INTIMATE = {
  cardBg: "rgba(255,255,255,0.02)",
  cardBorder: "#2E1F40",
  cardBorderSaved: "#4A2D5A",
  questionText: "#EDE0E8",
  optionBg: "rgba(13,11,16,0.5)",
  optionBorder: "#2E1F40",
  optionBorderActive: "#C47EA0",
  optionTextActive: "#EDE0E8",
  optionText: "#9B7FA8",
  inputBg: "rgba(13,11,16,0.6)",
  inputBorder: "#2E1F40",
  inputBorderFocus: "#4A2D5A",
  inputText: "#EDE0E8",
  savedDot: "#C47EA0",
  categoryColor: "#6B4A7A",
  numberColor: "#3D2850",
};

export default function QuestionCard({
  question,
  answerText = "",
  selectedOption = "",
  onSave,
  palette = "forest",
  number,
}: QuestionCardProps) {
  const c = palette === "intimate" ? INTIMATE : FOREST;
  const [text, setText] = useState(answerText);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when parent answer loads
  useEffect(() => { setText(answerText); }, [answerText]);

  const debouncedSave = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSave(question.id, { answer_text: value });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 800);
    },
    [question.id, onSave]
  );

  function handleTextChange(value: string) {
    setText(value);
    debouncedSave(value);
  }

  function handleChoice(opt: string) {
    onSave(question.id, { selected_option: opt });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isAnswered =
    question.kind === "open"
      ? text.trim().length > 0
      : selectedOption.length > 0;

  return (
    <div
      className="rounded-xl p-5 mb-4"
      style={{
        background: c.cardBg,
        border: `1px solid ${isAnswered ? c.cardBorderSaved : c.cardBorder}`,
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Number + category */}
      <div className="flex items-baseline gap-2 mb-3">
        <span
          className="font-display"
          style={{ fontSize: "28px", color: c.numberColor, lineHeight: 1 }}
        >
          {String(number).padStart(2, "0")}
        </span>
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: c.categoryColor,
          }}
        >
          {question.category}
        </span>
      </div>

      {/* Question text */}
      <p
        className="leading-snug mb-4"
        style={{ fontSize: "16px", color: c.questionText, fontFamily: "var(--font-display), serif", fontWeight: 400, fontStyle: "italic" }}
      >
        {question.text}
      </p>

      {/* Open-ended */}
      {question.kind === "open" && (
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className="w-full rounded-lg outline-none resize-none leading-relaxed"
            style={{
              background: c.inputBg,
              border: `1px solid ${c.inputBorder}`,
              color: c.inputText,
              fontSize: "13px",
              padding: "10px 12px",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = c.inputBorderFocus;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = c.inputBorder;
            }}
          />
          {saved && (
            <span
              className="absolute bottom-2 right-2"
              style={{ fontSize: "9px", color: c.savedDot, letterSpacing: "0.1em" }}
            >
              ✓ saved
            </span>
          )}
        </div>
      )}

      {/* Multiple choice */}
      {question.kind === "choice" && question.options && (
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={opt}
                onClick={() => handleChoice(opt)}
                className="w-full text-left rounded-lg transition-all duration-150 active:scale-[0.99]"
                style={{
                  padding: "10px 14px",
                  background: isSelected ? "rgba(196,154,69,0.08)" : c.optionBg,
                  border: `1px solid ${isSelected ? c.optionBorderActive : c.optionBorder}`,
                  color: isSelected ? c.optionTextActive : c.optionText,
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "var(--font-dm-mono), monospace",
                }}
              >
                <span
                  style={{
                    marginRight: 8,
                    color: isSelected ? c.savedDot : c.numberColor,
                  }}
                >
                  {isSelected ? "◆" : "◇"}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
