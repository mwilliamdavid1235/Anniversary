export interface GuidedQuestion {
  id: string;
  act: 1 | 2 | 3 | 4;
  text: string;
  placeholder?: string;
  completeSentence?: string; // for Act IV fill-in-the-blank
}

// Act I — Settle In (answered together in real time, both visible immediately)
export const ACT1_QUESTIONS: GuidedQuestion[] = [
  {
    id: "a1_q1",
    act: 1,
    text: "What's one thing about our sex life that made you smile recently?",
    placeholder: "Something small is fine…",
  },
  {
    id: "a1_q2",
    act: 1,
    text: "What's one word for how you feel about our intimacy right now.",
    placeholder: "Just one word…",
  },
  {
    id: "a1_q3",
    act: 1,
    text: "Is there anything you want to say before we start — something to clear the air or set an intention?",
    placeholder: "Or leave it blank and just begin.",
  },
];

// Act II — What I Know About You (guess your partner, revealed side by side)
export const ACT2_QUESTIONS: GuidedQuestion[] = [
  {
    id: "a2_q1",
    act: 2,
    text: "What I think gets you most turned on, reliably.",
    placeholder: "Your best honest guess…",
  },
  {
    id: "a2_q2",
    act: 2,
    text: "What I think kills your desire fastest.",
    placeholder: "The thing you'd wish I didn't do…",
  },
  {
    id: "a2_q3",
    act: 2,
    text: "What I think you want more of in bed but haven't asked for.",
    placeholder: "What I imagine you're holding back…",
  },
  {
    id: "a2_q4",
    act: 2,
    text: "What's my best guess at a fantasy you haven't fully told me.",
    placeholder: "I think you want…",
  },
];

// Act III — Tell Me What You Want (answered independently, revealed together)
export const ACT3_QUESTIONS: GuidedQuestion[] = [
  {
    id: "a3_q1",
    act: 3,
    text: "If tonight could feel like anything, what would that be?",
    placeholder: "A mood, a feeling, a word…",
  },
  {
    id: "a3_q2",
    act: 3,
    text: "What's something you want me to do — specifically — that I haven't done in a while, or ever?",
    placeholder: "As specific as you're willing to be…",
  },
  {
    id: "a3_q3",
    act: 3,
    text: "Is there a 'yes' hiding in your 'maybe' pile? What is it?",
    placeholder: "The thing that's closer to yes than you've admitted…",
  },
  {
    id: "a3_q4",
    act: 3,
    text: "What's the most alive you've ever felt with me?",
    placeholder: "A moment, a night, a feeling…",
  },
];

// Act IV — The Invitation (complete the sentences, both shown)
export const ACT4_QUESTIONS: GuidedQuestion[] = [
  {
    id: "a4_q1",
    act: 4,
    text: "Something I want to give you tonight is…",
    completeSentence: "Something I want to give you tonight is ",
    placeholder: "complete the sentence",
  },
  {
    id: "a4_q2",
    act: 4,
    text: "Something I want to ask for tonight is…",
    completeSentence: "Something I want to ask for tonight is ",
    placeholder: "complete the sentence",
  },
];

// Final shared prompt (shown to both simultaneously, no hiding)
export const FINAL_PROMPT = "What do you want tonight to feel like?";

export const ALL_GUIDED_QUESTIONS = [
  ...ACT1_QUESTIONS,
  ...ACT2_QUESTIONS,
  ...ACT3_QUESTIONS,
  ...ACT4_QUESTIONS,
];

export const ACT_LABELS = {
  1: "Settle In",
  2: "What I Know About You",
  3: "Tell Me What You Want",
  4: "The Invitation",
};

export const ACT_DESCRIPTIONS = {
  1: "Answer together, in the same room.",
  2: "Each of you guesses what your partner will say. Answers are hidden until you both submit.",
  3: "Answer separately. Answers are revealed side by side once you've both finished.",
  4: "Complete each sentence. Both answers shown together.",
};
