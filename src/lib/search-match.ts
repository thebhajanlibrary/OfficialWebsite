/** Normalize text for forgiving library search (accents, punctuation, case). */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchTokens(query: string): string[] {
  return normalizeSearchText(query).split(/\s+/).filter(Boolean);
}

/** Levenshtein distance with early exit when above `max`. */
function levenshteinWithin(a: string, b: string, max: number): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > max) return false;

  const rows = a.length + 1;
  const cols = b.length + 1;
  let prev = Array.from({ length: cols }, (_, i) => i);
  let curr = new Array<number>(cols);

  for (let i = 1; i < rows; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      rowMin = Math.min(rowMin, curr[j]!);
    }
    if (rowMin > max) return false;
    [prev, curr] = [curr, prev];
  }

  return prev[cols - 1]! <= max;
}

function tokenMatches(token: string, haystack: string, words: string[]): boolean {
  if (words.some((word) => word === token || word.startsWith(token))) {
    return true;
  }

  // Short tokens (e.g. "om", "ram") must match whole words — not substrings like "from".
  if (token.length < 4) return false;

  if (haystack.includes(token)) return true;

  const maxEdits = token.length >= 7 ? 2 : 1;
  if (words.some((word) => levenshteinWithin(token, word, maxEdits))) {
    return true;
  }

  return false;
}

/** True when query matches haystack — full phrase, all words, or near-spelling. */
export function matchesSearchQuery(
  haystack: string,
  query: string
): boolean {
  const q = normalizeSearchText(query);
  if (!q) return false;

  const h = normalizeSearchText(haystack);
  if (h.includes(q)) return true;

  const tokens = searchTokens(query);
  if (tokens.length === 0) return false;

  const words = h.split(/\s+/).filter(Boolean);
  return tokens.every((token) => tokenMatches(token, h, words));
}

/** 0 = no name match; 1 = all query words in field; 2 = phrase in field; 3 = field starts with query; 4 = exact field */
function nameFieldTier(field: string, query: string): number {
  if (!field) return 0;

  const q = normalizeSearchText(query);
  if (!q) return 0;

  if (field === q) return 4;
  if (field.startsWith(q)) return 3;
  if (field.includes(q)) return 2;

  const tokens = searchTokens(query);
  if (tokens.length === 0) return 0;

  const words = field.split(/\s+/).filter(Boolean);
  if (tokens.every((token) => tokenMatches(token, field, words))) return 1;

  return 0;
}

export type SearchScorableFields = {
  title: string;
  alternate_title?: string | null;
  artist_version?: string | null;
  roman_lyrics?: string | null;
  devanagari_lyrics?: string | null;
  translation?: string | null;
  meaning?: string | null;
  slug?: string;
  categories?: string[];
};

/** Higher score = better match. Returns 0 when the item should not appear. */
export function scoreSearchMatch(
  fields: SearchScorableFields,
  query: string
): number {
  const haystack = [
    fields.title,
    fields.alternate_title,
    fields.artist_version,
    fields.roman_lyrics,
    fields.devanagari_lyrics,
    fields.translation,
    fields.meaning,
    fields.slug?.replace(/-/g, " "),
    ...(fields.categories ?? []),
  ]
    .filter(Boolean)
    .join("\n");

  if (!matchesSearchQuery(haystack, query)) return 0;

  const q = normalizeSearchText(query);
  const title = normalizeSearchText(fields.title);
  const alt = normalizeSearchText(fields.alternate_title ?? "");
  const artist = normalizeSearchText(fields.artist_version ?? "");
  const slug = normalizeSearchText((fields.slug ?? "").replace(/-/g, " "));
  const meaning = normalizeSearchText(fields.meaning ?? "");
  const lyrics = normalizeSearchText(
    [fields.roman_lyrics, fields.devanagari_lyrics, fields.translation]
      .filter(Boolean)
      .join("\n")
  );

  const nameTier = Math.max(
    nameFieldTier(title, query),
    nameFieldTier(alt, query),
    nameFieldTier(slug, query)
  );

  // Lyrics / meaning only — always below anything with a title or name match.
  if (nameTier === 0) {
    let detail = 0;
    const tokens = searchTokens(query);
    const lyricWords = lyrics.split(/\s+/).filter(Boolean);
    const lyricTokenHits = tokens.filter((t) =>
      tokenMatches(t, lyrics, lyricWords)
    ).length;
    detail += lyricTokenHits * 15;
    const mantraHits = Math.max(
      0,
      lyrics.split("om namah").length - 1,
      lyrics.split("om nama").length - 1
    );
    detail += Math.min(40, mantraHits * 8);
    if (lyrics.includes(q)) detail += 50;
    else if (matchesSearchQuery(lyrics, query)) detail += 20;
    if (meaning.includes(q)) detail += 10;
    if (artist.includes(q)) detail += 5;
    return detail;
  }

  let detail = nameTier * 1000;

  if (nameFieldTier(title, query) > 0) detail += 200;
  if (nameFieldTier(alt, query) > 0) detail += 120;
  if (nameFieldTier(slug, query) > 0) detail += 80;
  if (artist.includes(q)) detail += 40;
  if (meaning.includes(q)) detail += 20;
  if (lyrics.includes(q)) detail += 10;

  const tokens = searchTokens(query);
  if (tokens.length > 0) {
    const titleWords = title.split(/\s+/).filter(Boolean);
    detail +=
      tokens.filter((t) => tokenMatches(t, title, titleWords)).length * 30;
  }

  return detail;
}
