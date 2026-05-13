export type QuestionKind = "open" | "choice";

export interface Question {
  id: string;
  category: string;
  text: string;
  kind: QuestionKind;
  options?: string[];
  placeholder?: string;
}

export const CONNECTION_QUESTIONS: Question[] = [
  // ── Category 1: The Beginning ─────────────────────────────
  {
    id: "c1",
    category: "The Beginning",
    text: "What's your honest first impression of the other person?",
    kind: "open",
    placeholder: "Be honest — what did you actually think?",
  },
  {
    id: "c2",
    category: "The Beginning",
    text: "When did you first realize this was something real?",
    kind: "choice",
    options: [
      "During our very first conversation",
      "On our first date",
      "A few weeks in, quietly",
      "A specific moment I'll never forget",
      "Honestly, later than I expected",
    ],
  },
  {
    id: "c3",
    category: "The Beginning",
    text: "What's a detail from early on that you've never forgotten?",
    kind: "open",
    placeholder: "Something small, or something big…",
  },
  {
    id: "c4",
    category: "The Beginning",
    text: "What were you most nervous about at the start?",
    kind: "choice",
    options: [
      "That they wouldn't feel the same way",
      "That I'd mess it up",
      "Meeting their people",
      "Getting too attached too fast",
      "I wasn't — I just went for it",
    ],
  },

  // ── Category 2: Knowing Each Other ───────────────────────
  {
    id: "c5",
    category: "Knowing Each Other",
    text: "What's something about your partner that most people don't know, but you do?",
    kind: "open",
    placeholder: "The thing that's just yours to know…",
  },
  {
    id: "c6",
    category: "Knowing Each Other",
    text: "How does your partner best receive love?",
    kind: "choice",
    options: [
      "Quality time, undivided",
      "Words — being told directly",
      "Acts of service / being taken care of",
      "Physical presence and touch",
      "All of the above, honestly",
    ],
  },
  {
    id: "c7",
    category: "Knowing Each Other",
    text: "What habit or quirk of theirs do you secretly love?",
    kind: "open",
    placeholder: "The thing you'd never ask them to stop…",
  },
  {
    id: "c8",
    category: "Knowing Each Other",
    text: "When your partner is stressed, they:",
    kind: "choice",
    options: [
      "Go quiet and need space",
      "Talk it through immediately",
      "Get busy — cleaning, doing things",
      "Need to be around people",
      "It varies",
    ],
  },
  {
    id: "c9",
    category: "Knowing Each Other",
    text: "What's something they're proud of that you think they don't celebrate enough?",
    kind: "open",
    placeholder: "Something they've earned but don't say out loud…",
  },

  // ── Category 3: The Relationship ─────────────────────────
  {
    id: "c10",
    category: "The Relationship",
    text: "What's a moment in your relationship that changed something — even subtly?",
    kind: "open",
    placeholder: "A turn, a shift, a before-and-after…",
  },
  {
    id: "c11",
    category: "The Relationship",
    text: "What's your relationship's greatest strength?",
    kind: "choice",
    options: [
      "We communicate — even when it's hard",
      "We make each other laugh, always",
      "We give each other space to grow",
      "We show up for each other without question",
      "We genuinely like each other as people",
    ],
  },
  {
    id: "c12",
    category: "The Relationship",
    text: "What's the hardest thing you've navigated together, and what did it show you?",
    kind: "open",
    placeholder: "What it was, and what it revealed…",
  },
  {
    id: "c13",
    category: "The Relationship",
    text: "When things get hard between you two, what usually brings you back?",
    kind: "choice",
    options: [
      "One of us breaks the ice",
      "Time — we reset naturally",
      "A laugh at the right moment",
      "A gesture, not even words",
      "We don't let it sit long",
    ],
  },
  {
    id: "c14",
    category: "The Relationship",
    text: "What does your partner do that makes you feel most like yourself?",
    kind: "open",
    placeholder: "The thing they do that unlocks you…",
  },

  // ── Category 4: The Fun Stuff ─────────────────────────────
  {
    id: "c15",
    category: "The Fun Stuff",
    text: "Your ideal night together is:",
    kind: "choice",
    options: [
      "Out — dinner, live music, something happening",
      "Home, couch, no plans",
      "Adventure — anything that's a story later",
      "Whatever they want, I just like being there",
      "Depends on the week",
    ],
  },
  {
    id: "c16",
    category: "The Fun Stuff",
    text: "What's a shared inside joke or bit that will never get old?",
    kind: "open",
    placeholder: "The one that still makes you laugh…",
  },
  {
    id: "c17",
    category: "The Fun Stuff",
    text: "Who's the better cook?",
    kind: "choice",
    options: [
      "Me, and they know it",
      "Them, no contest",
      "We're an unstoppable team",
      "Neither — we outsource this",
      "Depends what's being made",
    ],
  },
  {
    id: "c18",
    category: "The Fun Stuff",
    text: "What trip or adventure together is your all-time favorite so far?",
    kind: "open",
    placeholder: "The one you'd do again tomorrow…",
  },

  // ── Category 5: Growth & Gratitude ───────────────────────
  {
    id: "c19",
    category: "Growth & Gratitude",
    text: "How have you changed since being with this person?",
    kind: "open",
    placeholder: "What's different about who you are now…",
  },
  {
    id: "c20",
    category: "Growth & Gratitude",
    text: "What has your relationship taught you most about yourself?",
    kind: "choice",
    options: [
      "How to communicate better",
      "That I'm capable of more than I thought",
      "How to let someone actually in",
      "What I really need vs what I thought I needed",
      "How to be patient",
    ],
  },
  {
    id: "c21",
    category: "Growth & Gratitude",
    text: "What's something you want to thank them for that you don't say often enough?",
    kind: "open",
    placeholder: "The quiet thing they do that means everything…",
  },
  {
    id: "c22",
    category: "Growth & Gratitude",
    text: "Looking back, what are you most proud of as a couple?",
    kind: "choice",
    options: [
      "How we handle conflict",
      "The life we've built together",
      "Supporting each other's individual goals",
      "The memories and adventures we've made",
      "Choosing each other, again and again",
    ],
  },

  // ── Category 6: The Future ────────────────────────────────
  {
    id: "c23",
    category: "The Future",
    text: "What's something you want to experience or build together that you haven't yet?",
    kind: "open",
    placeholder: "Something still ahead of you…",
  },
  {
    id: "c24",
    category: "The Future",
    text: "When you imagine your future with this person, what stands out most?",
    kind: "choice",
    options: [
      "A home that really feels like ours",
      "Travel and experiences — a full life",
      "Watching them become who they're becoming",
      "Stability, peace, something steady",
      "Just more time — more of this",
    ],
  },
  {
    id: "c25",
    category: "The Future",
    text: "What kind of partner do you want to be in the next year?",
    kind: "open",
    placeholder: "Who you're working toward…",
  },

  // ── Category 7: The Honest Ones ──────────────────────────
  {
    id: "c26",
    category: "The Honest Ones",
    text: "What do you wish they knew about how much they matter to you?",
    kind: "open",
    placeholder: "The thing that's hard to say out loud…",
  },
  {
    id: "c27",
    category: "The Honest Ones",
    text: "What do you want more of in the relationship?",
    kind: "choice",
    options: [
      "Spontaneity and surprise",
      "Deep conversation",
      "Slow, unscheduled time together",
      "Celebrating the small things more",
      "More of everything",
    ],
  },
  {
    id: "c28",
    category: "The Honest Ones",
    text: "If you had to describe this relationship in three words, what would they be?",
    kind: "open",
    placeholder: "Three words. Take your time.",
  },
];

export const CONNECTION_CATEGORIES = [
  "The Beginning",
  "Knowing Each Other",
  "The Relationship",
  "The Fun Stuff",
  "Growth & Gratitude",
  "The Future",
  "The Honest Ones",
];

export const TOTAL_CONNECTION = CONNECTION_QUESTIONS.length; // 28
