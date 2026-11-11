"use client";

import Image from "next/image";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CastButtonForRef,
} from "@/components/bhajan/CastButton";
import {
  DOUBLE_TAP_SEEK_SECONDS,
  DoubleTapSeekSurface,
  seekByOffset,
} from "@/components/bhajan/DoubleTapSeekSurface";
import { useMediaSession } from "@/components/bhajan/useMediaSession";
import {
  keepMediaPlayingWhenLocked,
  prepareUnlockableMedia,
} from "@/lib/ios-playback";
import { applyCastArtwork } from "@/lib/media-artwork";

type Props = {
  src: string;
  title: string;
  cover: string;
  artist?: string | null;
  coverAspect?: "wide" | "square";
  /** Start playing as soon as media can (e.g. continuous queue) */
  autoPlay?: boolean;
  /** Fired when the track finishes — used to advance a play queue */
  onEnded?: () => void;
  /** Skip to previous track in a play queue */
  onPrev?: () => void;
  /** Skip to next track in a play queue */
  onNext?: () => void;
};

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

export function AudioPlayer({
  src,
  title,
  cover,
  artist,
  coverAspect = "wide",
  autoPlay = false,
  onEnded,
  onPrev,
  onNext,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useMediaSession({
    title,
    artist,
    cover,
    playing,
    currentTime: current,
    duration,
    canPrevious: Boolean(onPrev),
    canNext: Boolean(onNext),
    handlers: {
      play: () => {
        const audio = audioRef.current;
        if (audio?.paused) void audio.play().catch(() => undefined);
      },
      pause: () => audioRef.current?.pause(),
      previous: onPrev,
      next: onNext,
      seek: (time) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        setCurrent(time);
      },
      seekOffset: (offset) => {
        const audio = audioRef.current;
        if (!audio) return;
        const next = seekByOffset(
          audio.currentTime,
          audio.duration || duration,
          offset
        );
        audio.currentTime = next;
        setCurrent(next);
      },
    },
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    prepareUnlockableMedia(audio);
    applyCastArtwork(audio, { poster: cover, title, artist });
  }, [src, cover, title, artist]);

  useEffect(() => {
    return keepMediaPlayingWhenLocked(
      () => audioRef.current,
      () => Boolean(audioRef.current && !audioRef.current.paused)
    );
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => {
      setDuration(audio.duration || 0);
      setLoadError(false);
    };
    const handleEnded = () => {
      setPlaying(false);
      onEndedRef.current?.();
    };
    const onError = () => setLoadError(true);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", onError);
    };
  }, [src]);

  useEffect(() => {
    if (!autoPlay) return;
    const audio = audioRef.current;
    if (!audio || loadError) return;
    void audio.play().catch(() => {
      // browser may block autoplay until a gesture
    });
  }, [src, autoPlay, loadError]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || loadError) return;
    if (audio.paused) {
      void audio.play().catch(() => {
        // autoplay may be blocked
      });
    } else {
      setPlaying(false);
      audio.pause();
    }
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrent(value);
  }

  function seekRelative(offset: number) {
    seek(seekByOffset(current, duration, offset));
  }

  return (
    <div className="media-player media-player--audio mx-auto w-full overflow-hidden rounded-xl border border-border bg-black">
      <DoubleTapSeekSurface
        onSeekBack={() => seekRelative(-DOUBLE_TAP_SEEK_SECONDS)}
        onSeekForward={() => seekRelative(DOUBLE_TAP_SEEK_SECONDS)}
        onSingleTap={togglePlay}
        disabled={loadError}
        className="group cursor-pointer text-left"
        ariaLabel={
          playing ? `Pause ${title}` : `Play ${title}. Double-tap sides to skip 30 seconds.`
        }
      >
        <div
          className={
            coverAspect === "square"
              ? "media-player__cover-frame media-player__cover-frame--square"
              : "media-player__cover-frame"
          }
        >
          <Image
            src={cover}
            alt=""
            fill
            priority
            sizes="(max-width: 576px) 100vw, 576px"
            className="media-player__cover-image"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-transparent transition group-hover:bg-black/15 group-focus-visible:bg-black/15">
            <span className="flex h-12 w-12 scale-95 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-lg backdrop-blur-sm transition group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 sm:h-14 sm:w-14">
              {playing ? (
                <Pause className="h-5 w-5 fill-current sm:h-6 sm:w-6" aria-hidden />
              ) : (
                <Play className="h-5 w-5 fill-current pl-0.5 sm:h-6 sm:w-6" aria-hidden />
              )}
            </span>
          </div>
        </div>
      </DoubleTapSeekSurface>

      <div className="space-y-1.5 border-t border-white/10 bg-black px-3 py-2 sm:px-4">
        {loadError ? (
          <p className="text-sm text-white/75">
            Audio file missing — add{" "}
            <code className="text-white/90">{src}</code> to play.
          </p>
        ) : (
          <>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              onChange={(e) => seek(Number(e.target.value))}
              className="media-player__seek w-full"
              aria-label="Seek"
            />
            <div className="flex items-center justify-between gap-2 text-xs text-white/70">
              {(onPrev || onNext) && (
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={!onPrev}
                  className="rounded-md p-1.5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous track"
                >
                  <SkipBack className="h-4 w-4 fill-current" aria-hidden />
                </button>
              )}
              <span className="tabular-nums">{formatTime(current)}</span>
              <span className="min-w-0 flex-1" />
              <CastButtonForRef mediaRef={audioRef} />
              <span className="tabular-nums">{formatTime(duration)}</span>
              {(onPrev || onNext) && (
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!onNext}
                  className="rounded-md p-1.5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next track"
                >
                  <SkipForward className="h-4 w-4 fill-current" aria-hidden />
                </button>
              )}
            </div>
          </>
        )}
        <audio
          ref={audioRef}
          src={src}
          preload="auto"
          playsInline
          controlsList="nodownload"
          className="lock-screen-audio"
          onContextMenu={(e) => e.preventDefault()}
        >
          Your browser does not support this audio.
        </audio>
      </div>
    </div>
  );
}
