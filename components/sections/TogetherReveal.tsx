"use client";

import type { Question } from "@/lib/connection-questions";
import type { IntimacyQuestion } from "@/lib/intimacy-questions";

type AnyQuestion = Question | IntimacyQuestion;

interface AnswerMap {
  [questionId: string]: { answer_text?: string; selected_option?: string };
}

interface TogetherRevealProps {
  questions: AnyQuestion[];
  maryAnswers: AnswerMap;
  mdAnswers: AnswerMap;
  palette?: "forest" | "intimate";
}

function isSameOption(a: string | undefined, b: string | undefined) {
  return a && b && a === b;
}

export default function TogetherReveal({
  questions,
  maryAnswers,
  mdAnswers,
  palette = "forest",
}: TogetherRevealProps) {
  const isIntimate = palette === "intimate";
  const matchColor = isIntimate ? "#C47EA0" : "#6DB87E";
  const matchBg = isIntimate ? "rgba(196,126,160,0.08)" : "rgba(109,184,126,0.06)";
  const matchBorder = isIntimate ? "#4A2D5A" : "#2D5038";
  const labelColor = isIntimate ? "#9B7FA8" : "#6E8A74";
  const categoryBg = isIntimate ? "rgba(46,31,64,0.3)" : "rgba(30,51,25,0.3)";
  const categoryBorder = isIntimate ? "#2E1F40" : "#1E3319";

  const categories: Record<string, AnyQuestion[]> = {};
  for (const q of questions) {
    if (!categories[q.category]) categories[q.category] = [];
    categories[q.category].push(q);
  }

  let qIndex = 0;

  return (
    <div>
      {Object.entries(categories).map(([cat, qs]) => (
        <div key={cat} className="mb-10">
          <div
            className="rounded-lg px-4 py-2 mb-4 flex items-center gap-3"
            style={{ background: categoryBg, border: `1px solid ${categoryBorder}` }}
          >
            <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: labelColor }}>
              {cat}
            </span>
          </div>

          {qs.map((q) => {
            qIndex++;
            const mAns = maryAnswers[q.id];
            const dAns = mdAnswers[q.id];
            const matched = q.kind === "choice" && isSameOption(mAns?.selected_option, dAns?.selected_option);

            return (
              <div key={q.id} className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="font-display"
                    style={{ fontSize: "22px", color: isIntimate ? "#3D2850" : "#2D4D28" }}
                  >
                    {String(qIndex).padStart(2, "0")}
                  </span>
                  <p
                    className="leading-snug"
                    style={{ fontSize: "15px", color: isIntimate ? "#EDE0E8" : "#E2D9C6", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 600 }}
                  >
                    {q.text}
                  </p>
                </div>

                {matched && (
                  <div
                    className="rounded-lg px-3 py-1.5 mb-2 inline-flex items-center gap-1"
                    style={{ background: matchBg, border: `1px solid ${matchBorder}` }}
                  >
                    <span style={{ fontSize: "9px", color: matchColor, letterSpacing: "0.12em" }}>
                      ✦ You both chose this
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(["mary", "md"] as const).map((person) => {
                    const ans = person === "mary" ? mAns : dAns;
                    const chosenOption = q.kind === "choice" ? ans?.selected_option : undefined;
                    const bodyText = ans?.answer_text;
                    const openText = q.kind === "open" ? bodyText : undefined;
                    const hasContent = chosenOption || openText;
                    return (
                      <div
                        key={person}
                        className="rounded-lg p-3"
                        style={{
                          background: isIntimate ? "rgba(13,11,16,0.5)" : "rgba(11,19,9,0.4)",
                          border: `1px solid ${isIntimate ? "#2E1F40" : "#1A2E18"}`,
                        }}
                      >
                        <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: labelColor, marginBottom: 6 }}>
                          {person === "mary" ? "Mary" : "MD"}
                        </p>

                        {!hasContent && (
                          <span style={{ fontSize: "13px", color: isIntimate ? "#3D2850" : "#2D4D28", fontStyle: "italic" }}>—</span>
                        )}

                        {chosenOption && (
                          <p style={{ fontSize: "13px", color: isIntimate ? "#EDE0E8" : "#E2D9C6", lineHeight: 1.5, marginBottom: bodyText && bodyText.trim() ? 8 : 0 }}>
                            <span style={{ marginRight: 8, color: isIntimate ? "#C47EA0" : "#6DB87E" }}>◆</span>
                            {chosenOption}
                          </p>
                        )}

                        {bodyText && bodyText.trim() && chosenOption && (
                          <p style={{ fontSize: "12px", color: labelColor, lineHeight: 1.6, whiteSpace: "pre-wrap", fontStyle: "italic", paddingLeft: 22 }}>
                            {bodyText}
                          </p>
                        )}

                        {openText && !chosenOption && (
                          <p style={{ fontSize: "13px", color: isIntimate ? "#EDE0E8" : "#E2D9C6", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                            {openText}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
