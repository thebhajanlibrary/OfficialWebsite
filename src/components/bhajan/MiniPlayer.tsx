"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ListMusic,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { useState } from "react";
import { useQueuePlaybackOptional } from "@/components/bhajan/QueuePlayback";
import { useYouTubePlaybackOptional } from "@/components/bhajan/YouTubePlayback";
import { PinnedScreenPlayer } from "@/components/bhajan/PinnedScreenPlayer";

/** Floating now-playing chip + Up Next — stays while browsing */
export function MiniPlayer() {
  const queue = useQueuePlaybackOptional();
  const yt = useYouTubePlaybackOptional();
  const pathname = usePathname();
  const [upNextOpen, setUpNextOpen] = useState(false);

  // YouTube (in-page or corner mini) takes over — hide the audio/video chip
  if (yt?.session) return null;

  if (!queue?.session) return null;

  const track = queue.session.tracks[queue.session.index];
  if (!track) return null;

  // Audio mini-player only when audio is the active kind (YouTube has its own mini)
  const isAudio = track.kind === "audio" && Boolean(track.audioSrc);
  if (!isAudio && track.kind === "youtube") return null;

  const onTrackPage = pathname === `/bhajans/${track.slug}`;
  if (onTrackPage && isAudio) return null;

  const engaged =
    queue.playing ||
    queue.currentTime > 0.25 ||
    queue.session.tracks.length > 1 ||
    track.kind === "video";
  if (!engaged) return null;

  // Video on its own page uses the page player; still show chip when browsing away
  if (track.kind === "video" && onTrackPage) return null;

  const canPrev = queue.session.index > 0;
  const canNext = queue.session.index < queue.session.tracks.length - 1;
  const progress =
    isAudio && queue.duration > 0
      ? Math.min(100, (queue.currentTime / queue.duration) * 100)
      : 0;

  const upNext = queue.session.tracks.slice(queue.session.index + 1);

  return (
    <div className="pointer-events-none fixed right-3 bottom-3 z-50 w-[min(100%-1.5rem,22rem)] sm:right-5 sm:bottom-5">
      <div className="pointer-events-auto overflow-hidden rounded-2xl border border-border/80 bg-surface/95 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md animate-fade">
        {upNextOpen && queue.session.tracks.length > 1 && (
          <div className="max-h-56 overflow-y-auto border-b border-border/80 px-3 py-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                Up Next
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => queue.setShuffle(!queue.shuffle)}
                  className={`rounded-md p-1.5 transition hover:bg-surface-muted ${
                    queue.shuffle ? "text-accent" : "text-muted"
                  }`}
                  aria-label={queue.shuffle ? "Shuffle on" : "Shuffle off"}
                  title="Shuffle upcoming"
                >
                  <Shuffle className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={queue.clear}
                  className="rounded-md px-2 py-1 text-[11px] text-muted transition hover:bg-surface-muted hover:text-primary"
                >
                  Clear
                </button>
              </div>
            </div>
            {upNext.length === 0 ? (
              <p className="pb-1 text-xs text-muted">Nothing up next</p>
            ) : (
              <ul className="space-y-1">
                {upNext.map((t, i) => {
                  const absoluteIndex = queue.session!.index + 1 + i;
                  return (
                    <li
                      key={`${t.slug}-${absoluteIndex}`}
                      className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-surface-muted/80"
                    >
                      <Link
                        href={t.href}
                        className="min-w-0 flex-1 truncate text-xs font-medium text-primary"
                      >
                        {t.title}
                        <span className="ml-1 font-normal text-muted">
                          · {t.kind}
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => queue.removeAt(absoluteIndex)}
                        className="shrink-0 rounded p-1 text-muted hover:text-primary"
                        aria-label={`Remove ${t.title}`}
                      >
                        <X className="h-3 w-3" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <div className="h-0.5 bg-border" aria-hidden>
          <div
            className="h-full bg-accent transition-[width] duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-2 p-2.5 sm:gap-3 sm:p-3">
          <Link
            href={track.href}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl outline-none transition hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Open now playing: ${track.title}`}
          >
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-primary/10 sm:h-14 sm:w-14">
              {track.miniCover || track.cover ? (
                <Image
                  src={(track.miniCover || track.cover)!}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-black" />
              )}
            </span>
            <span className="min-w-0 text-left">
              <span className="block truncate text-sm font-semibold text-primary">
                {track.title}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted">
                {track.artist || "Now playing"}
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-0.5">
            {queue.session.tracks.length > 1 && (
              <button
                type="button"
                onClick={() => setUpNextOpen((o) => !o)}
                className={`rounded-lg p-2 transition hover:bg-surface-muted ${
                  upNextOpen ? "text-accent" : "text-primary"
                }`}
                aria-label="Up Next"
                aria-expanded={upNextOpen}
              >
                <ListMusic className="h-4 w-4" aria-hidden />
              </button>
            )}
            {isAudio && <PinnedScreenPlayer compact />}
            {queue.session.tracks.length > 1 && (
              <button
                type="button"
                onClick={queue.prev}
                disabled={!canPrev}
                className="rounded-lg p-2 text-primary transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous track"
              >
                <SkipBack className="h-4 w-4 fill-current" aria-hidden />
              </button>
            )}
            <button
              type="button"
              onClick={queue.toggle}
              className="rounded-full bg-primary p-2.5 text-white transition hover:opacity-90"
              aria-label={queue.playing ? "Pause" : "Play"}
            >
              {queue.playing ? (
                <Pause className="h-4 w-4 fill-current" aria-hidden />
              ) : (
                <Play className="h-4 w-4 fill-current pl-0.5" aria-hidden />
              )}
            </button>
            {queue.session.tracks.length > 1 && (
              <button
                type="button"
                onClick={queue.next}
                disabled={!canNext}
                className="rounded-lg p-2 text-primary transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next track"
              >
                <SkipForward className="h-4 w-4 fill-current" aria-hidden />
              </button>
            )}
            <button
              type="button"
              onClick={queue.clear}
              className="rounded-lg p-2 text-muted transition hover:bg-surface-muted hover:text-primary"
              aria-label="Close player"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
