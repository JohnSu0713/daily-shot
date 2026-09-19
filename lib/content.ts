export type Lesson = {
  id: string;
  concept: string;
  intro: string;
  prompts: string[];
  practice: string;
};

export const dailyLesson: Lesson = {
  id: "observe-before-judging",
  concept: "Observe Before Judging",
  intro: "Separate what you see from what you assume. Start with light, shape, gesture, distance, repetition, contrast, and framing.",
  prompts: [
    "Where does your eye go first?",
    "What is the light doing?",
    "What might exist outside the frame?"
  ],
  practice: "Photograph one ordinary subject three ways: emphasize light, shape, then story. Compare which frame communicates most clearly."
};