import type {
  Choice,
  LearnCategory,
  LearnCourse,
  LearnQuestion,
  LearnUnit,
  VocabEntry,
} from "@/lib/learn/types";

import { KITCHEN_UTENSILS } from "@/lib/learn/kitchen";
export { KITCHEN_UTENSILS } from "@/lib/learn/kitchen";

const UNIT_TITLES = [
  ["greetings", "Greetings and expressions"],
  ["family", "Family and relationships"],
  ["food", "Food and drink"],
  ["kitchen-utensils", "Traditional kitchen utensils"],
  ["everyday-actions", "Everyday actions and conversations"],
  ["religion", "Religion and worship"],
  ["festivals", "Festivals"],
  ["weddings", "Weddings and traditions"],
  ["music", "Music and instruments"],
  ["clothing", "Clothing"],
  ["directions-time", "Directions and time"],
  ["nature", "Nature and animals"],
  ["feelings", "Feelings and personality"],
  ["health", "Health and the body"],
  ["everyday-life", "Everyday life"],
  ["history", "History and heritage"],
  ["spiritual-beliefs", "Spiritual beliefs"],
  ["more-culture", "Additional cultural vocabulary"],
] as const;

function choicesFor(correct: VocabEntry, label: (entry: VocabEntry) => string): Choice[] {
  const start = KITCHEN_UTENSILS.findIndex((entry) => entry.id === correct.id);
  const others = [1, 3, 7].map((offset) => KITCHEN_UTENSILS[(start + offset) % KITCHEN_UTENSILS.length]);
  return [correct, ...others]
    .map((entry) => ({ id: entry.id, label: label(entry) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function kitchenQuestions(entries: VocabEntry[]): LearnQuestion[] {
  const recall: LearnQuestion[] = entries.map((entry) => ({
    id: `recall-${entry.id}`,
    type: "type-name",
    prompt: "Type the Caribistani name of this utensil.",
    image: entry.image,
    answerId: entry.id,
    answerLabel: entry.word,
  }));
  const picture: LearnQuestion[] = entries.map((entry) => ({
    id: `picture-${entry.id}`,
    type: "picture-match",
    prompt: entry.word,
    choices: choicesFor(entry, () => "").sort((a, b) => a.id.localeCompare(b.id)).map((choice) => {
      const item = KITCHEN_UTENSILS.find((row) => row.id === choice.id)!;
      return { id: item.id, image: item.image };
    }),
    answerId: entry.id,
  }));

  const identify: LearnQuestion[] = entries.map((entry) => ({
    id: `identify-${entry.id}`,
    type: "identify-name",
    prompt: entry.explanation,
    image: entry.image,
    choices: choicesFor(entry, (item) => item.word),
    answerId: entry.id,
  }));

  const purpose: LearnQuestion[] = entries.map((entry) => ({
    id: `purpose-${entry.id}`,
    type: "purpose",
    prompt: entry.word,
    choices: choicesFor(entry, (item) => item.explanation),
    answerId: entry.id,
  }));

  const match: LearnQuestion = {
    id: "match-kitchen",
    type: "match",
    prompt: "Match each name to the description.",
    pairs: entries.slice(0, 4).map((entry) => ({
      id: entry.id,
      word: entry.word,
      meaning: entry.explanation,
    })),
  };

  return [...picture, ...identify, ...recall, ...purpose, match];
}

function units(): LearnUnit[] {
  return UNIT_TITLES.map(([slug, title], index) => {
    if (slug !== "kitchen-utensils") {
      return {
        slug,
        title,
        summary: "Waiting for verified vocabulary from the reference materials.",
        order: index + 1,
        lessons: [],
      };
    }
    return {
      slug,
      title,
      summary:
        "Bartan means cooking utensils or vessels. Meet 12 traditional items with HD images, flashcards, and picture practice.",
      vocabulary: KITCHEN_UTENSILS,
      order: index + 1,
      lessons: [0, 1, 2].map((group) => {
        const entries = KITCHEN_UTENSILS.slice(group * 4, group * 4 + 4);
        return {
          slug: group === 0 ? "names" : `names-${group + 1}`,
          title: `Kitchen essentials ${group + 1}`,
          level: "beginner" as const,
          summary: `Learn ${entries.map((entry) => entry.word).join(", ")}. Study four items, then test your memory.`,
          studyEntries: entries,
          questions: kitchenQuestions(entries),
        };
      }).concat([{
        slug: "mixed-review",
        title: "Mix it up: all 12 utensils",
        level: "beginner" as const,
        summary: "Recall every utensil with picture, name, and meaning practice. Missed answers come back for another try.",
        studyEntries: KITCHEN_UTENSILS,
        questions: kitchenQuestions(KITCHEN_UTENSILS),
      }]),
    };
  });
}

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    slug: "languages",
    title: "Languages",
    summary:
      "Caribistani (Caribbean Hindustani), Hindi, Sanskrit, Bhojpuri, Tamil, Gujarati, Punjabi, and further languages as courses are added.",
  },
  {
    slug: "religion",
    title: "Religion & Spirituality",
    summary: "Hinduism, scriptures, Bhagwans, prayers, festivals, teachings, and traditions.",
  },
  {
    slug: "culture",
    title: "Culture & Heritage",
    summary: "Indo-Caribbean, Indian, and other regional cultures, customs, and histories.",
  },
  {
    slug: "music",
    title: "Music & Bhajans",
    summary: "Instruments, bhajan meanings, pronunciation, and devotional music.",
  },
];

export const CARIBISTANI: LearnCourse = {
  slug: "caribistani",
  title: "Caribistani (Caribbean Hindustani)",
  cover: {
    src: "/images/learn/caribistani.png",
    alt: "Caribistani cover with tropical flowers, a Caribbean beach, and the flags of Guyana, Trinidad and Tobago, and Suriname.",
  },
  language: "Caribistani (Caribbean Hindustani)",
  region: "Caribbean",
  summary:
    "Learn the language of home, starting with 12 traditional kitchen utensils from your reference sheet.",
  categorySlug: "languages",
  units: units(),
};

const UPCOMING_LANGUAGES: LearnCourse[] = [
  { slug: "hindi", title: "Hindi" },
  { slug: "sanskrit", title: "Sanskrit" },
  { slug: "bhojpuri", title: "Bhojpuri" },
  { slug: "tamil", title: "Tamil" },
  { slug: "gujarati", title: "Gujarati" },
  { slug: "punjabi", title: "Punjabi" },
].map(({ slug, title }) => ({
  slug,
  title,
  language: title,
  region: "India",
  cover: {
    src: `/images/learn/${slug}.png`,
    alt: `${title} language course illustration`,
  },
  comingSoon: true,
  summary: `${title} lessons are coming soon.`,
  categorySlug: "languages",
  units: [],
}));

const COURSES = [CARIBISTANI, ...UPCOMING_LANGUAGES];

export function getLearnCategory(slug: string) {
  return LEARN_CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function coursesInCategory(slug: string) {
  return COURSES.filter((course) => course.categorySlug === slug);
}

export function getCourse(slug: string) {
  return COURSES.find((course) => course.slug === slug && !course.comingSoon) ?? null;
}

export function getUnit(courseSlug: string, unitSlug: string) {
  const course = getCourse(courseSlug);
  const unit = course?.units.find((item) => item.slug === unitSlug) ?? null;
  return course && unit ? { course, unit } : null;
}

export function getLesson(courseSlug: string, unitSlug: string, lessonSlug: string) {
  const found = getUnit(courseSlug, unitSlug);
  const lesson = found?.unit.lessons.find((item) => item.slug === lessonSlug) ?? null;
  return found && lesson ? { ...found, lesson } : null;
}

export function questionNeedsImage(question: LearnQuestion) {
  if (question.type !== "picture-match") return false;
  return question.choices.some((choice) => !choice.image.src);
}

export function playableQuestions(questions: LearnQuestion[]) {
  return questions.filter((question) => !questionNeedsImage(question));
}

export function pendingPictureCount(questions: LearnQuestion[]) {
  return questions.filter(questionNeedsImage).length;
}
