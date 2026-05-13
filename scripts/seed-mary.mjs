// Seed Mary's answers for end-to-end testing
// Usage: node scripts/seed-mary.mjs

const BASE = "http://localhost:3000";

async function post(url, body) {
  const res = await fetch(`${BASE}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`FAIL ${url}:`, text);
  }
}

// ── Connection answers (c1–c28) ───────────────────────────────────────────────
const connectionAnswers = [
  // First Impressions
  { question_id: "c1", answer_text: "You made me laugh within the first five minutes. I wasn't expecting that at all." },
  { question_id: "c2", selected_option: "On our first date", answer_text: "It was pretty quick — I just knew." },
  { question_id: "c3", answer_text: "That maybe I was reading too much into little things. Every text felt like a puzzle." },
  { question_id: "c4", selected_option: "That I'd mess it up" },

  // How We Communicate
  { question_id: "c5", answer_text: "When we actually sit down without phones and just talk. No agenda, just us." },
  { question_id: "c6", selected_option: "Quality time, undivided" },
  { question_id: "c7", answer_text: "Probably when I shut down instead of saying what I need. I'm working on it." },
  { question_id: "c8", selected_option: "Go quiet and need space" },

  // Us Right Now
  { question_id: "c9", answer_text: "That we're building something real. It doesn't feel temporary." },
  { question_id: "c10", answer_text: "More spontaneous weekends. Just grabbing the car and going." },
  { question_id: "c11", selected_option: "We communicate — even when it's hard", answer_text: "This is the one I'm most proud of." },
  { question_id: "c12", answer_text: "The way we laugh at the same random things. That's not something you can manufacture." },

  // Conflict & Repair
  { question_id: "c13", selected_option: "One of us breaks the ice", answer_text: "Usually me, with a terrible joke." },
  { question_id: "c14", answer_text: "That I'd rather be right than close. I hate that about myself sometimes." },
  { question_id: "c15", selected_option: "Time — we reset naturally" },

  // Dreams & Direction
  { question_id: "c16", answer_text: "Being somewhere warm, coffee in hand, nowhere to be. With you." },
  { question_id: "c17", selected_option: "Travel and experiences — a full life", answer_text: "Things over stuff, always." },
  { question_id: "c18", answer_text: "That we'd stop being curious about each other. That's the one that would really hurt." },
  { question_id: "c19", answer_text: "That I'm braver than I think. You've shown me that." },

  // What We're Building
  { question_id: "c20", selected_option: "The life we've built together", answer_text: "Honestly this one surprised me when I thought about it." },
  { question_id: "c21", answer_text: "A place where we both genuinely look forward to coming home." },
  { question_id: "c22", selected_option: "How to communicate better" },
  { question_id: "c23", answer_text: "How much I've changed since being with you. In all the good ways." },

  // The Long Game
  { question_id: "c24", selected_option: "Home, couch, no plans", answer_text: "Every time, no contest." },
  { question_id: "c25", answer_text: "Still making each other laugh. That feels like the whole thing." },
  { question_id: "c26", answer_text: "I want us to keep choosing each other on purpose. Not just by default." },
  { question_id: "c27", selected_option: "Me, and they know it", answer_text: "Obviously." },
  { question_id: "c28", answer_text: "That you know, without me always having to say it, how much this means to me." },
];

// ── Intimacy answers (i1–i27, no i21) ────────────────────────────────────────
const intimacyAnswers = [
  // Foundations
  { question_id: "i1", answer_text: "Safe. Like I don't have to perform or manage how I come across." },
  { question_id: "i2", selected_option: "Thriving — we've hit our stride", answer_text: "I genuinely mean that." },
  { question_id: "i3", answer_text: "When you reach for me first. Without me having to ask." },
  { question_id: "i4", selected_option: "Completely open — nothing is off the table" },

  // Desire
  { question_id: "i5", answer_text: "When you're really present. Not distracted, not tired — just there." },
  { question_id: "i6", selected_option: "Responsive — it arrives once things get started" },
  { question_id: "i7", answer_text: "Knowing you want to be close to me, not just close." },
  { question_id: "i8", selected_option: "Words — being told what you want", answer_text: "It helps me not guess." },

  // Connection
  { question_id: "i9", answer_text: "Eye contact. The kind where neither of us looks away." },
  { question_id: "i10", answer_text: "When something outside is hard and we still find each other." },
  { question_id: "i11", selected_option: "Very important, but not a hard requirement" },
  { question_id: "i12", answer_text: "Taking my time. I don't love when things feel rushed." },

  // Vulnerability
  { question_id: "i13", selected_option: "More communication during — tell me what you want" },
  { question_id: "i14", answer_text: "That I won't always know what you need. That I'll get it wrong sometimes." },
  { question_id: "i15", answer_text: "Being completely honest about what I like without editing myself." },
  { question_id: "i16", selected_option: "Wonderful but not required for sex to be great", answer_text: "Though I love it when it is." },

  // Exploration
  { question_id: "i17", answer_text: "Something new that we actually talked about first. That matters to me." },
  { question_id: "i18", selected_option: "Open but need to talk it through first" },
  { question_id: "i19", answer_text: "More of us just being slow about it. No agenda." },
  { question_id: "i20", answer_text: "That it can be playful. We're pretty good at that." },

  // Growth
  { question_id: "i22", answer_text: "That we keep talking about it. That we don't just assume." },
  { question_id: "i23", selected_option: "Knowing I can ask for what I want without judgment" },
  { question_id: "i24", answer_text: "That what I want is valid, even if it's not what I thought I wanted." },
  { question_id: "i25", answer_text: "Us being more explicit about what's working. We do the hard conversations — I want to do the good ones too." },

  // Looking Forward
  { question_id: "i26", selected_option: "Enthusiastic — I'll try almost anything", answer_text: "With the right setup, yes." },
  { question_id: "i27", answer_text: "That we stay curious about each other. That's the one I care most about." },
];

// ── Exploration answers (e1–e10) ──────────────────────────────────────────────
const explorationAnswers = [
  { item_id: "e1", response: "yes", comment: "This is something I think about." },
  { item_id: "e2", response: "curious", comment: "Open to it with the right conversation first." },
  { item_id: "e3", response: "conditions", comment: "Needs the right moment and mood." },
  { item_id: "e4", response: "yes" },
  { item_id: "e5", response: "curious" },
  { item_id: "e6", response: "conditions", comment: "Would need to talk through it." },
  { item_id: "e7", response: "need_info", comment: "Haven't thought about this enough to know." },
  { item_id: "e8", response: "fantasy_only", comment: "Fun to think about, not sure about real life." },
  { item_id: "e9", response: "yes" },
  { item_id: "e10", response: "curious", comment: "Would depend on how we approached it." },
];

// ── Guided experience answers ─────────────────────────────────────────────────
const guidedAnswers = [
  // Act 1 — Settle In
  { act: 1, question_id: "a1_q1", answer_text: "When you pulled me close without me asking. That." },
  { act: 1, question_id: "a1_q2", answer_text: "Warm." },
  { act: 1, question_id: "a1_q3", answer_text: "I just want tonight to feel like us. No performance, no rush." },

  // Act 2 — What I Know About You
  { act: 2, question_id: "a2_q1", answer_text: "When I'm fully present and not distracted. Eye contact, slow." },
  { act: 2, question_id: "a2_q2", answer_text: "When things feel rushed or clinical. Like a to-do list." },
  { act: 2, question_id: "a2_q3", answer_text: "More words. Being told what you want instead of me guessing." },
  { act: 2, question_id: "a2_q4", answer_text: "Something slower and more deliberate than we usually do." },

  // Act 3 — Tell Me What You Want
  { act: 3, question_id: "a3_q1", answer_text: "Like we have nowhere else to be. Unhurried." },
  { act: 3, question_id: "a3_q2", answer_text: "I want you to tell me exactly what you want in the moment. Out loud." },
  { act: 3, question_id: "a3_q3", answer_text: "Staying up late just talking after. I always want that and never say it." },
  { act: 3, question_id: "a3_q4", answer_text: "That night in the mountains. Still think about it." },

  // Act 4 — The Invitation
  { act: 4, question_id: "a4_q1", answer_text: "my full attention — no distractions, no rushing." },
  { act: 4, question_id: "a4_q2", answer_text: "you to tell me what you want. Say it." },

  // Final prompt (act 5)
  { act: 5, question_id: "final", answer_text: "Like we remembered each other. Really remembered." },
];

async function main() {
  console.log("Seeding Mary's connection answers...");
  for (const a of connectionAnswers) {
    await post("/api/connection/answers", { person: "mary", ...a });
    process.stdout.write(".");
  }

  console.log("\nSeeding Mary's intimacy answers...");
  for (const a of intimacyAnswers) {
    await post("/api/intimacy/answers", { person: "mary", ...a });
    process.stdout.write(".");
  }

  console.log("\nSeeding Mary's exploration answers...");
  for (const a of explorationAnswers) {
    await post("/api/exploration/answers", { person: "mary", ...a });
    process.stdout.write(".");
  }

  console.log("\nSeeding Mary's guided experience answers...");
  for (const a of guidedAnswers) {
    await post("/api/guided/answers", { person: "mary", ...a });
    process.stdout.write(".");
  }

  console.log("\nDone! Mary's answers are seeded.");
}

main().catch(console.error);
