import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sectionLabel, questions, maryAnswers, mdAnswers } = body as {
    sectionLabel: string;
    questions: { id: string; text: string }[];
    maryAnswers: Record<string, string>;
    mdAnswers: Record<string, string>;
  };

  if (!sectionLabel || !questions || !maryAnswers || !mdAnswers) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const pairs = questions
    .map((q) => {
      const m = maryAnswers[q.id]?.trim();
      const md = mdAnswers[q.id]?.trim();
      if (!m && !md) return null;
      return `Q: ${q.text}\nMary: ${m || "(no answer)"}\nMD: ${md || "(no answer)"}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const prompt = `You're helping a couple — Mary and MD — have a meaningful conversation on their anniversary trip. Below are their answers to a set of "${sectionLabel}" questions.

${pairs}

Write 2–3 short, warm sentences that surface what's worth talking about. Don't summarize every answer — find the thread that matters. Be direct and genuine, not flowery. No headers, no lists, just a brief paragraph they can read together before they talk.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 180,
    messages: [{ role: "user", content: prompt }],
  });

  const summary =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  return NextResponse.json({ summary });
}
