"use client";

import { useMemo, useRef } from "react";
import { useQueuePlaybackOptional } from "@/components/bhajan/QueuePlayback";
import { useMediaSession } from "@/components/bhajan/useMediaSession";

/**
 * Keeps OS / lock-screen media controls in sync with the persistent
 * queue engine (works while browsing other pages or with the tab minimized).
 */
export function MediaSessionBridge() {
  const queue = useQueuePlaybackOptional();
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const track = queue?.session?.tracks[queue.session.index];
  const index = queue?.session?.index ?? 0;
  const len = queue?.session?.tracks.length ?? 0;

  const handlers = useMemo(
    () => ({
      play: () => {
        const q = queueRef.current;
        if (q && !q.playing) q.toggle();
      },
      pause: () => {
        const q = queueRef.current;
        if (q?.playing) q.toggle();
      },
      stop: () => queueRef.current?.clear(),
      previous: () => queueRef.current?.prev(),
      next: () => queueRef.current?.next(),
      seek: (time: number) => queueRef.current?.seek(time),
    }),
    []
  );

  const queueOwns =
    Boolean(queue?.playing && track) &&
    (track?.kind === "audio" || Boolean(track?.audioSrc));

  useMediaSession({
    enabled: queueOwns,
    title: track?.title ?? "Bhajan Library",
    artist: track?.artist,
    album: "Bhajan Library",
    cover: track?.cover || track?.miniCover,
    playing: Boolean(queue?.playing && track),
    currentTime: queue?.currentTime ?? 0,
    duration: queue?.duration ?? 0,
    canPrevious: index > 0,
    canNext: index < len - 1,
    handlers: track ? handlers : undefined,
  });

  return null;
}
