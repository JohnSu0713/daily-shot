export type Lesson = {
  id: string;
  concept: string;
  kicker: string;
  intro: string;
  prompts: string[];
  practice: string;
  takeaway: string;
};

export const LESSONS: Lesson[] = [
  {
    id: "gesture",
    concept: "Gesture Carries the Story",
    kicker: "Human attention",
    intro: "Before you read a face, notice hands, shoulders, posture, and where bodies lean. Gesture often tells you what the photograph feels like before expression does.",
    prompts: ["Where does your eye land first?", "Which gesture holds the most tension?", "What changes if you crop one person out?"],
    practice: "Photograph one person without asking them to pose. Make three frames where hands or posture—not facial expression—carry the meaning.",
    takeaway: "Strong photographs often describe emotion indirectly."
  },
  {
    id: "layers",
    concept: "Build With Layers",
    kicker: "Composition",
    intro: "Foreground, middle ground, and background can each carry information. A layered frame feels discovered rather than arranged.",
    prompts: ["How many visual layers can you name?", "Which figure anchors the frame?", "Where does repetition create rhythm?"],
    practice: "Find a busy scene. Wait until foreground, middle ground, and background each contain something useful before you press the shutter.",
    takeaway: "Depth is not only optical—it can be informational."
  },
  {
    id: "framing",
    concept: "Let the Frame Apply Pressure",
    kicker: "Portraiture",
    intro: "A tight frame removes escape routes. Background texture, edge tension, and direct eye contact can make a simple portrait feel unavoidable.",
    prompts: ["How close is the frame to the subject?", "What does the background contribute?", "Would more negative space weaken or strengthen it?"],
    practice: "Make one portrait at three distances: loose, medium, and uncomfortably close. Compare how emotional pressure changes.",
    takeaway: "Distance is one of your strongest storytelling controls."
  },
  {
    id: "symbols",
    concept: "Use Symbols, Then Complicate Them",
    kicker: "Visual meaning",
    intro: "Flags, uniforms, tools, architecture, and objects arrive with cultural meaning. Strong photographs use that meaning without becoming a simple caption.",
    prompts: ["Which object feels symbolic?", "What visual contradiction do you notice?", "What detail keeps the image from being one-note?"],
    practice: "Photograph a familiar symbol in a context that changes or complicates its usual meaning.",
    takeaway: "A symbol becomes interesting when the photograph adds friction."
  },
  {
    id: "color",
    concept: "Color Organizes Space",
    kicker: "Color",
    intro: "Color is structural. Repeated hues can connect distant areas of a frame, while one contrasting color can become an instant focal point.",
    prompts: ["Which color family dominates?", "Where is the strongest contrast?", "What still works if you imagine the image in black and white?"],
    practice: "Choose one color and make five frames where it appears in different parts of the composition.",
    takeaway: "Treat color like shape, not decoration."
  },
  {
    id: "atmosphere",
    concept: "Weather Is a Visual Material",
    kicker: "Atmosphere",
    intro: "Dust, rain, fog, snow, and harsh sun change contrast, depth, edges, and scale. Conditions are not obstacles—they are part of the image.",
    prompts: ["What does the atmosphere hide?", "How is scale communicated?", "Which edge is sharpest, and why?"],
    practice: "On the next imperfect-weather day, make photographs that depend on the condition rather than trying to hide it.",
    takeaway: "Atmosphere can become both subject and composition."
  },
  {
    id: "depth",
    concept: "Make the Eye Travel",
    kicker: "Depth",
    intro: "Leading lines, repeated planes, and overlapping shapes give the eye a route through a photograph. Good depth makes looking feel sequential.",
    prompts: ["What is the visual entry point?", "Which line pulls you deeper?", "Where does the eye finally stop?"],
    practice: "Photograph an interior using at least three planes of depth and one strong directional line.",
    takeaway: "A frame can have a beginning, middle, and end."
  }
];

export function getLesson(id: string) {
  return LESSONS.find((lesson) => lesson.id === id) ?? LESSONS[0];
}
