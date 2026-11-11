"use client";

import { useEffect, useRef } from "react";
import { mediaSessionArtwork } from "@/lib/media-artwork";

type MediaSessionHandlers = {
  play?: () => void;
  pause?: () => void;
  stop?: () => void;
  previous?: () => void;
  next?: () => void;
  seek?: (time: number) => void;
  seekOffset?: (offset: number) => void;
};

type MediaSessionOpts = {
  title: string;
  artist?: string | null;
  album?: string | null;
  cover?: string | null;
  playing: boolean;
  currentTime?: number;
  duration?: number;
  /** When false, skip/previous handlers are cleared */
  canPrevious?: boolean;
  canNext?: boolean;
  handlers?: MediaSessionHandlers;
  /** When false, leave whatever other player owns the OS session */
  enabled?: boolean;
};

/**
 * System "now playing" — iPhone lock screen / Control Center,
 * Android notification, Windows/macOS media flyout, Chromecast artwork.
 */
export function useMediaSession(opts: MediaSessionOpts) {
  const {
    title,
    artist,
    album,
    cover,
    playing,
    currentTime = 0,
    duration = 0,
    canPrevious = false,
    canNext = false,
    handlers,
    enabled = true,
  } = opts;

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const timeRef = useRef({ currentTime, duration });
  timeRef.current = { currentTime, duration };

  // Metadata + playback state
  useEffect(() => {
    if (!enabled) return;
    if (!("mediaSession" in navigator)) return;

    const artwork = mediaSessionArtwork(cover);

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: artist ?? "Bhajan Library",
      album: album ?? "Bhajan Library",
      artwork,
    });

    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [enabled, title, artist, album, cover, playing]);

  // Action handlers (lock screen / headset / OS media keys)
  useEffect(() => {
    if (!enabled) return;
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;

    const set = (
      action: MediaSessionAction,
      handler: MediaSessionActionHandler | null
    ) => {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        // Unsupported action on this browser
      }
    };

    set("play", () => handlersRef.current?.play?.());
    set("pause", () => handlersRef.current?.pause?.());
    set("stop", () => handlersRef.current?.stop?.());
    set(
      "previoustrack",
      canPrevious ? () => handlersRef.current?.previous?.() : null
    );
    set(
      "nexttrack",
      canNext ? () => handlersRef.current?.next?.() : null
    );

    set("seekto", (details) => {
      if (typeof details.seekTime === "number") {
        handlersRef.current?.seek?.(details.seekTime);
      }
    });

    set("seekbackward", (details) => {
      const offset = details.seekOffset ?? 30;
      const h = handlersRef.current;
      if (h?.seekOffset) h.seekOffset(-offset);
      else if (h?.seek) {
        h.seek(Math.max(0, timeRef.current.currentTime - offset));
      }
    });

    set("seekforward", (details) => {
      const offset = details.seekOffset ?? 30;
      const h = handlersRef.current;
      const { currentTime: t, duration: d } = timeRef.current;
      if (h?.seekOffset) h.seekOffset(offset);
      else if (h?.seek) {
        h.seek(Math.min(d > 0 ? d : t + offset, t + offset));
      }
    });

    return () => {
      set("play", null);
      set("pause", null);
      set("stop", null);
      set("previoustrack", null);
      set("nexttrack", null);
      set("seekto", null);
      set("seekbackward", null);
      set("seekforward", null);
    };
  }, [enabled, canPrevious, canNext]);

  // Scrubber position for OS media UI
  useEffect(() => {
    if (!enabled) return;
    if (!("mediaSession" in navigator)) return;
    if (!Number.isFinite(duration) || duration <= 0) return;

    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position: Math.min(Math.max(0, currentTime), duration),
      });
    } catch {
      // Some browsers throw if position > duration during seeks
    }
  }, [enabled, currentTime, duration, playing]);
}

/** Back-compat alias */
export function useMediaSessionMeta(opts: {
  title: string;
  artist?: string | null;
  cover?: string | null;
  playing: boolean;
  currentTime?: number;
  duration?: number;
  canPrevious?: boolean;
  canNext?: boolean;
  handlers?: MediaSessionHandlers;
}) {
  useMediaSession(opts);
}
