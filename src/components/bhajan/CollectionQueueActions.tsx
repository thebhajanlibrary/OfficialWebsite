"use client";

import { ListEnd, ListPlus, Play, Shuffle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueuePlayback } from "@/components/bhajan/QueuePlayback";
import type { QueueTrack } from "@/lib/play-queue";

type Props = {
  queueKey: string;
  tracks: QueueTrack[];
  /** Optional first-track href when Play all falls back to navigation */
  playAllHref?: string | null;
};

/** Play all / Shuffle / Play Next / Play Later for album, folder, playlist */
export function CollectionQueueActions({
  queueKey,
  tracks,
  playAllHref,
}: Props) {
  const router = useRouter();
  const {
    session,
    playAll,
    playCollectionNext,
    playCollectionLater,
  } = useQueuePlayback();
  const [flash, setFlash] = useState<string | null>(null);

  if (tracks.length === 0) return null;

  const showFlash = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 1800);
  };

  const onPlayAll = (shuffle = false) => {
    playAll({ queueKey, tracks, shuffle });
    // playAll already replaceUrl-navigates to the (possibly shuffled) first track.
    // Only fall back for ordered play — never force the original first track on shuffle.
    if (playAllHref && !session && !shuffle) {
      router.push(playAllHref);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onPlayAll(false)}
          className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold"
        >
          <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
          Play all
        </button>
        <button
          type="button"
          onClick={() => onPlayAll(true)}
          className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold"
        >
          <Shuffle className="h-3.5 w-3.5" aria-hidden />
          Shuffle
        </button>
        <button
          type="button"
          onClick={() => {
            playCollectionNext(tracks);
            showFlash(
              session
                ? `Queued ${tracks.length} tracks next`
                : "Playing collection"
            );
          }}
          className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm"
        >
          <ListPlus className="h-3.5 w-3.5" aria-hidden />
          Play Next
        </button>
        <button
          type="button"
          onClick={() => {
            playCollectionLater(tracks);
            showFlash(
              session
                ? `Added ${tracks.length} tracks to queue`
                : "Playing collection"
            );
          }}
          className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm"
        >
          <ListEnd className="h-3.5 w-3.5" aria-hidden />
          Play Later
        </button>
      </div>
      {flash ? (
        <p className="text-sm text-accent" role="status">
          {flash}
        </p>
      ) : null}
    </div>
  );
}
