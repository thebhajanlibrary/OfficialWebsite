/**
 * Roman singing lines → Devanagari, for songs that have no Hindi sheet.
 * A stored Devanagari line always wins over this.
 */

const WHOLE: Record<string, string> = {
  shri: "श्री",
  sri: "श्री",
  shree: "श्री",
  krishna: "कृष्ण",
  krishan: "कृष्ण",
  hanuman: "हनुमान",
  bhagwan: "भगवान",
  bhagavan: "भगवान",
  bhagwaan: "भगवान",
  sita: "सीता",
  ganesh: "गणेश",
  ganesha: "गणेश",
  shiva: "शिव",
  shiv: "शिव",
  rama: "राम",
  koi: "कोई",
  chala: "चला",
  jai: "जय",
  sagar: "सागर",
  kumar: "कुमार",
  nama: "नाम",
  dhama: "धाम",
  ujagar: "उजागर",
  saba: "सब",
  gaya: "गया",
  aaya: "आया",
  aaye: "आए",
  nahi: "नहीं",
  nahin: "नहीं",
  ramayan: "रामायण",
  ramayana: "रामायण",
};

const KEEP_LATIN = new Set(["ref", "rela", "verse", "chorus", "doha"]);

const CONS: [string, string][] = [
  ["ksh", "क्ष"],
  ["gy", "ज्ञ"],
  ["chh", "छ"],
  ["kh", "ख"],
  ["gh", "घ"],
  ["jh", "झ"],
  ["th", "थ"],
  ["dh", "ध"],
  ["ph", "फ"],
  ["bh", "भ"],
  ["sh", "श"],
  ["ch", "च"],
  ["j", "ज"],
  ["t", "त"],
  ["d", "द"],
  ["p", "प"],
  ["b", "ब"],
  ["n", "न"],
  ["m", "म"],
  ["y", "य"],
  ["r", "र"],
  ["l", "ल"],
  ["v", "व"],
  ["w", "व"],
  ["k", "क"],
  ["g", "ग"],
  ["h", "ह"],
  ["s", "स"],
  ["f", "फ़"],
  ["z", "ज़"],
  ["q", "क़"],
  ["ट", "ट"],
  ["ठ", "ठ"],
  ["ड", "ड"],
  ["ढ", "ढ"],
  ["ण", "ण"],
  ["ड़", "ड़"],
  ["ढ़", "ढ़"],
];

const VOWELS: [string, string, string][] = [
  ["aa", "आ", "ा"],
  ["ai", "ऐ", "ै"],
  ["au", "औ", "ौ"],
  ["ee", "ई", "ी"],
  ["ii", "ई", "ी"],
  ["oo", "ऊ", "ू"],
  ["uu", "ऊ", "ू"],
  ["a", "अ", ""],
  ["e", "ए", "े"],
  ["i", "इ", "ि"],
  ["o", "ओ", "ो"],
  ["u", "उ", "ु"],
];

const VOWEL_START = new Set("aeiou");

function isVowelAt(s: string, i: number): boolean {
  return matchVowel(s, i) !== null;
}

function matchVowel(s: string, i: number): [string, string, string] | null {
  for (const row of VOWELS) {
    if (s.startsWith(row[0], i)) return row;
  }
  return null;
}

function matchCons(s: string, i: number): [string, string] | null {
  for (const row of CONS) {
    if (s.startsWith(row[0], i)) return row;
  }
  return null;
}

function nextIsConsonant(s: string, i: number): boolean {
  return i < s.length && matchCons(s, i) !== null && !isVowelAt(s, i);
}

function normalize(word: string): string {
  let s = word.normalize("NFC").toLowerCase().replace(/['’]/g, "");
  s = s
    .replace(/ṛh/g, "ढ़")
    .replace(/ṛ/g, "ड़")
    .replace(/ā/g, "aa")
    .replace(/ī/g, "ii")
    .replace(/ū/g, "uu")
    .replace(/ś/g, "sh")
    .replace(/ṣ/g, "sh")
    .replace(/ṭh/g, "ठ")
    .replace(/ṭ/g, "ट")
    .replace(/ḍh/g, "ढ")
    .replace(/ḍ/g, "ड")
    .replace(/ṇ/g, "ण")
    .replace(/ṅ/g, "ं")
    .replace(/ñ/g, "ञ")
    .replace(/ṃ|ṁ/g, "ं")
    .replace(/ḥ/g, "h");
  return s;
}

function transliterateBody(s: string): string {
  let out = "";
  let i = 0;
  while (i < s.length) {
    if (s.startsWith("ं", i)) {
      out += "ं";
      i += 1;
      continue;
    }
    if (s.startsWith("ञ", i)) {
      out += "ञ";
      i += 1;
      continue;
    }

    const vowel = matchVowel(s, i);
    const cons = matchCons(s, i);
    if (cons && vowel && vowel[0].length > cons[0].length) {
      out += vowel[1];
      i += vowel[0].length;
      continue;
    }

    if (!cons) {
      if (vowel) {
        out += vowel[1];
        i += vowel[0].length;
        continue;
      }
      out += s[i];
      i += 1;
      continue;
    }

    const key = cons[0];
    const glyph = cons[1];
    const after = i + key.length;
    if (
      (key === "n" || key === "m") &&
      nextIsConsonant(s, after) &&
      !s.startsWith(key, after)
    ) {
      out += "ं";
      i = after;
      continue;
    }

    const following = matchVowel(s, after);
    const longA =
      following?.[0] === "a" &&
      (key === "gy" ||
        (after + 1 === s.length &&
          (key === "y" || /[ाीूेैोौ]$/.test(out))));
    if (longA) {
      out += glyph + "ा";
      i = after + 1;
      continue;
    }
    if (following) {
      out += glyph + following[2];
      i = after + following[0].length;
      continue;
    }
    if (nextIsConsonant(s, after) || s.startsWith("ं", after)) {
      out += glyph + "्";
      i = after;
      continue;
    }
    out += glyph;
    i = after;
  }
  return out;
}

function transliterateWord(raw: string): string {
  const key = raw.toLowerCase().replace(/['’]/g, "");
  if (KEEP_LATIN.has(key)) return raw;
  if (WHOLE[key]) return WHOLE[key];
  const s = normalize(raw);
  if (s.startsWith("ram") && (s.length === 3 || !VOWEL_START.has(s[3] ?? ""))) {
    const rest = s.slice(3);
    return rest ? "राम" + transliterateBody(rest) : "राम";
  }
  return transliterateBody(s);
}

const WORD_RE = /[\p{L}]+(?:['’][\p{L}]+)*/gu;

/** One lyric line. Blank lines and “[Album track]” notes stay without Hindi. */
export function transliterateRomanLine(line: string): string {
  if (!line.trim()) return "";
  if (/^\s*\[/.test(line)) return "";
  const cleaned = line.replace(/['’]/g, "");
  if (/[\u0900-\u097F]/.test(cleaned) && !/[A-Za-z]/.test(cleaned)) return cleaned;
  return cleaned.replace(WORD_RE, (word) => {
    if (/[\u0900-\u097F]/.test(word) && !/[A-Za-z]/.test(word)) return word;
    return transliterateWord(word);
  });
}
