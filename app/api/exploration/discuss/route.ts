import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  EXPLORATION_SECTIONS,
  EXPLORATION_OPTION_LABELS,
  getRevealTier,
  type GridResponse,
} from "@/lib/exploration-items";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sectionId, maryAnswers, mdAnswers } = body as {
    sectionId: string;
    maryAnswers: Record<string, GridResponse>;
    mdAnswers: Record<string, GridResponse>;
  };

  const section = EXPLORATION_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return NextResponse.json({ error: "Unknown section" }, { status: 400 });

  const shared: string[] = [];
  for (const item of section.items) {
    const m = maryAnswers[item.id];
    const d = mdAnswers[item.id];
    if (!m || !d) continue;
    const tier = getRevealTier(m, d);
    if (tier === "both_strong" || tier === "strong" || tier === "explore") {
      const mLabel = EXPLORATION_OPTION_LABELS[m].short;
      const dLabel = EXPLORATION_OPTION_LABELS[d].short;
      shared.push(`${item.label} (Mary: ${mLabel}, MD: ${dLabel})`);
    }
  }

  if (shared.length === 0) {
    return NextResponse.json({ summary: "You have different comfort levels here — that's useful to know. Talk through what stood out to each of you." });
  }

  const prompt = `Mary and MD are on their anniversary trip going through an intimacy exploration together. They just both responded to items in the "${section.label}" category.

Items they both showed interest in: ${shared.join("; ")}

Write one warm, direct sentence — nothing more — that simply names what they share and invites them to talk about it. Don't be clinical. Don't be overly romantic. Just a gentle, real pointer to what they have in common here.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 80,
    messages: [{ role: "user", content: prompt }],
  });

  const summary =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  return NextResponse.json({ summary });
}
