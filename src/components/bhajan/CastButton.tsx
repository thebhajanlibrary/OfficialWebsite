"use client";

import { Cast } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from "react";
import { applyCastArtwork } from "@/lib/media-artwork";

type WebkitMediaElement = HTMLMediaElement & {
  webkitShowPlaybackTargetPicker?: () => void;
  webkitCurrentPlaybackTargetIsWireless?: boolean;
};

type RemotePlaybackLike = {
  watchAvailability: (
    callback: (available: boolean) => void
  ) => Promise<number>;
  cancelWatchAvailability: (id?: number) => Promise<void>;
  prompt: () => Promise<void>;
  state: "connecting" | "connected" | "disconnected";
  addEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => void;
  removeEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => void;
};

function getRemote(el: HTMLMediaElement): RemotePlaybackLike | null {
  const remote = (el as HTMLMediaElement & { remote?: RemotePlaybackLike })
    .remote;
  return remote ?? null;
}

function useCastAvailability(getMedia: () => HTMLMediaElement | null) {
  const [available, setAvailable] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let watchId: number | undefined;
    let el: HTMLMediaElement | null = null;
    let remote: RemotePlaybackLike | null = null;

    const onAirPlayAvailability = (event: Event) => {
      const availability = (event as Event & { availability?: string })
        .availability;
      if (!cancelled) {
        setAvailable(availability === "available");
      }
    };

    const bind = () => {
      const next = getMedia();
      if (!next || next === el) return;
      cleanup();
      el = next;

      // Prefer Remote Playback API (Chromecast / some AirPlay)
      remote = getRemote(el);
      if (remote) {
        setConnected(remote.state === "connected");
        const onState = () => {
          if (!remote || cancelled) return;
          setConnected(remote.state === "connected");
        };
        remote.addEventListener("connecting", onState);
        remote.addEventListener("connect", onState);
        remote.addEventListener("disconnect", onState);

        void remote
          .watchAvailability((isAvailable) => {
            if (!cancelled) setAvailable(isAvailable);
          })
          .then((id) => {
            watchId = id;
          })
          .catch(() => {
            // Device can't continuously watch — still offer the picker
            if (!cancelled) setAvailable(true);
          });
      }

      // Safari AirPlay
      el.addEventListener(
        "webkitplaybacktargetavailabilitychanged",
        onAirPlayAvailability
      );
      if (
        typeof (el as WebkitMediaElement).webkitShowPlaybackTargetPicker ===
        "function"
      ) {
        if (!cancelled) setAvailable(true);
      }
    };

    const cleanup = () => {
      if (remote && watchId != null) {
        void remote.cancelWatchAvailability(watchId).catch(() => undefined);
      }
      if (el) {
        el.removeEventListener(
          "webkitplaybacktargetavailabilitychanged",
          onAirPlayAvailability
        );
      }
      remote = null;
      el = null;
      watchId = undefined;
    };

    bind();
    const timer = window.setInterval(bind, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      cleanup();
    };
  }, [getMedia]);

  const promptCast = useCallback(async () => {
    const media = getMedia();
    if (!media) return;

    const meta = navigator.mediaSession?.metadata;
    applyCastArtwork(media, {
      poster:
        meta?.artwork?.[0]?.src || media.getAttribute("poster"),
      title: meta?.title || media.getAttribute("title"),
      artist: meta?.artist || media.getAttribute("artist"),
    });

    const remote = getRemote(media);
    if (remote) {
      try {
        await remote.prompt();
        return;
      } catch {
        // User cancelled or unsupported — try AirPlay picker next
      }
    }

    const webkit = media as WebkitMediaElement;
    if (typeof webkit.webkitShowPlaybackTargetPicker === "function") {
      webkit.webkitShowPlaybackTargetPicker();
    }
  }, [getMedia]);

  return { available, connected, promptCast };
}

type Props = {
  /** Resolve the active audio/video element to cast */
  getMedia: () => HTMLMediaElement | null;
  className?: string;
};

/** Chromecast (Chrome/Edge) + AirPlay / Apple TV (Safari) picker */
export function CastButton({ getMedia, className = "" }: Props) {
  const { available, connected, promptCast } = useCastAvailability(getMedia);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() => void promptCast()}
      className={`rounded-md p-1.5 text-white transition hover:bg-white/10 ${
        connected ? "text-accent" : ""
      } ${className}`}
      aria-label={connected ? "Stop casting" : "Cast to TV or speaker"}
      title={connected ? "Connected — tap to change device" : "Cast"}
    >
      <Cast className="h-4 w-4" aria-hidden />
    </button>
  );
}

/** Convenience when you already have a React ref */
export function CastButtonForRef({
  mediaRef,
  className,
}: {
  mediaRef: RefObject<HTMLMediaElement | null>;
  className?: string;
}) {
  const getMedia = useCallback(() => mediaRef.current, [mediaRef]);
  return <CastButton getMedia={getMedia} className={className} />;
}

/** Publish Now Playing metadata — prefer `@/components/bhajan/useMediaSession` */
export { useMediaSessionMeta } from "@/components/bhajan/useMediaSession";
