const KEY = "bhajan-learn-progress";

export type LearnProgress = {
  xp: number;
  completedLessonIds: string[];
  /** Reserved for later. Nothing awards a badge in this version. */
  badges: string[];
  /** ISO date of the last finished lesson. Reserved for a future streak. */
  lastCompletedOn: string | null;
};

const EMPTY: LearnProgress = {
  xp: 0,
  completedLessonIds: [],
  badges: [],
  lastCompletedOn: null,
};

export function readProgress(): LearnProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as LearnProgress;
    return {
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds.filter((id) => typeof id === "string")
        : [],
      badges: Array.isArray(parsed.badges)
        ? parsed.badges.filter((id) => typeof id === "string")
        : [],
      lastCompletedOn: typeof parsed.lastCompletedOn === "string" ? parsed.lastCompletedOn : null,
    };
  } catch {
    return EMPTY;
  }
}

export function writeProgress(next: LearnProgress) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("learn-progress"));
}

export function subscribeLearnProgress(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("learn-progress", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("learn-progress", onChange);
  };
}

export function lessonId(courseSlug: string, unitSlug: string, lessonSlug: string) {
  return `${courseSlug}/${unitSlug}/${lessonSlug}`;
}

/** Awards XP the first time a lesson is finished. Later repeats do not add XP. */
export function completeLesson(id: string, xpEarned: number): LearnProgress {
  const current = readProgress();
  if (current.completedLessonIds.includes(id)) return current;
  const next: LearnProgress = {
    xp: current.xp + xpEarned,
    completedLessonIds: [...current.completedLessonIds, id],
    badges: current.badges,
    lastCompletedOn: new Date().toISOString().slice(0, 10),
  };
  writeProgress(next);
  return next;
}
