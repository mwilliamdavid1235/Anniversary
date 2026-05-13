import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { EXPLORATION_ITEMS, EXPLORATION_OPTION_LABELS, getRevealTier, type GridResponse } from "@/lib/exploration-items";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { maryAnswers, mdAnswers } = body as {
    maryAnswers: Record<string, GridResponse>;
    mdAnswers: Record<string, GridResponse>;
  };

  const sharedInterests: string[] = [];
  const toExplore: string[] = [];

  for (const item of EXPLORATION_ITEMS) {
    const m = maryAnswers[item.id];
    const d = mdAnswers[item.id];
    if (!m || !d) continue;
    const tier = getRevealTier(m, d);
    const mLabel = EXPLORATION_OPTION_LABELS[m]?.short ?? m;
    const dLabel = EXPLORATION_OPTION_LABELS[d]?.short ?? d;
    if (tier === "strong") sharedInterests.push(`${item.label} (Mary: ${mLabel}, MD: ${dLabel})`);
    if (tier === "explore") toExplore.push(`${item.label} (Mary: ${mLabel}, MD: ${dLabel})`);
  }

  const prompt = `Mary and MD just completed an exploration menu for their anniversary — rating 10 sexual experiences as yes, curious, conditions, need more info, fantasy only, or no.

Strong alignment (both said yes): ${sharedInterests.length ? sharedInterests.join("; ") : "none"}
Worth exploring (one yes + one curious/conditions): ${toExplore.length ? toExplore.join("; ") : "none"}

Write 2–3 short, warm, direct sentences introducing what they should talk about. Lead with what they're both clearly excited about. Be matter-of-fact and real — not clinical, not overly romantic. No headers. Just a brief paragraph they read together before they go through the results.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 180,
    messages: [{ role: "user", content: prompt }],
  });

  const summary =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  return NextResponse.json({ summary });
}
