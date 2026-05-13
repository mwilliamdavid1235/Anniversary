export type GridResponse =
  | "yes"
  | "curious"
  | "conditions"
  | "need_info"
  | "fantasy_only"
  | "no";

export const EXPLORATION_RESPONSE_ORDER: GridResponse[] = [
  "yes",
  "curious",
  "conditions",
  "need_info",
  "fantasy_only",
  "no",
];

export const EXPLORATION_OPTION_LABELS: Record<
  GridResponse,
  { short: string; description: string }
> = {
  yes:          { short: "Yes",                           description: "I already know I like this" },
  curious:      { short: "Maybe / Curious",               description: "I'd consider trying this in the right setting" },
  conditions:   { short: "Only under certain conditions", description: "This could work depending on the situation, mood, or trust" },
  need_info:    { short: "Need more info first",          description: "I'm interested, but I don't fully understand it yet" },
  fantasy_only: { short: "Fantasy only",                  description: "Exciting to think about, but I don't think I'd actually do it" },
  no:           { short: "No",                            description: "Not for me right now" },
};

export interface ExplorationItem {
  id: string;
  label: string;
  description: string;
}

export const EXPLORATION_ITEMS: ExplorationItem[] = [
  {
    id: "e1",
    label: "A dedicated unhurried evening with zero agenda",
    description: "Setting aside real time — no distractions, no rushing to anything else.",
  },
  {
    id: "e2",
    label: "Trying a new location or setting",
    description: "Taking intimacy somewhere different from the usual.",
  },
  {
    id: "e3",
    label: "Using a toy or new object together",
    description: "Introducing something new into the experience.",
  },
  {
    id: "e4",
    label: "Role play or a scenario",
    description: "Playing out a character, fantasy, or situation together.",
  },
  {
    id: "e5",
    label: "Watching or reading something together",
    description: "Using erotica, a film, or other media as a shared starting point.",
  },
  {
    id: "e6",
    label: "More dominant/submissive energy (either direction)",
    description: "Leaning into a power dynamic — giving or receiving.",
  },
  {
    id: "e7",
    label: "Extended foreplay with no main event",
    description: "Making the buildup the entire experience, intentionally.",
  },
  {
    id: "e8",
    label: "Talking through a fantasy out loud",
    description: "Describing something while it's happening — narrating together.",
  },
  {
    id: "e9",
    label: "Sensory play (blindfold, light restraint, etc.)",
    description: "Heightening sensation by removing or limiting one sense.",
  },
  {
    id: "e10",
    label: "A slow intentional intimacy night — no sex, just touch",
    description: "Closeness, connection, and physical presence without a sexual goal.",
  },
];

export const TOTAL_EXPLORATION = EXPLORATION_ITEMS.length;

// ── Tier logic ──────────────────────────────────────────────────

export type RevealTier = "strong" | "explore" | "conversation" | "mismatch" | "hidden";

export function getRevealTier(a: GridResponse, b: GridResponse): RevealTier {
  if (a === "no" && b === "no") return "hidden";

  if (a === "yes" && b === "yes") return "strong";

  const EXPLORE_PAIRS = new Set([
    "yes+curious",
    "curious+yes",
    "curious+curious",
    "yes+conditions",
    "conditions+yes",
    "curious+conditions",
    "conditions+curious",
  ]);
  if (EXPLORE_PAIRS.has(`${a}+${b}`)) return "explore";

  if (
    (a === "yes" || a === "curious") && b === "no"
  ) return "mismatch";
  if (
    a === "no" && (b === "yes" || b === "curious")
  ) return "mismatch";

  return "conversation";
}
