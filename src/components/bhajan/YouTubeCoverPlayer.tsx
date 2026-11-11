"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useEffect } from "react";
import {
  useYouTubePlayback,
  type YouTubeSession,
} from "@/components/bhajan/YouTubePlayback";
import { armYoutubeBackground } from "@/lib/youtube-background";

type Props = {
  embedUrl: string;
  title: string;
  /** When omitted, playback starts in the persistent host immediately */
  cover?: string | null;
  artist?: string | null;
  slug: string;
  href?: string;
  autoPlay?: boolean;
};

export function YouTubeCoverPlayer({
  embedUrl,
  title,
  cover,
  artist,
  slug,
  href,
  autoPlay = false,
}: Props) {
  const yt = useYouTubePlayback();
  const active = yt.session?.slug === slug;

  const session: YouTubeSession = {
    slug,
    title,
    artist: artist ?? null,
    href: href ?? `/bhajans/${slug}`,
    embedUrl,
  };

  const play = () => {
    armYoutubeBackground();
    yt.start(session);
  };

  useEffect(() => {
    // Swap embed if this slug is already active (e.g. URL changed after HMR / edit)
    if (active && yt.session?.embedUrl !== embedUrl) {
      armYoutubeBackground();
      yt.start(session);
      return;
    }
    if ((autoPlay || !cover) && !active) {
      armYoutubeBackground();
      yt.start(session);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, cover, slug, embedUrl, active]);

  if (active) {
    return (
      <div
        data-youtube-slot={slug}
        className="media-player--audio mx-auto aspect-video w-full overflow-hidden rounded-xl border border-border bg-black"
        aria-label={`${title} — playing`}
      />
    );
  }

  if (!cover) {
    return (
      <button
        type="button"
        onClick={play}
        className="media-player--audio mx-auto flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-black text-white transition hover:bg-neutral-900"
        aria-label={`Play ${title}`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
          <Play className="h-6 w-6 fill-current pl-0.5" aria-hidden />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={play}
      className="media-player media-player--audio group mx-auto block w-full overflow-hidden rounded-xl border border-border bg-black text-left"
      aria-label={`Play ${title}`}
    >
      <div className="media-player__cover-frame">
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
            <Play className="h-5 w-5 fill-current pl-0.5 sm:h-6 sm:w-6" aria-hidden />
          </span>
        </div>
      </div>
    </button>
  );
}
