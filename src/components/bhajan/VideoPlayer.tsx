"use client";

import { PictureInPicture2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CastButtonForRef } from "@/components/bhajan/CastButton";
import {
  DOUBLE_TAP_SEEK_SECONDS,
  DoubleTapSeekSurface,
  seekByOffset,
} from "@/components/bhajan/DoubleTapSeekSurface";
import { useMediaSession } from "@/components/bhajan/useMediaSession";
import { useQueuePlaybackOptional } from "@/components/bhajan/QueuePlayback";
import { useYouTubePlaybackOptional } from "@/components/bhajan/YouTubePlayback";
import {
  enterVideoPip,
  exitVideoPip,
  keepMediaPlayingWhenLocked,
  pageIsHidden,
  prepareUnlockableMedia,
  videoIsInPip,
} from "@/lib/ios-playback";
import { applyCastArtwork, absoluteMediaUrl } from "@/lib/media-artwork";
import {
  clearOrphanVideo,
  orphanPlayingVideo,
  takeOrphanVideo,
} from "@/lib/persistent-video";
import { claimSitePlayback } from "@/lib/floating-playback";
import { mediaFragmentStartSeconds } from "@/lib/utils";

type Props = {
  src: string;
  title: string;
  poster?: string | null;
  /** Ask to resume after refresh (for long mixtapes / CDs) */
  offerResume?: boolean;
  autoPlay?: boolean;
  onEnded?: () => void;
  /** Bhajan slug — used for queue advance on ended */
  slug?: string;
};

function storageKey(src: string) {
  return `bhajan-video-progress:${src.split("#")[0]}`;
}

function formatTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

function baseSrc(url: string) {
  return url.split("#")[0] ?? url;
}

export function VideoPlayer({
  src,
  title,
  poster,
  offerResume = true,
  autoPlay = false,
  onEnded,
  slug,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lockAudioRef = useRef<HTMLAudioElement>(null);
  const lastSavedAt = useRef(0);
  const wantPlayingRef = useRef(false);
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pipActive, setPipActive] = useState(false);
  const [pipSupported, setPipSupported] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const queue = useQueuePlaybackOptional();
  const yt = useYouTubePlaybackOptional();
  const slugRef = useRef(slug);
  slugRef.current = slug;
  const queueRef = useRef(queue);
  queueRef.current = queue;
  const ytRef = useRef(yt);
  ytRef.current = yt;
  const fragmentStart = mediaFragmentStartSeconds(src);

  const claimPlayback = () => {
    claimSitePlayback();
    queueRef.current?.pauseOutput();
    ytRef.current?.clear();
  };

  const startLockAudio = useCallback(async () => {
    const video = videoRef.current;
    const audio = lockAudioRef.current;
    if (!video || !audio) return;
    prepareUnlockableMedia(audio);
    const nextSrc = video.currentSrc || baseSrc(src);
    try {
      const abs = new URL(nextSrc, window.location.href).href;
      if (audio.src !== abs) {
        audio.src = nextSrc;
        audio.load();
      }
    } catch {
      if (nextSrc && !audio.src.includes(baseSrc(src))) {
        audio.src = nextSrc;
        audio.load();
      }
    }
    try {
      audio.currentTime = video.currentTime || 0;
    } catch {
      // ignore
    }
    if (!wantPlayingRef.current) return;
    audio.volume = pageIsHidden() ? 1 : 0.0001;
    try {
      await audio.play();
    } catch {
      // still need the user-gesture play on the video
    }
    // Pause may have landed while play() was pending
    if (!wantPlayingRef.current) {
      audio.pause();
      audio.volume = 0.0001;
    }
  }, [src]);

  const pauseLockAudio = useCallback(() => {
    const audio = lockAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.volume = 0.0001;
  }, []);

  const togglePip = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (videoIsInPip(video)) {
      await exitVideoPip(video);
      setPipActive(false);
      return;
    }
    claimPlayback();
    if (video.paused) {
      wantPlayingRef.current = true;
      void video.play().catch(() => undefined);
      void startLockAudio();
    }
    await enterVideoPip(video);
    setPipActive(videoIsInPip(video));
  }, [startLockAudio]);

  useMediaSession({
    title,
    cover: poster,
    playing,
    currentTime,
    duration,
    handlers: {
      play: () => {
        const video = videoRef.current;
        if (video?.paused) {
          claimPlayback();
          wantPlayingRef.current = true;
          void video.play().catch(() => undefined);
          void startLockAudio();
        } else {
          void startLockAudio();
        }
      },
      pause: () => {
        wantPlayingRef.current = false;
        videoRef.current?.pause();
        pauseLockAudio();
      },
      seek: (time) => {
        const video = videoRef.current;
        const audio = lockAudioRef.current;
        if (video) {
          video.currentTime = time;
        }
        if (audio) {
          try {
            audio.currentTime = time;
          } catch {
            // ignore
          }
        }
        setCurrentTime(time);
      },
      seekOffset: (offset) => {
        const video = videoRef.current;
        const audio = lockAudioRef.current;
        const t = video?.currentTime ?? 0;
        const d = video?.duration ?? duration;
        const next = seekByOffset(t, d, offset);
        if (video) video.currentTime = next;
        if (audio) {
          try {
            audio.currentTime = next;
          } catch {
            // ignore
          }
        }
        setCurrentTime(next);
      },
    },
  });

  // Imperative <video> so we can orphan it into PiP across navigations
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const reused = takeOrphanVideo(baseSrc(src));
    const video = reused ?? document.createElement("video");
    videoRef.current = video;

    video.controls = true;
    video.setAttribute("controlsList", "nodownload");
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.preload = "auto";
    video.className = "media-player__video";
    video.setAttribute("aria-label", title);
    video.disablePictureInPicture = false;
    const posterUrl = absoluteMediaUrl(poster);
    if (posterUrl) video.poster = posterUrl;
    else video.removeAttribute("poster");

    if (!reused) {
      video.src = src;
    } else if (!video.src.includes(baseSrc(src))) {
      video.src = src;
    }

    prepareUnlockableMedia(video);
    shell.appendChild(video);

    setPipSupported(
      Boolean(
        (typeof document !== "undefined" && document.pictureInPictureEnabled) ||
          typeof (
            video as HTMLVideoElement & {
              webkitSetPresentationMode?: unknown;
            }
          ).webkitSetPresentationMode === "function"
      )
    );
    setPipActive(videoIsInPip(video));

    const onPlay = () => {
      claimPlayback();
      wantPlayingRef.current = true;
      setPlaying(true);
      void startLockAudio();
    };
    const onPause = () => {
      // System pause while backgrounded — keep companion audio / PiP alive
      if (pageIsHidden() && wantPlayingRef.current) {
        const audio = lockAudioRef.current;
        if (audio) {
          audio.volume = 1;
          void audio.play().catch(() => undefined);
        }
        void enterVideoPip(video);
        return;
      }
      // Intentional pause (controls, PiP, lock screen pause button)
      wantPlayingRef.current = false;
      setPlaying(false);
      pauseLockAudio();
    };
    const onTime = () => {
      setCurrentTime(video.currentTime);
      const audio = lockAudioRef.current;
      if (
        audio &&
        !audio.paused &&
        !pageIsHidden() &&
        Math.abs(audio.currentTime - video.currentTime) > 0.5
      ) {
        try {
          audio.currentTime = video.currentTime;
        } catch {
          // ignore
        }
      }
      saveProgressFor(video);
    };
    const onMeta = () => {
      setDuration(video.duration || 0);
      if (fragmentStart > 0 && video.currentTime < fragmentStart - 0.25) {
        try {
          video.currentTime = fragmentStart;
        } catch {
          // ignore
        }
      }
    };
    const onEnded = () => {
      wantPlayingRef.current = false;
      pauseLockAudio();
      clearProgress();
      if (slugRef.current) {
        queueRef.current?.notifyMediaEnded(slugRef.current);
      }
      onEndedRef.current?.();
    };
    const onPipChange = () => setPipActive(videoIsInPip(video));
    const blockContext = (e: Event) => e.preventDefault();

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("ended", onEnded);
    video.addEventListener("enterpictureinpicture", onPipChange);
    video.addEventListener("leavepictureinpicture", onPipChange);
    video.addEventListener("contextmenu", blockContext);
    video.addEventListener("dragstart", blockContext);
    document.addEventListener("enterpictureinpicture", onPipChange);
    document.addEventListener("leavepictureinpicture", onPipChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("enterpictureinpicture", onPipChange);
      video.removeEventListener("leavepictureinpicture", onPipChange);
      video.removeEventListener("contextmenu", blockContext);
      video.removeEventListener("dragstart", blockContext);
      document.removeEventListener("enterpictureinpicture", onPipChange);
      document.removeEventListener("leavepictureinpicture", onPipChange);

      const keepAlive =
        wantPlayingRef.current || videoIsInPip(video) || !video.paused;
      if (keepAlive) {
        orphanPlayingVideo(video);
        void enterVideoPip(video);
      } else {
        clearOrphanVideo(video);
        video.removeAttribute("src");
        video.load();
        video.remove();
      }
      if (videoRef.current === video) videoRef.current = null;
    };
    // saveProgressFor / clearProgress closed over below — defined in component body
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, title, poster, fragmentStart, startLockAudio, pauseLockAudio]);

  useEffect(() => {
    const onHide = () => {
      if (!wantPlayingRef.current) return;
      const video = videoRef.current;
      const audio = lockAudioRef.current;
      if (audio) {
        try {
          if (video) audio.currentTime = video.currentTime;
        } catch {
          // ignore
        }
        audio.volume = 1;
        void audio.play().catch(() => undefined);
      }
      if (video) {
        video.muted = true;
        void enterVideoPip(video);
      }
    };
    const onShow = () => {
      if (!wantPlayingRef.current) return;
      const video = videoRef.current;
      const audio = lockAudioRef.current;
      if (audio) audio.volume = 0.0001;
      if (video) {
        video.muted = false;
        if (audio && Number.isFinite(audio.currentTime)) {
          try {
            video.currentTime = audio.currentTime;
          } catch {
            // ignore
          }
        }
        if (video.paused) void video.play().catch(() => undefined);
      }
    };
    const onVis = () => {
      if (pageIsHidden()) onHide();
      else onShow();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("freeze", onHide);
    window.addEventListener("pageshow", onShow);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("freeze", onHide);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  useEffect(() => {
    applyCastArtwork(videoRef.current, { poster, title });
  }, [poster, title, src]);

  useEffect(() => {
    return keepMediaPlayingWhenLocked(
      () => lockAudioRef.current,
      () => wantPlayingRef.current
    );
  }, [src]);

  useEffect(() => {
    if (!offerResume) return;
    try {
      const raw = localStorage.getItem(storageKey(src));
      if (!raw) return;
      const time = Number(raw);
      if (Number.isFinite(time) && time >= 20) {
        setResumeAt(time);
      }
    } catch {
      // ignore storage errors
    }
  }, [src, offerResume]);

  useEffect(() => {
    if (!autoPlay || resumeAt != null) return;
    const video = videoRef.current;
    if (!video) return;
    claimPlayback();
    wantPlayingRef.current = true;
    void video.play().catch(() => {
      // browser may block autoplay
    });
    void startLockAudio();
  }, [src, autoPlay, resumeAt, startLockAudio]);

  function clearProgress() {
    try {
      localStorage.removeItem(storageKey(src));
    } catch {
      // ignore
    }
  }

  function saveProgressFor(video: HTMLVideoElement) {
    if (!offerResume) return;
    const time = video.currentTime;
    const dur = video.duration;
    if (!Number.isFinite(time) || time < 20) return;
    if (Number.isFinite(dur) && dur > 0 && dur - time < 45) {
      clearProgress();
      return;
    }
    const now = Date.now();
    if (now - lastSavedAt.current < 2500) return;
    lastSavedAt.current = now;
    try {
      localStorage.setItem(storageKey(src), String(Math.floor(time)));
    } catch {
      // ignore
    }
  }

  function resumePlayback() {
    const video = videoRef.current;
    if (video && resumeAt != null) {
      claimPlayback();
      wantPlayingRef.current = true;
      video.currentTime = resumeAt;
      void video.play().catch(() => {
        // autoplay may be blocked; position is still set
      });
      void startLockAudio();
    }
    setResumeAt(null);
  }

  function startFromBeginning() {
    clearProgress();
    const video = videoRef.current;
    if (video) {
      claimPlayback();
      wantPlayingRef.current = true;
      video.currentTime = fragmentStart;
      void video.play().catch(() => {
        // autoplay may be blocked
      });
      void startLockAudio();
    }
    setResumeAt(null);
  }

  return (
    <div className="space-y-3">
      {resumeAt != null && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Continue from{" "}
            <span className="font-medium text-foreground">
              {formatTime(resumeAt)}
            </span>
            , or start from the beginning?
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resumePlayback}
              className="btn-primary rounded-lg px-3 py-2 text-sm font-semibold"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={startFromBeginning}
              className="btn-secondary rounded-lg px-3 py-2 text-sm"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      <div
        className="media-player relative overflow-hidden rounded-xl border border-border bg-black"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1">
          {pipSupported && (
            <button
              type="button"
              onClick={() => void togglePip()}
              className={`rounded-full bg-black/55 p-1.5 text-white backdrop-blur-sm transition hover:bg-white/10 ${
                pipActive ? "text-accent" : ""
              }`}
              aria-label={
                pipActive ? "Exit picture-in-picture" : "Picture-in-picture"
              }
              title={
                pipActive ? "Exit picture-in-picture" : "Picture-in-picture"
              }
            >
              <PictureInPicture2 className="h-4 w-4" aria-hidden />
            </button>
          )}
          <CastButtonForRef
            mediaRef={videoRef}
            className="rounded-full bg-black/55 backdrop-blur-sm"
          />
        </div>
        <div ref={shellRef} className="media-player__video-shell" />
        <DoubleTapSeekSurface
          className="absolute inset-0 z-20"
          overlayOnly
          ariaLabel={`${title}. Double-tap left or right to skip 30 seconds.`}
          onSeekBack={() => {
            const video = videoRef.current;
            if (!video) return;
            const next = seekByOffset(
              video.currentTime,
              video.duration || duration,
              -DOUBLE_TAP_SEEK_SECONDS
            );
            video.currentTime = next;
            const audio = lockAudioRef.current;
            if (audio) {
              try {
                audio.currentTime = next;
              } catch {
                // ignore
              }
            }
            setCurrentTime(next);
          }}
          onSeekForward={() => {
            const video = videoRef.current;
            if (!video) return;
            const next = seekByOffset(
              video.currentTime,
              video.duration || duration,
              DOUBLE_TAP_SEEK_SECONDS
            );
            video.currentTime = next;
            const audio = lockAudioRef.current;
            if (audio) {
              try {
                audio.currentTime = next;
              } catch {
                // ignore
              }
            }
            setCurrentTime(next);
          }}
        >
          <div className="h-full w-full" aria-hidden />
        </DoubleTapSeekSurface>
        <audio
          ref={lockAudioRef}
          playsInline
          preload="auto"
          className="lock-screen-audio"
          onEnded={() => {
            if (!wantPlayingRef.current) return;
            wantPlayingRef.current = false;
            videoRef.current?.pause();
            clearProgress();
            if (slugRef.current) {
              queueRef.current?.notifyMediaEnded(slugRef.current);
            }
            onEndedRef.current?.();
          }}
        />
      </div>
    </div>
  );
}
