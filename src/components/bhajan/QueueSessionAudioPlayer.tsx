"use client";

import Image from "next/image";
import { ListEnd, ListPlus, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CastButton } from "@/components/bhajan/CastButton";
import {
  DOUBLE_TAP_SEEK_SECONDS,
  DoubleTapSeekSurface,
  seekByOffset,
} from "@/components/bhajan/DoubleTapSeekSurface";
import { PinnedScreenPlayer } from "@/components/bhajan/PinnedScreenPlayer";
import { useQueuePlaybackOptional } from "@/components/bhajan/QueuePlayback";
import type { QueueTrack } from "@/lib/play-queue";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  queueKey: string;
  tracks: QueueTrack[];
  slug: string;
  autoPlay?: boolean;
  /** Cover for this page’s track */
  cover?: string | null;
  coverAspect?: "wide" | "square";
  title: string;
  /** Track to Play Next / Play Later (this page’s song) */
  pageTrack: QueueTrack;
};

/** Cover + scrubber bound to the persistent crossfade engine */
export function QueueSessionAudioPlayer({
  queueKey,
  tracks,
  slug,
  autoPlay = false,
  cover,
  coverAspect = "wide",
  title,
  pageTrack,
}: Props) {
  const queue = useQueuePlaybackOptional();
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!queue) return;
    queue.attach({ queueKey, tracks, slug, autoPlay });
  }, [queue, queueKey, slug, autoPlay, tracks]);

  const session = queue?.session ?? null;
  const playing = queue?.playing ?? false;
  const currentTime = queue?.currentTime ?? 0;
  const duration = queue?.duration ?? 0;
  const loadError = queue?.loadError ?? false;

  const sessionTrack = session?.tracks[session.index];
  const isCurrent = sessionTrack?.slug === slug;
  const browsingOther = Boolean(session && !isCurrent);

  const displayCover = browsingOther
    ? cover || pageTrack.cover || null
    : sessionTrack?.cover || cover || null;
  const displayCoverAspect = browsingOther
    ? coverAspect ?? pageTrack.coverAspect ?? "wide"
    : sessionTrack?.coverAspect ?? coverAspect ?? "wide";
  const displayTitle = browsingOther
    ? title
    : sessionTrack?.title || title;

  const canPrev = isCurrent && (session?.index ?? 0) > 0;
  const canNext =
    isCurrent &&
    session != null &&
    session.index < session.tracks.length - 1;

  const getMedia = useCallback(
    () => queue?.getActiveMedia() ?? null,
    [queue]
  );

  const showFlash = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 1800);
  };

  if (!queue) return null;

  const { attach, toggle, seek, prev, next, playNext, playLater } = queue;

  const onPlayThis = () => {
    attach({ queueKey, tracks, slug, autoPlay: true });
  };

  const onPlayNext = () => {
    playNext(pageTrack);
    showFlash("Playing next");
  };

  const onPlayLater = () => {
    playLater(pageTrack);
    showFlash("Added to end of queue");
  };

  return (
    <div className="media-player media-player--audio mx-auto w-full overflow-hidden rounded-xl border border-border bg-black">
      <DoubleTapSeekSurface
        onSeekBack={() =>
          seek(seekByOffset(currentTime, duration, -DOUBLE_TAP_SEEK_SECONDS))
        }
        onSeekForward={() =>
          seek(seekByOffset(currentTime, duration, DOUBLE_TAP_SEEK_SECONDS))
        }
        onSingleTap={browsingOther ? onPlayThis : toggle}
        disabled={browsingOther ? false : loadError}
        className="group cursor-pointer text-left"
        ariaLabel={
          browsingOther
            ? `Play ${displayTitle}`
            : playing
              ? `Pause ${displayTitle}`
              : `Play ${displayTitle}. Double-tap sides to skip 30 seconds.`
        }
      >
        <div
          className={
            displayCoverAspect === "square"
              ? "media-player__cover-frame media-player__cover-frame--square"
              : "media-player__cover-frame"
          }
        >
          {displayCover ? (
            <Image
              src={displayCover}
              alt=""
              fill
              priority
              sizes="(max-width: 576px) 100vw, 576px"
              className="media-player__cover-image"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
          )}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-transparent transition group-hover:bg-black/15 group-focus-visible:bg-black/15">
            <span className="flex h-12 w-12 scale-95 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-lg backdrop-blur-sm transition group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 sm:h-14 sm:w-14">
              {!browsingOther && playing ? (
                <Pause className="h-5 w-5 fill-current sm:h-6 sm:w-6" aria-hidden />
              ) : (
                <Play className="h-5 w-5 fill-current pl-0.5 sm:h-6 sm:w-6" aria-hidden />
              )}
            </span>
          </div>
        </div>
      </DoubleTapSeekSurface>

      {browsingOther ? (
        <div className="space-y-2 border-t border-white/10 bg-black px-3 py-3 sm:px-4">
          <p className="text-center text-xs text-white/55">
            Now playing{" "}
            <span className="text-white/80">{sessionTrack?.title}</span>
            {" — "}open without interrupting
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={onPlayThis}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
              Play
            </button>
            <button
              type="button"
              onClick={onPlayNext}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-2 text-sm text-white transition hover:bg-white/10"
            >
              <ListPlus className="h-3.5 w-3.5" aria-hidden />
              Play Next
            </button>
            <button
              type="button"
              onClick={onPlayLater}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-2 text-sm text-white transition hover:bg-white/10"
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
      ) : (
        <div className="space-y-1.5 border-t border-white/10 bg-black px-3 py-2 sm:px-4">
          {loadError ? (
            <p className="text-sm text-white/75">
              Audio file missing
              {sessionTrack?.audioSrc ? (
                <>
                  {" "}
                  — add{" "}
                  <code className="text-white/90">{sessionTrack.audioSrc}</code>{" "}
                  to play.
                </>
              ) : (
                "."
              )}
            </p>
          ) : (
            <>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="media-player__seek w-full"
                aria-label="Seek"
              />
              <div className="flex items-center justify-between gap-2 text-xs text-white/70">
                <button
                  type="button"
                  onClick={prev}
                  disabled={!canPrev}
                  className="rounded-md p-1.5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous track"
                >
                  <SkipBack className="h-4 w-4 fill-current" aria-hidden />
                </button>
                <span className="tabular-nums">{formatTime(currentTime)}</span>
                <span className="min-w-0 flex-1" />
                <PinnedScreenPlayer />
                <CastButton getMedia={getMedia} />
                <span className="tabular-nums">{formatTime(duration)}</span>
                <button
                  type="button"
                  onClick={next}
                  disabled={!canNext}
                  className="rounded-md p-1.5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next track"
                >
                  <SkipForward className="h-4 w-4 fill-current" aria-hidden />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
