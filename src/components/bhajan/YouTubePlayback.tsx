"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import {
  DOUBLE_TAP_SEEK_SECONDS,
  DoubleTapSeekSurface,
  seekByOffset,
} from "@/components/bhajan/DoubleTapSeekSurface";
import { useQueuePlaybackOptional } from "@/components/bhajan/QueuePlayback";
import { useMediaSession } from "@/components/bhajan/useMediaSession";
import { pageIsHidden } from "@/lib/ios-playback";
import {
  armYoutubeBackground,
  pauseYoutubeBackground,
  releaseYoutubeBackground,
  resumeYoutubeBackground,
} from "@/lib/youtube-background";
import { QUEUE_HANDOFF_EVENT } from "@/lib/queue-handoff";
import {
  claimSitePlayback,
  DISMISS_FLOATING_PLAYERS_EVENT,
  trackPathname,
} from "@/lib/floating-playback";
import type { QueueTrack } from "@/lib/play-queue";

export type YouTubeSession = {
  slug: string;
  title: string;
  artist?: string | null;
  href: string;
  embedUrl: string;
};

type YouTubePlaybackApi = {
  session: YouTubeSession | null;
  start: (session: YouTubeSession) => void;
  clear: () => void;
};

const YouTubePlaybackContext = createContext<YouTubePlaybackApi | null>(null);

export function useYouTubePlayback(): YouTubePlaybackApi {
  const ctx = useContext(YouTubePlaybackContext);
  if (!ctx) {
    throw new Error("useYouTubePlayback must be used within YouTubePlaybackProvider");
  }
  return ctx;
}

export function useYouTubePlaybackOptional(): YouTubePlaybackApi | null {
  return useContext(YouTubePlaybackContext);
}

function withPlayerParams(embedUrl: string, autoplay: boolean): string {
  const src = new URL(embedUrl);
  if (autoplay) src.searchParams.set("autoplay", "1");
  src.searchParams.set("rel", "0");
  src.searchParams.set("enablejsapi", "1");
  src.searchParams.set("playsinline", "1");
  src.searchParams.set("fs", "1");
  if (typeof window !== "undefined") {
    src.searchParams.set("origin", window.location.origin);
    src.searchParams.set("widget_referrer", window.location.origin);
  }
  return src.toString();
}

function ytCommand(
  win: Window | null | undefined,
  func: string,
  args: unknown[] = []
) {
  if (!win) return;
  try {
    win.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  } catch {
    // ignore
  }
}

export function YouTubePlaybackProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<YouTubeSession | null>(null);
  const audioQueue = useQueuePlaybackOptional();
  const pathname = usePathname();

  // Stop YouTube if local audio actually starts playing
  useEffect(() => {
    const onAudio = () => {
      releaseYoutubeBackground();
      setSession(null);
    };
    window.addEventListener("bhajan-audio-playing", onAudio);
    return () => window.removeEventListener("bhajan-audio-playing", onAudio);
  }, []);

  useEffect(() => {
    if (!audioQueue?.playing) return;
    const track = audioQueue.session?.tracks[audioQueue.session.index];
    // Queue may be parked on a YouTube/video item with playing=false; if playing
    // flipped true incorrectly, don't tear down the in-page YouTube host.
    if (track && track.kind !== "audio") return;
    releaseYoutubeBackground();
    setSession(null);
  }, [audioQueue?.playing, audioQueue?.session]);

  useEffect(() => {
    const onDismiss = () => {
      setSession((current) => {
        if (!current) return null;
        const onPage = pathname === trackPathname(current.href);
        if (!onPage) {
          releaseYoutubeBackground();
          return null;
        }
        return current;
      });
    };
    window.addEventListener(DISMISS_FLOATING_PLAYERS_EVENT, onDismiss);
    return () =>
      window.removeEventListener(DISMISS_FLOATING_PLAYERS_EVENT, onDismiss);
  }, [pathname]);

  const start = useCallback(
    (next: YouTubeSession) => {
      claimSitePlayback();
      armYoutubeBackground();
      // Pause audio / site video — keep the unified queue intact
      audioQueue?.pauseOutput();
      audioQueue?.pauseSiteVideos();
      setSession((prev) => {
        if (prev?.embedUrl === next.embedUrl && prev.slug === next.slug) {
          return prev;
        }
        return next;
      });
    },
    [audioQueue]
  );

  const clear = useCallback(() => {
    releaseYoutubeBackground();
    setSession(null);
  }, []);

  useEffect(() => {
    const onHandoff = (event: Event) => {
      const track = (event as CustomEvent<QueueTrack>).detail;
      if (!track || track.kind !== "youtube" || !track.youtubeEmbedUrl) return;
      claimSitePlayback();
      armYoutubeBackground();
      audioQueue?.pauseOutput();
      audioQueue?.pauseSiteVideos();
      setSession({
        slug: track.slug,
        title: track.title,
        artist: track.artist ?? null,
        href: track.href,
        embedUrl: track.youtubeEmbedUrl,
      });
    };
    window.addEventListener(QUEUE_HANDOFF_EVENT, onHandoff);
    return () => window.removeEventListener(QUEUE_HANDOFF_EVENT, onHandoff);
  }, [audioQueue]);

  const api = useMemo(
    () => ({ session, start, clear }),
    [session, start, clear]
  );

  return (
    <YouTubePlaybackContext.Provider value={api}>
      {children}
      <PersistentYouTubeHost />
    </YouTubePlaybackContext.Provider>
  );
}

/** Keeps one YouTube iframe alive across navigations. */
function PersistentYouTubeHost() {
  const { session, clear } = useYouTubePlayback();
  const audioQueue = useQueuePlaybackOptional();
  const pathname = usePathname();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wantPlayingRef = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [box, setBox] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    mode: "slot" | "mini";
  } | null>(null);

  const trackPath = session?.href.split("?")[0].split("#")[0] ?? null;
  /** Still on this track’s page — never float as mini. */
  const onTrackPage = Boolean(session && trackPath && pathname === trackPath);

  useEffect(() => {
    wantPlayingRef.current = Boolean(session);
    setPlaying(Boolean(session));
    setCurrentTime(0);
    setDuration(0);
  }, [session]);

  // Advance queue when YouTube ends + keep lock-screen metadata
  useEffect(() => {
    if (!session) return;

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.youtube.com" &&
        event.origin !== "https://youtube.com"
      ) {
        return;
      }
      let data: unknown = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== "object") return;
      const payload = data as {
        event?: string;
        info?: number | { playerState?: number; currentTime?: number; duration?: number };
      };

      if (payload.event === "onStateChange" && typeof payload.info === "number") {
        // -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
        if (payload.info === 0) {
          wantPlayingRef.current = false;
          setPlaying(false);
          const sess = audioQueue?.session;
          const willAdvance = Boolean(
            sess &&
              sess.tracks[sess.index]?.slug === session.slug &&
              sess.index < sess.tracks.length - 1
          );
          audioQueue?.notifyMediaEnded(session.slug);
          if (!willAdvance) {
            clear();
          }
          return;
        }
        if (payload.info === 1 || payload.info === 3) {
          wantPlayingRef.current = true;
          setPlaying(true);
        } else if (payload.info === 2) {
          // Leaving Safari / lock pauses the iframe — keep going.
          // A pause while the page is visible is a real user pause.
          if (pageIsHidden() && wantPlayingRef.current) {
            resumeYoutubeBackground();
            ytCommand(iframeRef.current?.contentWindow, "playVideo");
            setPlaying(true);
          } else if (!pageIsHidden()) {
            wantPlayingRef.current = false;
            setPlaying(false);
          }
        }
      }

      if (
        (payload.event === "infoDelivery" || payload.event === "initialDelivery") &&
        payload.info &&
        typeof payload.info === "object"
      ) {
        const info = payload.info;
        if (typeof info.currentTime === "number") setCurrentTime(info.currentTime);
        if (typeof info.duration === "number" && info.duration > 0) {
          setDuration(info.duration);
        }
        if (typeof info.playerState === "number") {
          setPlaying(info.playerState === 1 || info.playerState === 3);
        }
      }
    };

    window.addEventListener("message", onMessage);

    const id = window.setInterval(() => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      try {
        win.postMessage(
          JSON.stringify({ event: "listening", id: 1, channel: "bhajan" }),
          "*"
        );
        ytCommand(win, "addEventListener", ["onStateChange"]);
        if (wantPlayingRef.current && pageIsHidden()) {
          resumeYoutubeBackground();
          ytCommand(win, "playVideo");
        }
      } catch {
        // ignore
      }
    }, 400);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(id);
    };
  }, [session, audioQueue, clear]);

  useEffect(() => {
    if (!session) return;
    const kick = () => {
      if (!wantPlayingRef.current) return;
      resumeYoutubeBackground();
      ytCommand(iframeRef.current?.contentWindow, "playVideo");
    };
    document.addEventListener("visibilitychange", kick);
    window.addEventListener("pagehide", kick);
    window.addEventListener("pageshow", kick);
    window.addEventListener("freeze", kick);
    window.addEventListener("resume", kick);
    window.addEventListener("blur", kick);
    window.addEventListener("focus", kick);
    return () => {
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("pagehide", kick);
      window.removeEventListener("pageshow", kick);
      window.removeEventListener("freeze", kick);
      window.removeEventListener("resume", kick);
      window.removeEventListener("blur", kick);
      window.removeEventListener("focus", kick);
    };
  }, [session]);

  useMediaSession({
    enabled: Boolean(session),
    title: session?.title ?? "Bhajan Library",
    artist: session?.artist,
    album: "Bhajan Library",
    playing,
    currentTime,
    duration,
    handlers: session
      ? {
          play: () => {
            wantPlayingRef.current = true;
            resumeYoutubeBackground();
            ytCommand(iframeRef.current?.contentWindow, "playVideo");
            setPlaying(true);
          },
          pause: () => {
            wantPlayingRef.current = false;
            pauseYoutubeBackground();
            ytCommand(iframeRef.current?.contentWindow, "pauseVideo");
            setPlaying(false);
          },
          stop: () => {
            wantPlayingRef.current = false;
            clear();
          },
          seek: (time) => {
            ytCommand(iframeRef.current?.contentWindow, "seekTo", [time, true]);
            setCurrentTime(time);
          },
          seekOffset: (offset) => {
            const next = seekByOffset(currentTime, duration, offset);
            ytCommand(iframeRef.current?.contentWindow, "seekTo", [next, true]);
            setCurrentTime(next);
          },
          previous: () => audioQueue?.prev(),
          next: () => audioQueue?.next(),
        }
      : undefined,
    canPrevious: Boolean(audioQueue?.session && (audioQueue.session.index ?? 0) > 0),
    canNext: Boolean(
      audioQueue?.session &&
        audioQueue.session.index < audioQueue.session.tracks.length - 1
    ),
  });

  useEffect(() => {
    if (!session) {
      setBox(null);
      return;
    }

    let observed: HTMLElement | null = null;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure())
        : null;

    const measure = () => {
      const slot = document.querySelector<HTMLElement>(
        `[data-youtube-slot="${session.slug}"]`
      );

      if (slot && ro && slot !== observed) {
        if (observed) ro.unobserve(observed);
        ro.observe(slot);
        observed = slot;
      }

      // Same page: pin to the in-page slot only — never jump to mini.
      if (onTrackPage) {
        if (slot) {
          const r = slot.getBoundingClientRect();
          if (r.width > 40 && r.height > 40) {
            setBox({
              top: r.top,
              left: r.left,
              width: r.width,
              height: r.height,
              mode: "slot",
            });
            return;
          }
        }
        // Slot not ready yet — keep prior slot box so the iframe never unmounts.
        setBox((prev) =>
          prev?.mode === "slot"
            ? prev
            : {
                top: 0,
                left: 0,
                width: Math.min(320, window.innerWidth),
                height: 180,
                mode: "slot",
              }
        );
        return;
      }

      // Navigated to another page/tab in the site — floating mini player.
      const width = Math.min(320, window.innerWidth - 24);
      const height = (width * 9) / 16;
      setBox({
        top: window.innerHeight - height - 16,
        left: window.innerWidth - width - 16,
        width,
        height,
        mode: "mini",
      });
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const id = window.setInterval(measure, 250);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      window.clearInterval(id);
    };
  }, [session, onTrackPage, pathname]);

  if (!session) return null;

  const frame = box ?? {
    top: 0,
    left: 0,
    width: 320,
    height: 180,
    mode: "slot" as const,
  };

  const iframeSrc = withPlayerParams(session.embedUrl, true);

  return (
    <div
      className={
        frame.mode === "mini"
          ? "fixed z-[60] overflow-hidden rounded-xl border border-border bg-black shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
          : "fixed z-40 overflow-hidden rounded-xl border border-border bg-black"
      }
      style={{
        top: frame.top,
        left: frame.left,
        width: frame.width,
        height: frame.height,
      }}
    >
      {frame.mode === "mini" && (
        <div className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent px-2 py-1.5">
          <Link
            href={session.href}
            className="min-w-0 truncate text-xs font-medium text-white/95 hover:underline"
          >
            {session.title}
          </Link>
          <button
            type="button"
            onClick={clear}
            className="shrink-0 rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
            aria-label="Close YouTube player"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      )}
      <iframe
        ref={iframeRef}
        key={session.embedUrl}
        src={iframeSrc}
        title={session.title}
        className={
          frame.mode === "mini" ? "pointer-events-none h-full w-full" : "h-full w-full"
        }
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
      />
      <DoubleTapSeekSurface
        className="absolute inset-0 z-20"
        overlayOnly
        ariaLabel={
          frame.mode === "mini"
            ? `${session.title}. Open this song on the site. Double-tap left or right to skip 30 seconds.`
            : `${session.title}. Double-tap left or right to skip 30 seconds.`
        }
        onSingleTap={
          frame.mode === "mini" ? () => router.push(session.href) : undefined
        }
        onSeekBack={() => {
          const next = seekByOffset(
            currentTime,
            duration,
            -DOUBLE_TAP_SEEK_SECONDS
          );
          ytCommand(iframeRef.current?.contentWindow, "seekTo", [next, true]);
          setCurrentTime(next);
        }}
        onSeekForward={() => {
          const next = seekByOffset(
            currentTime,
            duration,
            DOUBLE_TAP_SEEK_SECONDS
          );
          ytCommand(iframeRef.current?.contentWindow, "seekTo", [next, true]);
          setCurrentTime(next);
        }}
      >
        <div className="h-full w-full" aria-hidden />
      </DoubleTapSeekSurface>
    </div>
  );
}
