"use client";

import { useEffect, useMemo, useState } from "react";

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
  /** Distraction-free layout, controlled by the song page */
  reading?: boolean;
  onReadingChange?: (next: boolean) => void;
};

type LyricSize = "sm" | "md" | "lg";

const SIZE_KEY = "bhajan-lyric-size";

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
  reading = false,
  onReadingChange,
}: Props) {
  const [showTranslation, setShowTranslation] = useState(showTranslationDefault);
  const [showHindi, setShowHindi] = useState(false);
  const [size, setSize] = useState<LyricSize>("md");

  useEffect(() => {
    if (dark || large) return;
    try {
      const stored = localStorage.getItem(SIZE_KEY);
      if (stored === "sm" || stored === "md" || stored === "lg") {
        setSize(stored);
      }
    } catch {
      /* private browsing */
    }
  }, [dark, large]);

  function chooseSize(next: LyricSize) {
    setSize(next);
    try {
      localStorage.setItem(SIZE_KEY, next);
    } catch {
      /* private browsing */
    }
  }
  const lines = useMemo(
    () => pairLines(roman, translation, devanagari),
    [roman, translation, devanagari]
  );

  const hasTranslation = Boolean(translation?.trim());
  const hasHindi = Boolean(devanagari?.trim());

  const lightSize = {
    sm: {
      roman: "text-base leading-relaxed text-foreground",
      trans: "mt-1.5 text-sm leading-relaxed text-muted",
      hindi: "mt-1.5 text-base leading-relaxed text-accent",
    },
    md: {
      roman: "text-lg leading-relaxed text-foreground sm:text-xl",
      trans: "mt-1.5 text-sm leading-relaxed text-muted sm:text-base",
      hindi: "mt-1.5 text-lg leading-relaxed text-accent sm:text-xl",
    },
    lg: {
      roman: "text-xl leading-relaxed text-foreground sm:text-2xl",
      trans: "mt-1.5 text-base leading-relaxed text-muted sm:text-lg",
      hindi: "mt-1.5 text-xl leading-relaxed text-accent sm:text-2xl",
    },
  }[reading && size === "sm" ? "md" : reading && size === "md" ? "lg" : size];

  const romanClass = dark
    ? large
      ? "text-2xl leading-snug sm:text-3xl"
      : "text-xl leading-snug"
    : large
      ? "text-xl leading-relaxed text-foreground sm:text-2xl"
      : lightSize.roman;

  const transClass = dark
    ? "mt-1 text-base leading-snug text-[#aeb8c9] sm:text-lg"
    : large
      ? "mt-1 text-sm leading-relaxed text-muted sm:text-base"
      : lightSize.trans;

  const hindiClass = dark
    ? "mt-1 text-xl leading-snug text-[#e8c9a8] sm:text-2xl"
    : large
      ? "mt-1 text-lg leading-relaxed text-accent sm:text-xl"
      : lightSize.hindi;

  const panelClass = dark
    ? "space-y-5"
    : "lyric-panel space-y-6 rounded-2xl p-5 sm:p-8";

  const chipIdle = dark
    ? "rounded-full px-3 py-1.5 text-sm text-[#d7deea] transition hover:bg-white/10"
    : "rounded-full px-3 py-1.5 text-sm text-foreground/80 transition hover:bg-accent-soft";

  const chipOn = dark
    ? "rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white"
    : "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white";

  const toolBtn = dark
    ? "rounded-full border border-white/15 px-3 py-1.5 text-sm transition hover:bg-white/10"
    : "rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition hover:border-accent hover:bg-accent-soft";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className={
            dark
              ? "inline-flex flex-wrap items-center gap-1 rounded-full border border-white/15 p-1"
              : "inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-surface p-1"
          }
          role="group"
          aria-label="Lyric scripts"
        >
          <span className={chipOn}>Roman</span>
          {hasTranslation && (
            <button
              type="button"
              onClick={() => setShowTranslation((v) => !v)}
              className={showTranslation ? chipOn : chipIdle}
              aria-pressed={showTranslation}
            >
              English
            </button>
          )}
          {hasHindi && (
            <button
              type="button"
              onClick={() => setShowHindi((v) => !v)}
              className={showHindi ? chipOn : chipIdle}
              aria-pressed={showHindi}
            >
              Hindi
            </button>
          )}
        </div>

        {!dark && !large && (
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center rounded-full border border-border bg-surface p-1"
              role="group"
              aria-label="Lyric text size"
            >
              <button
                type="button"
                className="rounded-full px-2.5 py-1 text-xs text-foreground disabled:opacity-35"
                aria-label="Smaller lyrics"
                disabled={size === "sm"}
                onClick={() =>
                  chooseSize(size === "lg" ? "md" : "sm")
                }
              >
                A−
              </button>
              <button
                type="button"
                className="rounded-full px-2.5 py-1 text-base text-foreground disabled:opacity-35"
                aria-label="Larger lyrics"
                disabled={size === "lg"}
                onClick={() =>
                  chooseSize(size === "sm" ? "md" : "lg")
                }
              >
                A+
              </button>
            </div>
            {onReadingChange && (
              <button
                type="button"
                className={
                  reading
                    ? "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white"
                    : toolBtn
                }
                aria-pressed={reading}
                onClick={() => onReadingChange(!reading)}
              >
                {reading ? "Exit reading" : "Reading"}
              </button>
            )}
          </div>
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
              : "text-xs font-semibold tracking-[0.18em] text-accent uppercase";
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
