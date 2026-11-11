"use client";

import { useMemo, useState } from "react";

type Props = {
  roman: string;
  translation?: string | null;
  devanagari?: string | null;
  /** Larger type for singing mode */
  large?: boolean;
  /** Dark theme styles for singing mode */
  dark?: boolean;
  /** Start with English translation visible (default true) */
  showTranslationDefault?: boolean;
};

type LyricLine = {
  roman: string;
  translation: string;
  devanagari: string;
};

const HEADING_RE = /^(#{2,3})\s+(.+)$/;

type LyricSection = {
  heading: string | null;
  lines: string[];
};

function splitSections(text: string): LyricSection[] {
  const raw = text.replace(/\r\n/g, "\n").split("\n");
  const sections: LyricSection[] = [];
  let current: LyricSection = { heading: null, lines: [] };

  for (const line of raw) {
    const heading = line.trim().match(HEADING_RE);
    if (heading) {
      if (current.heading !== null || current.lines.some((l) => l.trim())) {
        sections.push(current);
      }
      current = { heading: heading[2].trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  sections.push(current);
  return sections;
}

function isSectionHeadingLine(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (HEADING_RE.test(t)) return true;
  if (/^\(?\s*Refrain[^)]*\)?\s*$/i.test(t)) return true;
  if (/^Verse\s+\d+/i.test(t)) return true;
  return false;
}

/** Drop Refrain / Verse labels from translation — keep the words only. */
function translationContentLines(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => !isSectionHeadingLine(line));
}

function pairLines(
  roman: string,
  translation?: string | null,
  devanagari?: string | null
): LyricLine[] {
  const hasStructuredHeadings = /^(#{2,3})\s+/m.test(roman);
  if (!hasStructuredHeadings) {
    const romanLines = roman.replace(/\r\n/g, "\n").split("\n");
    const transLines = translationContentLines(translation ?? "");
    const devLines = (devanagari ?? "")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .filter((line) => !isSectionHeadingLine(line));
    const len = Math.max(romanLines.length, transLines.length, devLines.length);
    return Array.from({ length: len }, (_, i) => ({
      roman: romanLines[i] ?? "",
      translation: transLines[i] ?? "",
      devanagari: devLines[i] ?? "",
    }));
  }

  const romanSecs = splitSections(roman);
  const transFlat = translationContentLines(translation ?? "");
  const devFlat = (devanagari ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => !isSectionHeadingLine(line));
  const out: LyricLine[] = [];
  let transIdx = 0;
  let devIdx = 0;

  for (const r of romanSecs) {
    if (r.heading) {
      out.push({ roman: `## ${r.heading}`, translation: "", devanagari: "" });
    }
    for (const romanLine of r.lines) {
      out.push({
        roman: romanLine,
        translation: transFlat[transIdx++] ?? "",
        devanagari: devFlat[devIdx++] ?? "",
      });
    }
  }

  return out;
}

export function LyricsView({
  roman,
  translation,
  devanagari,
  large = false,
  dark = false,
  showTranslationDefault = true,
}: Props) {
  const [showTranslation, setShowTranslation] = useState(showTranslationDefault);
  const [showHindi, setShowHindi] = useState(false);
  const lines = useMemo(
    () => pairLines(roman, translation, devanagari),
    [roman, translation, devanagari]
  );

  const hasTranslation = Boolean(translation?.trim());
  const hasHindi = Boolean(devanagari?.trim());

  const romanClass = dark
    ? large
      ? "text-2xl leading-snug sm:text-3xl"
      : "text-xl leading-snug"
    : large
      ? "text-xl leading-snug text-foreground sm:text-2xl"
      : "text-lg leading-snug text-foreground sm:text-xl";

  const transClass = dark
    ? "mt-1 text-base leading-snug text-[#aeb8c9] sm:text-lg"
    : "mt-1 text-sm leading-snug text-muted sm:text-base";

  const hindiClass = dark
    ? "mt-1 text-xl leading-snug text-[#e8c9a8] sm:text-2xl"
    : "mt-1 text-lg leading-snug text-accent sm:text-xl";

  const panelClass = dark
    ? "space-y-5"
    : "lyric-panel space-y-5 rounded-r-xl p-5 sm:p-6";

  const toggleIdle = dark
    ? "rounded-lg border border-white/15 px-3 py-1.5 text-sm transition hover:border-white/35 hover:bg-white/5"
    : "btn-secondary rounded-lg px-3 py-1.5 text-sm";

  const toggleActive = dark
    ? "rounded-lg border border-white/40 bg-white/10 px-3 py-1.5 text-sm"
    : "rounded-lg border border-primary bg-primary px-3 py-1.5 text-sm font-medium text-white";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {hasTranslation && (
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            className={showTranslation ? toggleActive : toggleIdle}
            aria-pressed={showTranslation}
          >
            {showTranslation ? "Hide" : "Show"} translation
          </button>
        )}
        {hasHindi && (
          <button
            type="button"
            onClick={() => setShowHindi((v) => !v)}
            className={showHindi ? toggleActive : toggleIdle}
            aria-pressed={showHindi}
          >
            {showHindi ? "Hide" : "Show"} Hindi
          </button>
        )}
      </div>

      <div className={panelClass}>
        {lines.map((line, i) => {
          const isBlank =
            !line.roman.trim() &&
            !line.translation.trim() &&
            !line.devanagari.trim();

          if (isBlank) {
            return <div key={i} className="h-3" aria-hidden />;
          }

          const sectionMatch = line.roman.trim().match(/^#{2,3}\s+(.+)$/);
          if (sectionMatch) {
            const headingClass = dark
              ? "font-display text-lg font-semibold tracking-wide text-[#e8c9a8] sm:text-xl"
              : "font-display text-lg font-semibold tracking-wide text-primary sm:text-xl";
            return (
              <div
                key={i}
                className={
                  i === 0
                    ? "min-w-0"
                    : dark
                      ? "min-w-0 border-t border-white/15 pt-6"
                      : "min-w-0 border-t border-border/60 pt-6"
                }
              >
                <h3 className={headingClass}>{sectionMatch[1]}</h3>
              </div>
            );
          }

          return (
            <div key={i} className="min-w-0">
              {line.roman.trim() ? (
                <p className={romanClass}>{line.roman}</p>
              ) : null}
              {showTranslation && line.translation.trim() ? (
                <p className={transClass}>{line.translation}</p>
              ) : null}
              {showHindi && line.devanagari.trim() ? (
                <p className={hindiClass} lang="hi">
                  {line.devanagari}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
