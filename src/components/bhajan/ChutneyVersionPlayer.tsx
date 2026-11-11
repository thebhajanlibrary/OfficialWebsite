"use client";

import { useMemo, useState } from "react";
import { QueueAwarePlayer } from "@/components/bhajan/QueueAwarePlayer";
import type { ChutneyAudioVersion } from "@/lib/chutney";
import type { QueueTrack } from "@/lib/play-queue";
import { youtubeEmbedUrl, youtubePosterUrl } from "@/lib/utils";

type Props = {
  versions: ChutneyAudioVersion[];
  title: string;
  artist?: string | null;
  cover?: string | null;
  slug: string;
  href: string;
  autoPlay?: boolean;
  /** Prefer this version id on first load (e.g. from ?v=slow) */
  initialVersionId?: string | null;
  queueKey: string;
  queueTracks: QueueTrack[];
};

export function ChutneyVersionPlayer({
  versions,
  title,
  artist,
  cover,
  slug,
  href,
  autoPlay = false,
  initialVersionId = null,
  queueKey,
  queueTracks,
}: Props) {
  const defaultId =
    versions.find((v) => v.default_for_queue)?.id ?? versions[0]?.id ?? "";
  const startId =
    (initialVersionId &&
      versions.some((v) => v.id === initialVersionId) &&
      initialVersionId) ||
    defaultId;
  const [selectedId, setSelectedId] = useState(startId);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(Boolean(autoPlay));

  const selected = useMemo(
    () => versions.find((v) => v.id === selectedId) ?? versions[0],
    [versions, selectedId]
  );

  const versionArtist = selected?.artist ?? artist;
  const versionCover =
    selected?.thumbnail_url ??
    (selected?.youtube_url ? youtubePosterUrl(selected.youtube_url) : null) ??
    cover ??
    null;

  /** Queue always stores the default file — override this song so the picker can switch. */
  const tracksForVersion = useMemo(() => {
    if (!selected) return queueTracks;
    const embed = selected.youtube_url
      ? youtubeEmbedUrl(selected.youtube_url)
      : null;
    const kind = selected.audio_url
      ? ("audio" as const)
      : embed
        ? ("youtube" as const)
        : ("audio" as const);
    return queueTracks.map((t) =>
      t.slug === slug
        ? {
            ...t,
            artist: selected.artist ?? t.artist,
            audioSrc: selected.audio_url ?? null,
            youtubeEmbedUrl: embed,
            kind,
            cover: versionCover,
            miniCover: versionCover,
          }
        : t
    );
  }, [queueTracks, selected, slug, versionCover]);

  /**
   * Alternate versions need their own session key so QueuePlayback reloads
   * instead of early-returning on the same slug with the default audioSrc.
   */
  const sessionQueueKey =
    selected && selected.id !== defaultId
      ? `${queueKey}:v:${selected.id}`
      : queueKey;

  if (!selected) return null;

  const embed = selected.youtube_url
    ? youtubeEmbedUrl(selected.youtube_url)
    : null;

  return (
    <div className="space-y-3">
      <div
        className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
        role="group"
        aria-label="Recording version"
      >
        {versions.map((v) => {
          const active = v.id === selected.id;
          return (
            <button
              key={v.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                if (v.id === selectedId) return;
                setSelectedId(v.id);
                setShouldAutoPlay(true);
              }}
              className={
                active
                  ? "flex-1 rounded-lg border border-primary bg-primary px-3 py-2.5 text-left text-sm text-white"
                  : "btn-secondary flex-1 rounded-lg px-3 py-2.5 text-left text-sm"
              }
            >
              <span className="block font-medium">{v.label}</span>
              {v.cue ? (
                <span
                  className={
                    active
                      ? "mt-0.5 block text-xs text-white/80"
                      : "mt-0.5 block text-xs text-muted"
                  }
                >
                  {v.cue}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {selected.audio_url ? (
        <QueueAwarePlayer
          key={`${slug}-${selected.id}-audio`}
          kind="audio"
          src={selected.audio_url}
          title={title}
          artist={versionArtist}
          cover={versionCover}
          slug={slug}
          href={href}
          autoPlay={shouldAutoPlay}
          queueKey={sessionQueueKey}
          queueTracks={tracksForVersion}
        />
      ) : embed ? (
        <QueueAwarePlayer
          key={`${slug}-${selected.id}-youtube`}
          kind="youtube"
          embedUrl={embed}
          title={title}
          cover={versionCover}
          artist={versionArtist}
          slug={slug}
          href={href}
          autoPlay={shouldAutoPlay}
          queueKey={sessionQueueKey}
          queueTracks={tracksForVersion}
        />
      ) : null}
    </div>
  );
}
