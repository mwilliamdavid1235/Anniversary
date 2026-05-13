export type GridResponse = "strong" | "yes" | "curious" | "fantasy_only" | "no";

export const EXPLORATION_RESPONSE_ORDER: GridResponse[] = [
  "strong",
  "yes",
  "curious",
  "fantasy_only",
  "no",
];

export const EXPLORATION_OPTION_LABELS: Record<
  GridResponse,
  { emoji: string; short: string; description: string }
> = {
  strong:       { emoji: "⭐", short: "Strong interest",  description: "Yes — and I really want this" },
  yes:          { emoji: "✅", short: "Yes",              description: "I'm open to this" },
  curious:      { emoji: "🤔", short: "Maybe / Curious",  description: "I'd consider it in the right moment" },
  fantasy_only: { emoji: "💭", short: "Fantasy only",     description: "Exciting to think about, not sure I'd actually do it" },
  no:           { emoji: "❌", short: "No",               description: "Not for me right now" },
};

export interface ExplorationItem {
  id: string;
  label: string;
  description: string;
}

export interface ExplorationSection {
  id: string;
  label: string;
  note?: string;
  items: ExplorationItem[];
}

export const EXPLORATION_SECTIONS: ExplorationSection[] = [
  {
    id: "affection",
    label: "Affection & Romantic Energy",
    items: [
      { id: "a1", label: "Extended kissing",              description: "Slow, intentional making out" },
      { id: "a2", label: "Showering together",            description: "Bathing or relaxing together without expectations" },
      { id: "a3", label: "Naked cuddling",                description: "Being physically close without necessarily leading to sex" },
      { id: "a4", label: "Massage",                       description: "Giving or receiving massage with oils or lotion" },
      { id: "a5", label: "Eye contact during intimacy",   description: "Intentionally staying visually connected" },
      { id: "a6", label: "Slow dancing",                  description: "Romantic physical closeness" },
      { id: "a7", label: "Compliment exchange",           description: "Saying what you find sexy or attractive about each other" },
      { id: "a8", label: "Reading erotic stories together", description: "Exploring turn-ons through stories instead of physical acts" },
      { id: "a9", label: "Flirty texting",                description: "Teasing, suggestive, or romantic messaging" },
    ],
  },
  {
    id: "sensual",
    label: "Sensual Touch & Body Exploration",
    items: [
      { id: "s1", label: "Light teasing touch",           description: "Gentle touching intended to build anticipation" },
      { id: "s2", label: "Back scratching",               description: "Fingernails lightly on skin" },
      { id: "s3", label: "Hair pulling (gentle)",         description: "Light tugging during kissing or intimacy" },
      { id: "s4", label: "Kissing different body parts",  description: "Neck, shoulders, stomach, thighs, and more" },
      { id: "s5", label: "Sensory play",                  description: "Ice cubes, feathers, silk, warm oil, and similar" },
      { id: "s6", label: "Being blindfolded",             description: "Temporarily removing sight to heighten sensation" },
      { id: "s7", label: "Taking turns exploring each other", description: "One person focuses completely on the other, then switch" },
    ],
  },
  {
    id: "communication",
    label: "Communication & Fantasy",
    items: [
      { id: "c1", label: "Talking about fantasies",       description: "Sharing ideas without pressure to act on them" },
      { id: "c2", label: "\"Tell me what you'd do to me\"", description: "Verbal anticipation or guided fantasy" },
      { id: "c3", label: "Using sexy language",           description: "Compliments, praise, or playful teasing" },
      { id: "c4", label: "Praise",                        description: "Hearing affirming things during intimacy" },
      { id: "c5", label: "Guided intimacy",               description: "One partner directs what they want" },
      { id: "c6", label: "Roleplay (light)",              description: "Playful pretend scenarios" },
      { id: "c7", label: "Writing fantasies down",        description: "Sharing privately in writing first" },
    ],
  },
  {
    id: "foreplay",
    label: "Foreplay & Sexual Touch",
    items: [
      { id: "f1", label: "Mutual touching",               description: "Exploring each other at the same time" },
      { id: "f2", label: "Oral sex (giving)",             description: "Using the mouth to stimulate a partner" },
      { id: "f3", label: "Oral sex (receiving)",          description: "Receiving oral stimulation" },
      { id: "f4", label: "Manual stimulation",            description: "Using hands or fingers for pleasure" },
      { id: "f5", label: "Mutual masturbation",           description: "Pleasuring yourselves together" },
      { id: "f6", label: "Watching each other",           description: "Visually enjoying your partner's pleasure" },
      { id: "f7", label: "Trying different positions",    description: "Exploring comfort, closeness, or novelty" },
      { id: "f8", label: "Shower/bath intimacy",          description: "Sexual touch in water" },
    ],
  },
  {
    id: "power",
    label: "Power, Confidence & Playfulness",
    note: "Go at whatever pace feels right — no item here is required.",
    items: [
      { id: "p1", label: "Being more dominant",           description: "Taking the lead confidently" },
      { id: "p2", label: "Being more submissive",         description: "Letting your partner lead" },
      { id: "p3", label: "Light restraint",               description: "Hands held or soft restraints" },
      { id: "p4", label: "Giving instructions",           description: "Slower, harder, don't stop — directing in the moment" },
      { id: "p5", label: "Light spanking",                description: "Gentle, playful impact" },
      { id: "p6", label: "Being \"seduced\"",             description: "One partner takes the lead on planning, initiation, and setting the scene" },
      { id: "p7", label: "Dressing up",                   description: "Lingerie, costumes, or intentional styling" },
      { id: "p8", label: "Public-but-private teasing",    description: "Flirting where others don't realize it" },
    ],
  },
  {
    id: "novelty",
    label: "Novelty & Adventure",
    items: [
      { id: "n1", label: "Trying a new room or location", description: "Different setting than usual" },
      { id: "n2", label: "Weekend intimacy date",         description: "Planned romantic or sexual experience away from routine" },
      { id: "n3", label: "Sex games or cards",            description: "Prompt-based exploration together" },
      { id: "n4", label: "Using a toy together",          description: "Vibrators or other pleasure tools" },
      { id: "n5", label: "Shopping for lingerie or toys together", description: "Exploring preferences collaboratively" },
      { id: "n6", label: "Watching ethical erotic content", description: "Guided, educational, or inspiring content that opens conversation — not pornographic" },
      { id: "n7", label: "Creating a fantasy bucket list", description: "Writing future curiosities together" },
    ],
  },
  {
    id: "aftercare",
    label: "Emotional Safety & Aftercare",
    note: "These are some of the most important items on the list.",
    items: [
      { id: "z1", label: "Post-intimacy cuddling",        description: "Intentional closeness afterward" },
      { id: "z2", label: "Talking afterward",             description: "Sharing what felt good emotionally or physically" },
      { id: "z3", label: "Reassurance",                   description: "Hearing affirming or loving words" },
      { id: "z4", label: "Slowing down when overwhelmed", description: "Pausing without guilt" },
      { id: "z5", label: "Using a check-in phrase",       description: "A simple word or signal to communicate comfort in the moment — pause, continue, or stop" },
      { id: "z6", label: "Planning intimacy ahead of time", description: "Reduces pressure and surprise" },
    ],
  },
];

// Flat list for backwards compat / status checks
export const EXPLORATION_ITEMS = EXPLORATION_SECTIONS.flatMap((s) => s.items);
export const TOTAL_EXPLORATION = EXPLORATION_ITEMS.length;

// ── Tier logic ──────────────────────────────────────────────────

export type RevealTier =
  | "both_strong"
  | "strong"
  | "explore"
  | "fantasy"
  | "mismatch"
  | "hidden";

export function getRevealTier(a: GridResponse, b: GridResponse): RevealTier {
  if (a === "no" && b === "no") return "hidden";
  if (a === "no" || b === "no") return "mismatch";
  if (a === "strong" && b === "strong") return "both_strong";
  if ((a === "strong" || a === "yes") && (b === "strong" || b === "yes")) return "strong";
  if (a === "fantasy_only" || b === "fantasy_only") return "fantasy";
  if (a === "curious" || b === "curious") return "explore";
  return "hidden";
}
