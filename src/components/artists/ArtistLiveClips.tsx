"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { claimSitePlayback } from "@/lib/floating-playback";
import { youtubeEmbedUrl, youtubePosterUrl } from "@/lib/utils";

export type ArtistLiveClip = {
  title: string;
  youtube_url?: string;
  /** Local MP4/WebM under /public */
  video_url?: string;
  /** Optional poster for local video */
  poster_url?: string;
};

function embedWithAutoplay(embed: string): string {
  const url = new URL(embed);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("rel", "0");
  return url.toString();
}

function clipKey(clip: ArtistLiveClip): string {
  return clip.youtube_url ?? clip.video_url ?? clip.title;
}

export function ArtistLiveClips({ clips }: { clips: ArtistLiveClip[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  if (clips.length === 0) return null;

  const play = (key: string) => {
    claimSitePlayback();
    setActiveKey(key);
  };

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-semibold text-primary">
          Live clips
        </h2>
        <p className="text-sm text-muted">
          Rare live footage and short clips
        </p>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clips.map((clip) => {
          const key = clipKey(clip);
          const isActive = activeKey === key;

          if (clip.video_url) {
            const portrait = true;
            return (
              <li key={key} className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-border bg-black shadow-sm">
                  <div
                    className={
                      portrait
                        ? "relative mx-auto aspect-[9/16] w-full max-w-[280px]"
                        : "relative aspect-video w-full"
                    }
                  >
                    {isActive ? (
                      <video
                        key={key}
                        src={clip.video_url}
                        poster={clip.poster_url}
                        className="absolute inset-0 h-full w-full object-contain"
                        controls
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => play(key)}
                        className="group absolute inset-0 flex w-full items-center justify-center bg-black text-white transition hover:bg-neutral-900"
                        aria-label={`Play ${clip.title}`}
                      >
                        {clip.poster_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={clip.poster_url}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:opacity-75"
                          />
                        ) : null}
                        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition group-hover:scale-105">
                          <Play
                            className="h-6 w-6 fill-current pl-0.5"
                            aria-hidden
                          />
                        </span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium leading-snug text-primary">
                  {clip.title}
                </p>
              </li>
            );
          }

          const embed = clip.youtube_url
            ? youtubeEmbedUrl(clip.youtube_url)
            : null;
          if (!embed || !clip.youtube_url) return null;

          const poster = youtubePosterUrl(clip.youtube_url);

          return (
            <li key={key} className="space-y-2">
              <div className="overflow-hidden rounded-xl border border-border bg-black shadow-sm">
                <div className="relative aspect-video w-full">
                  {isActive ? (
                    <iframe
                      key={key}
                      src={embedWithAutoplay(embed)}
                      title={clip.title}
                      className="absolute inset-0 h-full w-full"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => play(key)}
                      className="group absolute inset-0 flex w-full items-center justify-center bg-black text-white transition hover:bg-neutral-900"
                      aria-label={`Play ${clip.title}`}
                    >
                      {poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={poster}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:opacity-75"
                        />
                      ) : null}
                      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition group-hover:scale-105">
                        <Play
                          className="h-6 w-6 fill-current pl-0.5"
                          aria-hidden
                        />
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium leading-snug text-primary">
                {clip.title}
              </p>
              <p>
                <a
                  href={clip.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-accent transition hover:underline"
                >
                  Watch on YouTube →
                </a>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
