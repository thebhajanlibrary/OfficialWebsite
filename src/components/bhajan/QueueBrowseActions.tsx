"use client";

import { ListEnd, ListPlus, Play } from "lucide-react";
import { useState } from "react";
import { useQueuePlayback } from "@/components/bhajan/QueuePlayback";
import type { QueueTrack } from "@/lib/play-queue";

type Props = {
  pageTrack: QueueTrack;
  /** Replace current playback with this track (and its queue if provided). */
  onPlayNow: () => void;
  nowPlayingTitle?: string | null;
};

/** Play / Play Next / Play Later when another track is already in session */
export function QueueBrowseActions({
  pageTrack,
  onPlayNow,
  nowPlayingTitle,
}: Props) {
  const { playNext, playLater } = useQueuePlayback();
  const [flash, setFlash] = useState<string | null>(null);

  const showFlash = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 1800);
  };

  return (
    <div className="space-y-2 rounded-xl border border-border bg-surface px-3 py-3 sm:px-4">
      <p className="text-center text-xs text-muted">
        {nowPlayingTitle ? (
          <>
            Now playing{" "}
            <span className="text-primary">{nowPlayingTitle}</span>
            {" — "}open without interrupting
          </>
        ) : (
          "Something is already playing"
        )}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onPlayNow}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
          Play
        </button>
        <button
          type="button"
          onClick={() => {
            playNext(pageTrack);
            showFlash("Playing next");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-primary transition hover:bg-surface-muted"
        >
          <ListPlus className="h-3.5 w-3.5" aria-hidden />
          Play Next
        </button>
        <button
          type="button"
          onClick={() => {
            playLater(pageTrack);
            showFlash("Added to end of queue");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-primary transition hover:bg-surface-muted"
        >
          <ListEnd className="h-3.5 w-3.5" aria-hidden />
          Play Later
        </button>
      </div>
      {flash ? (
        <p className="text-center text-xs text-accent" role="status">
          {flash}
        </p>
      ) : null}
    </div>
  );
}
