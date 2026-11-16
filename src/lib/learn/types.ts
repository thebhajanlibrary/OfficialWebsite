export type LearnLevel = "beginner" | "intermediate" | "advanced";

export type VerificationStatus = "verified" | "pending";

export type LearnImage = {
  /** Null until a permitted reference photograph is added. */
  src: string | null;
  alt: string;
};

export type VocabSource = {
  title: string;
  page: string | null;
  status: VerificationStatus;
};

export type VocabEntry = {
  id: string;
  word: string;
  alternativeSpellings: string[];
  /** Other names explicitly supported by a reference source. */
  acceptedNames?: string[];
  references?: VocabSource[];
  /** Null when there is no direct English equivalent. */
  english: string | null;
  explanation: string;
  category: string;
  tags: string[];
  level: LearnLevel;
  language: string;
  region: string;
  image: LearnImage;
  audioSrc: string | null;
  source: VocabSource;
};

export type Choice = { id: string; label: string };

export type PictureChoice = { id: string; image: LearnImage };

export type MatchPair = { id: string; word: string; meaning: string };

export type LearnQuestion =
  | {
      id: string;
      type: "type-name";
      prompt: string;
      image: LearnImage;
      answerId: string;
      answerLabel: string;
    }
  | {
      id: string;
      type: "picture-match";
      prompt: string;
      choices: PictureChoice[];
      answerId: string;
    }
  | {
      id: string;
      type: "identify-name";
      prompt: string;
      image: LearnImage | null;
      choices: Choice[];
      answerId: string;
    }
  | {
      id: string;
      type: "purpose";
      prompt: string;
      choices: Choice[];
      answerId: string;
    }
  | {
      id: string;
      type: "match";
      prompt: string;
      pairs: MatchPair[];
    };

export type LearnLesson = {
  slug: string;
  title: string;
  level: LearnLevel;
  summary: string;
  questions: LearnQuestion[];
  studyEntries?: VocabEntry[];
};

export type LearnUnit = {
  slug: string;
  title: string;
  summary: string;
  order: number;
  lessons: LearnLesson[];
  vocabulary?: VocabEntry[];
};

export type LearnCourse = {
  slug: string;
  title: string;
  cover?: { src: string; alt: string };
  comingSoon?: boolean;
  language: string;
  region: string;
  summary: string;
  categorySlug: string;
  units: LearnUnit[];
};

export type LearnCategory = {
  slug: string;
  title: string;
  summary: string;
};
