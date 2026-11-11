"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SkipBack, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AudioPlayer } from "@/components/bhajan/AudioPlayer";
import { VideoPlayer } from "@/components/bhajan/VideoPlayer";
import { YouTubeCoverPlayer } from "@/components/bhajan/YouTubeCoverPlayer";
import { QueueBrowseActions } from "@/components/bhajan/QueueBrowseActions";
import {
  useQueuePlaybackOptional,
} from "@/components/bhajan/QueuePlayback";
import { QueueSessionAudioPlayer } from "@/components/bhajan/QueueSessionAudioPlayer";
import { useYouTubePlaybackOptional } from "@/components/bhajan/YouTubePlayback";
import {
  consumeBhajanAutoplay,
  markBhajanAutoplay,
  type QueueTrack,
} from "@/lib/play-queue";

type Common = {
  title: string;
  artist?: string | null;
  autoPlay?: boolean;
  prevHref?: string | null;
  nextHref?: string | null;
  prevTitle?: string | null;
  nextTitle?: string | null;
  queueLabel?: string | null;
  queueKey?: string | null;
  queueTracks?: QueueTrack[] | null;
  slug?: string;
  /** Detail-page path for this track (defaults to /bhajans/[slug]) */
  href?: string | null;
  cover?: string | null;
  miniCover?: string | null;
  coverAspect?: "wide" | "square";
};

type AudioProps = Common & {
  kind: "audio";
  src: string;
};

type VideoProps = Common & {
  kind: "video";
  src: string;
  poster?: string | null;
  offerResume?: boolean;
};

type YoutubeProps = Common & {
  kind: "youtube";
  embedUrl: string;
};

type Props = AudioProps | VideoProps | YoutubeProps;

function pageTrackFromProps(props: Props): QueueTrack | null {
  if (!props.slug) return null;
  const fromQueue = props.queueTracks?.find((t) => t.slug === props.slug);
  const href = props.href ?? `/bhajans/${props.slug}`;

  if (props.kind === "audio") {
    const built: QueueTrack = {
      slug: props.slug,
      title: props.title,
      artist: props.artist ?? null,
      href,
      kind: "audio",
      audioSrc: props.src,
      videoSrc: null,
      youtubeEmbedUrl: null,
      cover: props.cover ?? null,
      miniCover: props.miniCover ?? props.cover ?? null,
      coverAspect: props.coverAspect,
    };
    return fromQueue
      ? {
          ...fromQueue,
          ...built,
          // Keep queue neighbors; prefer this page’s version media/art
          cover: props.cover ?? fromQueue.cover ?? null,
          miniCover:
            props.miniCover ?? props.cover ?? fromQueue.miniCover ?? null,
          artist: props.artist ?? fromQueue.artist ?? null,
        }
      : built;
  }
  if (props.kind === "video") {
    const built: QueueTrack = {
      slug: props.slug,
      title: props.title,
      artist: props.artist ?? null,
      href,
      kind: "video",
      audioSrc: null,
      videoSrc: props.src,
      youtubeEmbedUrl: null,
      cover: props.poster ?? props.cover ?? null,
      miniCover: props.miniCover ?? props.poster ?? props.cover ?? null,
    };
    return fromQueue
      ? {
          ...fromQueue,
          ...built,
          cover: props.poster ?? props.cover ?? fromQueue.cover ?? null,
          miniCover:
            props.miniCover ??
            props.poster ??
            props.cover ??
            fromQueue.miniCover ??
            null,
          artist: props.artist ?? fromQueue.artist ?? null,
        }
      : built;
  }
  const built: QueueTrack = {
    slug: props.slug,
    title: props.title,
    artist: props.artist ?? null,
    href,
    kind: "youtube",
    audioSrc: null,
    videoSrc: null,
    youtubeEmbedUrl: props.embedUrl,
    cover: props.cover ?? null,
    miniCover: props.miniCover ?? props.cover ?? null,
  };
  return fromQueue
    ? {
        ...fromQueue,
        ...built,
        cover: props.cover ?? fromQueue.cover ?? null,
        miniCover: props.miniCover ?? props.cover ?? fromQueue.miniCover ?? null,
        artist: props.artist ?? fromQueue.artist ?? null,
      }
    : built;
}

export function QueueAwarePlayer(props: Props) {
  const router = useRouter();
  const queue = useQueuePlaybackOptional();
  const yt = useYouTubePlaybackOptional();

  const pageTrack = useMemo(() => pageTrackFromProps(props), [props]);

  const currentQueueTrack = props.queueTracks?.find(
    (t) => t.slug === props.slug
  );

  const wantsCrossfade =
    props.kind === "audio" &&
    Boolean(
      props.queueKey &&
        props.queueTracks &&
        props.queueTracks.length > 1 &&
        props.slug &&
        currentQueueTrack?.audioSrc
    );

  const persistentTracks = useMemo((): QueueTrack[] | null => {
    if (props.kind !== "audio" || !props.slug || !pageTrack) return null;
    if (props.queueTracks && props.queueTracks.length > 0) {
      return props.queueTracks;
    }
    return [pageTrack];
  }, [props, pageTrack]);

  const persistentKey =
    props.queueKey || (props.slug ? `lone:${props.slug}` : null);

  const usePersistent =
    props.kind === "audio" &&
    Boolean(persistentKey && persistentTracks?.length && props.slug);

  const [forceAutoplay, setForceAutoplay] = useState(false);
  const shouldAutoPlay = Boolean(props.autoPlay || forceAutoplay);

  useEffect(() => {
    if (consumeBhajanAutoplay()) setForceAutoplay(true);
  }, []);

  // Keep session in sync for video / YouTube continuous play
  useEffect(() => {
    if (usePersistent) return;
    if (!queue || !props.queueKey || !props.queueTracks?.length || !props.slug) {
      return;
    }
    queue.attach({
      queueKey: props.queueKey,
      tracks: props.queueTracks,
      slug: props.slug,
      autoPlay: shouldAutoPlay,
    });
  }, [
    usePersistent,
    queue,
    props.queueKey,
    props.queueTracks,
    props.slug,
    shouldAutoPlay,
  ]);

  const sessionTrack = queue?.session?.tracks[queue.session.index];
  const sessionIndex = queue?.session?.index ?? -1;
  const sessionIsThisPage = sessionTrack?.slug === props.slug;
  const browsingOther = Boolean(sessionTrack && !sessionIsThisPage);
  /** Active multi-track session on this page — enable skip even without URL queue= */
  const sessionQueueHere = Boolean(
    queue?.session &&
      sessionIsThisPage &&
      queue.session.tracks.length > 1
  );
  const inQueue = Boolean(
    props.prevHref ||
      props.nextHref ||
      props.queueTracks?.length ||
      sessionQueueHere
  );

  const skipPrev = useMemo(() => {
    if (queue?.session && sessionIndex > 0) {
      const t = queue.session.tracks[sessionIndex - 1];
      return t ? { href: t.href, title: t.title } : null;
    }
    return props.prevHref
      ? { href: props.prevHref, title: props.prevTitle || "Last song" }
      : null;
  }, [queue?.session, sessionIndex, props.prevHref, props.prevTitle]);

  const skipNext = useMemo(() => {
    if (
      queue?.session &&
      sessionIndex >= 0 &&
      sessionIndex < queue.session.tracks.length - 1
    ) {
      const t = queue.session.tracks[sessionIndex + 1];
      return t ? { href: t.href, title: t.title } : null;
    }
    return props.nextHref
      ? { href: props.nextHref, title: props.nextTitle || "Next song" }
      : null;
  }, [queue?.session, sessionIndex, props.nextHref, props.nextTitle]);

  const goPrev = useCallback(() => {
    if (queue?.session) {
      queue.prev();
      return;
    }
    if (props.prevHref) {
      markBhajanAutoplay();
      router.push(props.prevHref);
    }
  }, [queue, props.prevHref, router]);

  const goNext = useCallback(() => {
    if (queue?.session) {
      queue.next();
      return;
    }
    if (props.nextHref) {
      markBhajanAutoplay();
      router.push(props.nextHref);
    }
  }, [queue, props.nextHref, router]);

  const advance =
    !queue?.session && props.nextHref ? goNext : undefined;

  const onPlayNowNonAudio = () => {
    if (!pageTrack || !props.slug) return;
    setForceAutoplay(true);
    const tracks =
      props.queueTracks && props.queueTracks.length > 0
        ? props.queueTracks
        : [pageTrack];
    const key = props.queueKey || `lone:${props.slug}`;
    queue?.attach({
      queueKey: key,
      tracks,
      slug: props.slug,
      autoPlay: true,
    });
    if (props.kind === "youtube") {
      yt?.start({
        slug: props.slug,
        title: props.title,
        artist: props.artist,
        href: props.href ?? `/bhajans/${props.slug}`,
        embedUrl: props.embedUrl,
      });
    }
  };

  return (
    <div className="space-y-3">
      {props.queueLabel && inQueue && (
        <p className="text-center text-xs text-muted sm:text-sm">
          {props.queueLabel}
          <span className="text-muted/80">
            {wantsCrossfade
              ? " · crossfades into the next track"
              : " · auto-advances when a track ends"}
          </span>
        </p>
      )}

      {usePersistent && persistentKey && persistentTracks && props.slug && (
        <QueueSessionAudioPlayer
          queueKey={persistentKey}
          tracks={persistentTracks}
          slug={props.slug}
          autoPlay={shouldAutoPlay}
          cover={
            sessionIsThisPage
              ? props.cover || sessionTrack?.cover || null
              : props.cover || null
          }
          coverAspect={
            sessionIsThisPage
              ? sessionTrack?.coverAspect ?? props.coverAspect
              : props.coverAspect
          }
          title={
            sessionIsThisPage
              ? sessionTrack?.title || props.title
              : props.title
          }
          pageTrack={pageTrack ?? persistentTracks[0]!}
        />
      )}

      {!usePersistent &&
        browsingOther &&
        pageTrack &&
        queue &&
        props.kind !== "audio" && (
          <QueueBrowseActions
            pageTrack={pageTrack}
            nowPlayingTitle={sessionTrack?.title}
            onPlayNow={onPlayNowNonAudio}
          />
        )}

      {!usePersistent && props.kind === "audio" && props.cover && (
        <AudioPlayer
          src={props.src}
          title={props.title}
          cover={props.cover}
          artist={props.artist}
          coverAspect={props.coverAspect}
          autoPlay={shouldAutoPlay}
          onEnded={advance}
          onPrev={props.prevHref ? goPrev : undefined}
          onNext={props.nextHref ? goNext : undefined}
        />
      )}
      {!usePersistent && props.kind === "audio" && !props.cover && (
        <BareAudio
          src={props.src}
          autoPlay={shouldAutoPlay}
          onEnded={advance}
        />
      )}
      {props.kind === "video" && !(browsingOther && !shouldAutoPlay) && (
        <VideoPlayer
          src={props.src}
          title={props.title}
          poster={props.poster}
          offerResume={props.offerResume}
          autoPlay={shouldAutoPlay && !browsingOther}
          onEnded={advance}
          slug={props.slug}
        />
      )}
      {props.kind === "video" && browsingOther && !shouldAutoPlay && (
        <div className="overflow-hidden rounded-xl border border-border bg-black">
          {/* poster-only while another track plays; actions above */}
          {props.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={props.poster}
              alt=""
              className="aspect-video w-full object-cover opacity-80"
            />
          ) : (
            <div className="aspect-video w-full bg-neutral-900" />
          )}
        </div>
      )}
      {props.kind === "youtube" && props.slug && (
        <YouTubeCoverPlayer
          embedUrl={props.embedUrl}
          title={props.title}
          cover={props.cover}
          artist={props.artist}
          slug={props.slug}
          href={props.href ?? `/bhajans/${props.slug}`}
          autoPlay={Boolean(shouldAutoPlay && !browsingOther)}
        />
      )}

      {inQueue && !browsingOther && (skipPrev || skipNext) && (
        <QueueSkipBar
          prev={skipPrev}
          next={skipNext}
          onPrev={queue?.session ? goPrev : undefined}
          onNext={queue?.session ? goNext : undefined}
        />
      )}
    </div>
  );
}

function QueueSkipBar({
  prev,
  next,
  onPrev,
  onNext,
}: {
  prev: { href: string; title: string } | null;
  next: { href: string; title: string } | null;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const prevClass =
    "btn-secondary flex min-h-12 flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-left transition sm:px-4";
  const nextClass =
    "btn-secondary flex min-h-12 flex-1 items-center justify-end gap-2 rounded-lg px-3 py-2.5 text-right transition sm:px-4";

  return (
    <div className="flex items-stretch gap-2 sm:gap-3">
      {prev ? (
        onPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className={prevClass}
            aria-label={`Previous: ${prev.title}`}
          >
            <SkipBack className="h-5 w-5 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold tracking-wide text-muted uppercase sm:text-xs">
                Previous
              </span>
              <span className="block truncate text-sm font-medium text-primary">
                {prev.title}
              </span>
            </span>
          </button>
        ) : (
          <Link
            href={prev.href}
            onClick={() => markBhajanAutoplay()}
            className={prevClass}
            aria-label={`Previous: ${prev.title}`}
          >
            <SkipBack className="h-5 w-5 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold tracking-wide text-muted uppercase sm:text-xs">
                Previous
              </span>
              <span className="block truncate text-sm font-medium text-primary">
                {prev.title}
              </span>
            </span>
          </Link>
        )
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        onNext ? (
          <button
            type="button"
            onClick={onNext}
            className={nextClass}
            aria-label={`Next: ${next.title}`}
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold tracking-wide text-muted uppercase sm:text-xs">
                Next
              </span>
              <span className="block truncate text-sm font-medium text-primary">
                {next.title}
              </span>
            </span>
            <SkipForward className="h-5 w-5 shrink-0" aria-hidden />
          </button>
        ) : (
          <Link
            href={next.href}
            onClick={() => markBhajanAutoplay()}
            className={nextClass}
            aria-label={`Next: ${next.title}`}
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold tracking-wide text-muted uppercase sm:text-xs">
                Next
              </span>
              <span className="block truncate text-sm font-medium text-primary">
                {next.title}
              </span>
            </span>
            <SkipForward className="h-5 w-5 shrink-0" aria-hidden />
          </Link>
        )
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

function BareAudio({
  src,
  autoPlay,
  onEnded,
}: {
  src: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <audio
        controls
        preload="metadata"
        className="w-full"
        src={src}
        autoPlay={autoPlay}
        onEnded={onEnded}
      >
        Your browser does not support this audio.
      </audio>
    </div>
  );
}
