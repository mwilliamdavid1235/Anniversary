import type { QuestionKind } from "./connection-questions";

export type IntimacyQuestionKind = QuestionKind;

export interface IntimacyQuestion {
  id: string;
  category: string;
  text: string;
  kind: IntimacyQuestionKind;
  options?: string[];
  placeholder?: string;
}

export const INTIMACY_QUESTIONS: IntimacyQuestion[] = [
  // ── Category 1: Acknowledgment ───────────────────────────
  {
    id: "i1",
    category: "Acknowledgment",
    text: "What's something about our sex life right now that you genuinely love and don't want to lose?",
    kind: "open",
    placeholder: "The thing that's working — say it out loud…",
  },
  {
    id: "i2",
    category: "Acknowledgment",
    text: "How would you describe the current state of our intimacy?",
    kind: "choice",
    options: [
      "Thriving — we've hit our stride",
      "Good, with room to grow",
      "In a bit of a rut, if we're being honest",
      "Disconnected lately, but I want to fix it",
      "Evolving — we're in a transition",
    ],
  },
  {
    id: "i3",
    category: "Acknowledgment",
    text: "Is there something you've wanted to say about our sex life but haven't found the right moment? Say it here.",
    kind: "open",
    placeholder: "This is the right moment…",
  },
  {
    id: "i4",
    category: "Acknowledgment",
    text: "How comfortable do you feel talking about sex with me?",
    kind: "choice",
    options: [
      "Completely open — nothing is off the table",
      "Pretty comfortable, with a few edge cases",
      "I want to be more open than I am",
      "It's harder than it should be",
      "Depends on timing and mood",
    ],
  },

  // ── Category 2: Safety & Access ──────────────────────────
  {
    id: "i5",
    category: "Safety & Access",
    text: "What has to be true for you to feel genuinely open to sex? Think environment, emotional state, timing.",
    kind: "open",
    placeholder: "The conditions that open you up…",
  },
  {
    id: "i6",
    category: "Safety & Access",
    text: "Your desire is best described as:",
    kind: "choice",
    options: [
      "Spontaneous — it shows up on its own",
      "Responsive — it arrives once things get started",
      "Context-dependent — it's all about conditions",
      "It varies, sometimes both",
    ],
  },
  {
    id: "i7",
    category: "Safety & Access",
    text: "What tends to kill your desire, even when you're otherwise attracted to me?",
    kind: "open",
    placeholder: "The thing that shuts you down…",
  },
  {
    id: "i8",
    category: "Safety & Access",
    text: "When you're stressed or depleted, what do you need from me most?",
    kind: "choice",
    options: [
      "Physical closeness with zero expectation",
      "Space and patience",
      "For you to initiate, gently",
      "To be asked what I need",
      "Just to feel seen and not neglected",
    ],
  },
  {
    id: "i9",
    category: "Safety & Access",
    text: "What could I do outside the bedroom that would make you want me more inside it?",
    kind: "open",
    placeholder: "The everyday things that matter more than people think…",
  },

  // ── Category 3: Desire & Turn-On ─────────────────────────
  {
    id: "i10",
    category: "Desire & Turn-On",
    text: "Describe what your ideal 'getting there' looks like — the buildup, not just the destination.",
    kind: "open",
    placeholder: "Pace, atmosphere, approach — the whole thing…",
  },
  {
    id: "i11",
    category: "Desire & Turn-On",
    text: "What turns you on most reliably?",
    kind: "choice",
    options: [
      "Physical touch in specific ways",
      "Words — being told what you want",
      "Tension and anticipation — the slow build",
      "Feeling deeply desired and wanted",
      "Novelty — something different or unexpected",
    ],
  },
  {
    id: "i12",
    category: "Desire & Turn-On",
    text: "Is there something I do (or used to do) that turns you on that I've maybe stopped doing?",
    kind: "open",
    placeholder: "Something that used to happen more…",
  },
  {
    id: "i13",
    category: "Desire & Turn-On",
    text: "How important is emotional connection to your sexual desire?",
    kind: "choice",
    options: [
      "Essential — I basically can't get there without it",
      "Very important, but not a hard requirement",
      "Somewhat — it enhances but isn't the gate",
      "Not very — I can separate the two",
    ],
  },
  {
    id: "i14",
    category: "Desire & Turn-On",
    text: "What's a fantasy you have — realistic or not — that you've never fully told me?",
    kind: "open",
    placeholder: "As specific or as vague as you're comfortable with…",
  },

  // ── Category 4: Pleasure ──────────────────────────────────
  {
    id: "i15",
    category: "Pleasure",
    text: "What does it feel like when sex is really, truly great for you? Physically and emotionally.",
    kind: "open",
    placeholder: "What makes great different from good…",
  },
  {
    id: "i16",
    category: "Pleasure",
    text: "What would make sex better for you most consistently?",
    kind: "choice",
    options: [
      "More time and less rushing",
      "More communication during — tell me what you want",
      "Different or more varied touch",
      "More focused attention on what I actually like",
      "More playfulness, less pressure",
    ],
  },
  {
    id: "i17",
    category: "Pleasure",
    text: "Is there something you want more of physically that you've been hesitant to ask for?",
    kind: "open",
    placeholder: "The ask you haven't made yet…",
  },
  {
    id: "i18",
    category: "Pleasure",
    text: "Orgasm for you is:",
    kind: "choice",
    options: [
      "The main event — the goal I'm oriented toward",
      "Wonderful but not required for sex to be great",
      "Inconsistent, and I wish we talked about it more",
      "Complicated in ways I'd like to explain",
    ],
  },
  {
    id: "i19",
    category: "Pleasure",
    text: "What's something your body loves that I might not fully know about yet?",
    kind: "open",
    placeholder: "Something to discover together…",
  },

  // ── Category 5: Exploration ───────────────────────────────
  {
    id: "i20",
    category: "Exploration",
    text: "Is there something you've been curious about trying that we haven't done yet?",
    kind: "open",
    placeholder: "The thing you've thought about…",
  },
  {
    id: "i22",
    category: "Exploration",
    text: "Describe a scenario or experience you want to create with me that we haven't yet. Paint the picture.",
    kind: "open",
    placeholder: "Set the scene — who, where, how it starts, how it feels…",
  },
  {
    id: "i23",
    category: "Exploration",
    text: "When it comes to trying new things sexually, you are:",
    kind: "choice",
    options: [
      "Enthusiastic — I'll try almost anything",
      "Open but need to talk it through first",
      "Selectively curious — depends on what it is",
      "More comfortable being led than initiating",
      "Still figuring out what I want to explore",
    ],
  },

  // ── Category 6: The Real Talk ─────────────────────────────
  {
    id: "i24",
    category: "The Real Talk",
    text: "Is there something about our sex life that's quietly bothered you that we've never really resolved?",
    kind: "open",
    placeholder: "The thing that needed a conversation but didn't get one…",
  },
  {
    id: "i25",
    category: "The Real Talk",
    text: "What do you wish I understood about your relationship with your own body or sexuality?",
    kind: "open",
    placeholder: "Something about you that context would help me understand…",
  },
  {
    id: "i26",
    category: "The Real Talk",
    text: "What would make you feel most sexually confident with me?",
    kind: "choice",
    options: [
      "More explicit verbal affirmation during sex",
      "Knowing I can ask for what I want without judgment",
      "Feeling genuinely desired — not just available",
      "More playfulness, less seriousness",
      "All of the above",
    ],
  },
  {
    id: "i27",
    category: "The Real Talk",
    text: "If you could design our best night — from the moment we decide it's happening to how it ends — what does that look like?",
    kind: "open",
    placeholder: "Start to finish. Be specific. This is just for us.",
  },
];

export const INTIMACY_CATEGORIES = [
  "Acknowledgment",
  "Safety & Access",
  "Desire & Turn-On",
  "Pleasure",
  "Exploration",
  "The Real Talk",
];

export const TOTAL_INTIMACY = INTIMACY_QUESTIONS.length; // 26
