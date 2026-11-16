type Word = { id: string; word: string; alternativeSpellings: string[]; acceptedNames?: string[] };

/** Ignore case, accents, spacing, and punctuation in romanized vocabulary. */
export function normalizeAnswer(value: string) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
}

/** Edit distance including a swapped adjacent pair of letters. */
function distance(a: string, b: string) {
  const rows = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) rows[i][0] = i;
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + Number(a[i - 1] !== b[j - 1]));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
    }
  }
  return rows[a.length][b.length];
}

export function matchesVocabularyAnswer(input: string, answerId: string, vocabulary: Word[]) {
  const normalized = normalizeAnswer(input.trim());
  if (!normalized || normalized.length > 100 || !/[a-z]/.test(normalized)) return false;
  const ranked = vocabulary.map((entry) => {
    const spellings = [entry.word, ...entry.alternativeSpellings, ...(entry.acceptedNames ?? [])].map(normalizeAnswer);
    const score = Math.min(...spellings.map((word) => distance(normalized, word)));
    const length = Math.min(...spellings.map((word) => word.length));
    return { id: entry.id, score, limit: length < 4 ? 0 : length < 8 ? 1 : 2 };
  }).sort((a, b) => a.score - b.score);
  const best = ranked[0];
  // Accept only a clear match: never turn another utensil's name into this answer.
  return Boolean(best && best.id === answerId && best.score <= best.limit && (ranked.length < 2 || best.score < ranked[1].score));
}
