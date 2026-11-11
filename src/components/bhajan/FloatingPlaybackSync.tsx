"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useQueuePlaybackOptional } from "@/components/bhajan/QueuePlayback";
import { useYouTubePlaybackOptional } from "@/components/bhajan/YouTubePlayback";
import {
  claimSitePlayback,
  getFloatingPlaybackState,
  shouldDismissFloatingPlayers,
} from "@/lib/floating-playback";

/**
 * When the corner mini player is showing one track and the user opens another
 * song or video, close pinned PiP / floating video PiP so only one player shows.
 */
export function FloatingPlaybackSync() {
  const pathname = usePathname();
  const queue = useQueuePlaybackOptional();
  const yt = useYouTubePlaybackOptional();
  const prevRef = useRef({
    wasFloating: false,
    sessionSlug: null as string | null,
  });

  useEffect(() => {
    const floating = getFloatingPlaybackState(
      pathname,
      queue?.session ?? null,
      yt?.session ?? null,
      { playing: queue?.playing, currentTime: queue?.currentTime }
    );
    const sessionSlug =
      queue?.session?.tracks[queue.session.index]?.slug ??
      yt?.session?.slug ??
      null;
    const prev = prevRef.current;

    if (
      shouldDismissFloatingPlayers({
        wasFloating: prev.wasFloating,
        previousSlug: prev.sessionSlug,
        nextSlug: sessionSlug,
        pathname,
      })
    ) {
      claimSitePlayback();
    }

    prevRef.current = {
      wasFloating: floating.active,
      sessionSlug,
    };
  }, [
    pathname,
    queue?.session,
    queue?.session?.index,
    queue?.playing,
    queue?.currentTime,
    yt?.session,
  ]);

  return null;
}
