"use client";

import { useState, type ReactNode } from "react";
import { LyricsView } from "@/components/bhajan/LyricsView";

type Props = {
  player: ReactNode;
  hasPlayer: boolean;
  hasLyrics: boolean;
  roman: string;
  translation?: string | null;
  devanagari?: string | null;
  meaning?: string | null;
  meaningTitle: string;
  permissionNote?: boolean;
  extra?: ReactNode;
};

export function SongReadingLayout({
  player,
  hasPlayer,
  hasLyrics,
  roman,
  translation,
  devanagari,
  meaning,
  meaningTitle,
  permissionNote = false,
  extra,
}: Props) {
  const [reading, setReading] = useState(false);
  const split = hasPlayer && !reading;

  return (
    <div
      className={
        reading
          ? "mx-auto max-w-3xl space-y-8"
          : split
            ? "space-y-10 lg:grid lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12 lg:space-y-0"
            : "space-y-10"
      }
    >
      {hasPlayer ? (
        <div className={split ? "lg:sticky lg:top-24 lg:self-start" : undefined}>
          {player}
        </div>
      ) : null}

      <div className="min-w-0 space-y-10">
        {hasLyrics && (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-primary">
                Lyrics
              </h2>
            </div>
            <LyricsView
              roman={roman}
              translation={translation}
              devanagari={devanagari}
              reading={reading}
              onReadingChange={setReading}
            />
          </section>
        )}

        {meaning ? (
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-primary">
              {meaningTitle}
            </h2>
            <p className="max-w-2xl leading-relaxed text-muted">{meaning}</p>
            {permissionNote && (
              <p className="max-w-2xl leading-relaxed text-muted">
                These words belong to the writer. They will be added here once
                permission is in place.
              </p>
            )}
          </section>
        ) : null}

        {!reading && extra}
      </div>
    </div>
  );
}
