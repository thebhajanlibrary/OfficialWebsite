"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { dispatchQueueHandoff } from "@/lib/queue-handoff";
import {
  markBhajanAutoplay,
  shuffleArray,
  type QueueTrack,
} from "@/lib/play-queue";
import {
  keepMediaPlayingWhenLocked,
  pageIsHidden,
  prepareUnlockableMedia,
} from "@/lib/ios-playback";
import { applyCastArtwork } from "@/lib/media-artwork";

export type { QueueTrack };
/** @deprecated alias */
export type QueueAudioTrack = QueueTrack;

const CROSSFADE_SEC = 2.75;
const SKIP_FADE_SEC = 0.45;

type Session = {
  queueKey: string;
  tracks: QueueTrack[];
  index: number;
};

type QueuePlaybackApi = {
  session: Session | null;
  playing: boolean;
  shuffle: boolean;
  currentTime: number;
  duration: number;
  loadError: boolean;
  /** Attach or sync a continuous-play session (album / folder / artist / playlist). */
  attach: (opts: {
    queueKey: string;
    tracks: QueueTrack[];
    slug: string;
    autoPlay?: boolean;
  }) => void;
  /** Replace queue and start from the first track (Play all / Shuffle play). */
  playAll: (opts: {
    queueKey: string;
    tracks: QueueTrack[];
    shuffle?: boolean;
  }) => void;
  /** Insert after the current track (Apple Music “Play Next”). */
  playNext: (track: QueueTrack) => void;
  /** Append to the end of the queue (Apple Music “Play Later”). */
  playLater: (track: QueueTrack) => void;
  /** Insert a whole collection after the current track. */
  playCollectionNext: (tracks: QueueTrack[]) => void;
  /** Append a whole collection to the end. */
  playCollectionLater: (tracks: QueueTrack[]) => void;
  removeAt: (index: number) => void;
  setShuffle: (on: boolean) => void;
  /** Pause audio engines without clearing the queue (for YouTube / video claim). */
  pauseOutput: () => void;
  /** Pause every site `<video>` on the page. */
  pauseSiteVideos: () => void;
  clear: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  prev: () => void;
  next: () => void;
  /** Notify queue that non-audio media ended — advance if this is the session track. */
  notifyMediaEnded: (slug: string) => void;
  /** Active audio element for Chromecast / AirPlay */
  getActiveMedia: () => HTMLAudioElement | null;
};

const QueuePlaybackContext = createContext<QueuePlaybackApi | null>(null);

export function useQueuePlayback(): QueuePlaybackApi {
  const ctx = useContext(QueuePlaybackContext);
  if (!ctx) {
    throw new Error("useQueuePlayback must be used within QueuePlaybackProvider");
  }
  return ctx;
}

/** Safe when the player tree mounts before the provider (e.g. Fast Refresh). */
export function useQueuePlaybackOptional(): QueuePlaybackApi | null {
  return useContext(QueuePlaybackContext);
}

function pauseAllSiteVideos() {
  if (typeof document === "undefined") return;
  document.querySelectorAll("video").forEach((el) => {
    try {
      el.pause();
    } catch {
      // ignore
    }
  });
}

/** HTMLMediaElement.volume must stay in [0, 1] — float math can overshoot. */
function setMediaVolume(el: HTMLMediaElement, value: number) {
  el.volume = Math.min(1, Math.max(0, value));
}

function insertTracksAfter(
  list: QueueTrack[],
  index: number,
  incoming: QueueTrack[]
): { tracks: QueueTrack[]; index: number } {
  let tracks = [...list];
  let idx = index;
  const seen = new Set<string>();

  for (const track of incoming) {
    if (seen.has(track.slug)) continue;
    seen.add(track.slug);
    const existing = tracks.findIndex((t) => t.slug === track.slug);
    if (existing >= 0) {
      if (existing === idx) continue;
      tracks.splice(existing, 1);
      if (existing < idx) idx -= 1;
    }
  }

  const toInsert = incoming.filter(
    (t, i, arr) =>
      arr.findIndex((x) => x.slug === t.slug) === i &&
      tracks[idx]?.slug !== t.slug
  );
  tracks.splice(idx + 1, 0, ...toInsert);
  return { tracks, index: idx };
}

function appendTracks(
  list: QueueTrack[],
  index: number,
  incoming: QueueTrack[]
): { tracks: QueueTrack[]; index: number } {
  let tracks = [...list];
  let idx = index;

  for (const track of incoming) {
    const existing = tracks.findIndex((t) => t.slug === track.slug);
    if (existing === idx) continue;
    if (existing >= 0) {
      tracks.splice(existing, 1);
      if (existing < idx) idx -= 1;
    }
    tracks.push(track);
  }
  return { tracks, index: idx };
}

export function QueuePlaybackProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const aRef = useRef<HTMLAudioElement>(null);
  const bRef = useRef<HTMLAudioElement>(null);
  const activeIsA = useRef(true);
  const sessionRef = useRef<Session | null>(null);
  const crossfadingRef = useRef(false);
  const fadeRafRef = useRef<number | null>(null);
  const advancingRef = useRef(false);
  const playingRef = useRef(false);
  const routerReadyRef = useRef(false);

  useEffect(() => {
    routerReadyRef.current = true;
  }, []);

  const [session, setSession] = useState<Session | null>(null);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffleState] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const activeEl = useCallback(
    () => (activeIsA.current ? aRef.current : bRef.current),
    []
  );
  const inactiveEl = useCallback(
    () => (activeIsA.current ? bRef.current : aRef.current),
    []
  );

  const cancelFade = useCallback(() => {
    if (fadeRafRef.current != null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
    crossfadingRef.current = false;
  }, []);

  const pauseOutput = useCallback(() => {
    cancelFade();
    playingRef.current = false;
    aRef.current?.pause();
    bRef.current?.pause();
    setPlaying(false);
  }, [cancelFade]);

  const pauseSiteVideos = useCallback(() => {
    pauseAllSiteVideos();
  }, []);

  const syncUrl = useCallback(
    (track: QueueTrack, autoplay = false) => {
      // Navigating while locked can tear down playback on iOS
      if (pageIsHidden() || !routerReadyRef.current) return;
      if (autoplay) markBhajanAutoplay();
      let href = track.href;
      try {
        const u = new URL(track.href, window.location.origin);
        u.searchParams.delete("autoplay");
        u.searchParams.delete("play");
        href = `${u.pathname}${u.search}`;
      } catch {
        // keep original href
      }
      const here = `${window.location.pathname}${window.location.search}`;
      if (href === here) return;
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [router]
  );

  const handoffTrack = useCallback((track: QueueTrack) => {
    if (track.kind === "youtube" && track.youtubeEmbedUrl) {
      queueMicrotask(() => dispatchQueueHandoff(track));
    }
  }, []);

  const preloadNext = useCallback(
    (sess: Session) => {
      const next = sess.tracks[sess.index + 1];
      const idle = inactiveEl();
      if (!idle) return;
      if (next?.audioSrc) {
        if (idle.src !== new URL(next.audioSrc, window.location.origin).href) {
          idle.src = next.audioSrc;
          applyCastArtwork(idle, {
            poster: next.cover || next.miniCover,
            title: next.title,
            artist: next.artist,
          });
          idle.load();
        }
      } else {
        idle.removeAttribute("src");
        idle.load();
      }
    },
    [inactiveEl]
  );

  const loadIndex = useCallback(
    async (
      sess: Session,
      index: number,
      opts: { autoPlay?: boolean; replaceUrl?: boolean } = {}
    ) => {
      cancelFade();
      advancingRef.current = false;
      const track = sess.tracks[index];
      const audio = activeEl();
      if (!track || !audio) return;

      // Non-audio (or audio without src) — hand off to page player via navigation
      if (!track.audioSrc || track.kind !== "audio") {
        aRef.current?.pause();
        bRef.current?.pause();
        setPlaying(false);
        setSession({ ...sess, index });
        sessionRef.current = { ...sess, index };
        syncUrl(track, Boolean(opts.autoPlay));
        handoffTrack(track);
        return;
      }

      pauseAllSiteVideos();
      setLoadError(false);
      setMediaVolume(audio, 1);
      if (
        audio.src !== new URL(track.audioSrc, window.location.origin).href
      ) {
        audio.src = track.audioSrc;
        audio.load();
      }
      applyCastArtwork(audio, {
        poster: track.cover || track.miniCover,
        title: track.title,
        artist: track.artist,
      });
      audio.currentTime = 0;

      const nextSession = { ...sess, index };
      sessionRef.current = nextSession;
      setSession(nextSession);
      setCurrentTime(0);
      setDuration(audio.duration || 0);
      preloadNext(nextSession);

      if (opts.replaceUrl) syncUrl(track, Boolean(opts.autoPlay));

      if (opts.autoPlay) {
        try {
          await audio.play();
          setPlaying(true);
        } catch {
          setPlaying(false);
        }
      }
    },
    [activeEl, cancelFade, handoffTrack, preloadNext, syncUrl]
  );

  const finishToIndex = useCallback(
    async (
      nextIndex: number,
      opts: { fadeOutOnly?: boolean; fadeSec?: number } = {}
    ) => {
      const sess = sessionRef.current;
      if (!sess) return;
      const outgoing = activeEl();
      const incoming = inactiveEl();
      const nextTrack = sess.tracks[nextIndex];
      if (!outgoing || !nextTrack) return;

      const currentTrack = sess.tracks[sess.index];
      const currentIsAudio =
        currentTrack?.kind === "audio" && Boolean(currentTrack?.audioSrc);
      const fadeSec = opts.fadeSec ?? CROSSFADE_SEC;
      const nextIsAudio =
        nextTrack.kind === "audio" && Boolean(nextTrack.audioSrc);
      const skipFade = pageIsHidden();

      if (!currentIsAudio && nextIsAudio && !opts.fadeOutOnly) {
        advancingRef.current = false;
        await loadIndex({ ...sess, index: nextIndex }, nextIndex, {
          autoPlay: true,
          replaceUrl: true,
        });
        return;
      }

      if (!nextIsAudio || opts.fadeOutOnly) {
        if (skipFade) {
          outgoing.pause();
          setMediaVolume(outgoing, 1);
          advancingRef.current = false;
          setPlaying(false);
          const nextSession = { ...sess, index: nextIndex };
          sessionRef.current = nextSession;
          setSession(nextSession);
          syncUrl(nextTrack);
          handoffTrack(nextTrack);
          return;
        }
        crossfadingRef.current = true;
        const startVol = Math.min(1, Math.max(0, outgoing.volume));
        const start = performance.now();
        const ms = Math.max(200, Math.min(fadeSec, SKIP_FADE_SEC) * 1000);
        await new Promise<void>((resolve) => {
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / ms);
            setMediaVolume(outgoing, startVol * (1 - t));
            if (t < 1) {
              fadeRafRef.current = requestAnimationFrame(step);
            } else {
              outgoing.pause();
              setMediaVolume(outgoing, 1);
              crossfadingRef.current = false;
              resolve();
            }
          };
          fadeRafRef.current = requestAnimationFrame(step);
        });
        advancingRef.current = false;
        setPlaying(false);
        const nextSession = { ...sess, index: nextIndex };
        sessionRef.current = nextSession;
        setSession(nextSession);
        syncUrl(nextTrack);
        handoffTrack(nextTrack);
        return;
      }

      if (!incoming || !nextTrack.audioSrc) return;
      if (
        incoming.src !==
        new URL(nextTrack.audioSrc, window.location.origin).href
      ) {
        incoming.src = nextTrack.audioSrc;
        incoming.load();
      }
      applyCastArtwork(incoming, {
        poster: nextTrack.cover || nextTrack.miniCover,
        title: nextTrack.title,
        artist: nextTrack.artist,
      });
      setMediaVolume(incoming, skipFade ? 1 : 0);
      incoming.currentTime = 0;
      try {
        await incoming.play();
      } catch {
        outgoing.pause();
        activeIsA.current = !activeIsA.current;
        await loadIndex({ ...sess, index: nextIndex }, nextIndex, {
          autoPlay: true,
          replaceUrl: true,
        });
        return;
      }

      if (skipFade) {
        outgoing.pause();
        outgoing.currentTime = 0;
        setMediaVolume(outgoing, 1);
        setMediaVolume(incoming, 1);
        activeIsA.current = !activeIsA.current;
        advancingRef.current = false;
        const nextSession = { ...sess, index: nextIndex };
        sessionRef.current = nextSession;
        setSession(nextSession);
        setPlaying(true);
        setCurrentTime(incoming.currentTime || 0);
        setDuration(incoming.duration || 0);
        preloadNext(nextSession);
        syncUrl(nextTrack);
        return;
      }

      crossfadingRef.current = true;
      const startVol = Math.min(1, Math.max(0, outgoing.volume));
      const start = performance.now();
      const ms = Math.max(400, fadeSec * 1000);

      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / ms);
          setMediaVolume(outgoing, startVol * (1 - t));
          setMediaVolume(incoming, t);
          if (t < 1) {
            fadeRafRef.current = requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        fadeRafRef.current = requestAnimationFrame(step);
      });

      outgoing.pause();
      outgoing.currentTime = 0;
      setMediaVolume(outgoing, 1);
      setMediaVolume(incoming, 1);
      activeIsA.current = !activeIsA.current;
      crossfadingRef.current = false;
      advancingRef.current = false;

      const nextSession = { ...sess, index: nextIndex };
      sessionRef.current = nextSession;
      setSession(nextSession);
      setPlaying(true);
      setCurrentTime(incoming.currentTime || 0);
      setDuration(incoming.duration || 0);
      preloadNext(nextSession);
      syncUrl(nextTrack);
    },
    [activeEl, inactiveEl, handoffTrack, loadIndex, preloadNext, syncUrl]
  );

  const maybeStartCrossfade = useCallback(() => {
    const sess = sessionRef.current;
    const audio = activeEl();
    if (!sess || !audio || crossfadingRef.current || advancingRef.current) {
      return;
    }
    const dur = audio.duration;
    if (!Number.isFinite(dur) || dur <= 0) return;

    const remaining = dur - audio.currentTime;
    const fadeFor = Math.min(CROSSFADE_SEC, Math.max(0.9, dur * 0.18));
    if (remaining > fadeFor) return;

    const nextIndex = sess.index + 1;
    if (nextIndex >= sess.tracks.length) return;
    const next = sess.tracks[nextIndex];
    if (!next?.audioSrc || next.kind !== "audio") {
      return;
    }

    advancingRef.current = true;
    void finishToIndex(nextIndex, { fadeSec: Math.max(0.9, remaining) });
  }, [activeEl, finishToIndex]);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const onTime = (el: HTMLAudioElement) => {
      if (el !== activeEl()) return;
      setCurrentTime(el.currentTime);
      maybeStartCrossfade();
    };
    const onMeta = (el: HTMLAudioElement) => {
      if (el !== activeEl()) return;
      setDuration(el.duration || 0);
      setLoadError(false);
    };
    const onPlay = (el: HTMLAudioElement) => {
      if (el !== activeEl()) return;
      pauseAllSiteVideos();
      setPlaying(true);
      window.dispatchEvent(new CustomEvent("bhajan-audio-playing"));
    };
    const onPause = (el: HTMLAudioElement) => {
      if (el !== activeEl()) return;
      if (crossfadingRef.current) return;
      playingRef.current = false;
      setPlaying(false);
    };
    const onEnded = (el: HTMLAudioElement) => {
      if (el !== activeEl() || crossfadingRef.current) return;
      const sess = sessionRef.current;
      if (!sess) return;
      const nextIndex = sess.index + 1;
      if (nextIndex < sess.tracks.length) {
        advancingRef.current = true;
        const next = sess.tracks[nextIndex];
        void finishToIndex(nextIndex, {
          fadeOutOnly: !next?.audioSrc || next.kind !== "audio",
          fadeSec: SKIP_FADE_SEC,
        });
      } else {
        setPlaying(false);
      }
    };
    const onError = (el: HTMLAudioElement) => {
      if (el !== activeEl()) return;
      setLoadError(true);
      setPlaying(false);
    };

    const bind = (el: HTMLAudioElement) => {
      const time = () => onTime(el);
      const meta = () => onMeta(el);
      const play = () => onPlay(el);
      const pause = () => onPause(el);
      const ended = () => onEnded(el);
      const error = () => onError(el);
      el.addEventListener("timeupdate", time);
      el.addEventListener("loadedmetadata", meta);
      el.addEventListener("play", play);
      el.addEventListener("pause", pause);
      el.addEventListener("ended", ended);
      el.addEventListener("error", error);
      return () => {
        el.removeEventListener("timeupdate", time);
        el.removeEventListener("loadedmetadata", meta);
        el.removeEventListener("play", play);
        el.removeEventListener("pause", pause);
        el.removeEventListener("ended", ended);
        el.removeEventListener("error", error);
      };
    };

    const unbindA = bind(a);
    const unbindB = bind(b);
    return () => {
      unbindA();
      unbindB();
      cancelFade();
    };
  }, [activeEl, cancelFade, finishToIndex, maybeStartCrossfade]);

  playingRef.current = playing;

  const attach = useCallback(
    (opts: {
      queueKey: string;
      tracks: QueueTrack[];
      slug: string;
      autoPlay?: boolean;
    }) => {
      const index = opts.tracks.findIndex((t) => t.slug === opts.slug);
      if (index < 0) return;

      const current = sessionRef.current;
      const currentSlug = current?.tracks[current.index]?.slug;
      const wantPlay = Boolean(opts.autoPlay);
      const nextTrack = opts.tracks[index];
      const resumeIfNeeded = () => {
        // YouTube / site video are owned by the page player — never mark the
        // audio queue as "playing" or PersistentYouTubeHost will tear itself down.
        if (nextTrack?.kind !== "audio" || !nextTrack.audioSrc) {
          playingRef.current = false;
          setPlaying(false);
          return;
        }
        const el = activeEl();
        if (el?.paused) void el.play().catch(() => undefined);
        playingRef.current = true;
        setPlaying(true);
      };
      const audioSrcChanged = (from: QueueTrack | undefined, to: QueueTrack | undefined) =>
        Boolean(to?.audioSrc) && from?.audioSrc !== to?.audioSrc;

      // Crossfade already landed on this track — don't reload or it will stop
      // (unless this is an alternate recording of the same slug)
      if (current && currentSlug === opts.slug) {
        const currentTrack = current.tracks[current.index];
        if (
          audioSrcChanged(currentTrack, nextTrack) ||
          current.queueKey !== opts.queueKey
        ) {
          void loadIndex(
            { queueKey: opts.queueKey, tracks: opts.tracks, index },
            index,
            {
              autoPlay: wantPlay || playingRef.current,
              replaceUrl: false,
            }
          );
          return;
        }
        // Already on this track — do not force-resume. Re-attach often re-runs
        // with autoPlay still true (URL / effect), which used to undo pause.
        const el = activeEl();
        if (el && !el.paused) {
          playingRef.current = true;
          setPlaying(true);
        }
        return;
      }

      if (current && currentSlug && currentSlug !== opts.slug && !wantPlay) {
        return;
      }

      if (current && current.queueKey === opts.queueKey) {
        const idxInSession = current.tracks.findIndex((t) => t.slug === opts.slug);
        const idx = idxInSession >= 0 ? idxInSession : index;
        if (idx === current.index) {
          const currentTrack = current.tracks[current.index];
          if (audioSrcChanged(currentTrack, nextTrack)) {
            void loadIndex(
              { queueKey: opts.queueKey, tracks: opts.tracks, index: idx },
              idx,
              {
                autoPlay: wantPlay || playingRef.current,
                replaceUrl: false,
              }
            );
            return;
          }
          // Same index — sync playing state only; don't undo a user pause
          const el = activeEl();
          if (el && !el.paused) {
            playingRef.current = true;
            setPlaying(true);
          }
          return;
        }
        void loadIndex(current, idx, {
          autoPlay: wantPlay || playingRef.current,
          replaceUrl: false,
        });
        return;
      }

      activeIsA.current = true;
      void loadIndex(
        { queueKey: opts.queueKey, tracks: opts.tracks, index },
        index,
        { autoPlay: wantPlay, replaceUrl: false }
      );
    },
    [activeEl, loadIndex]
  );

  const commitTracks = useCallback(
    (tracks: QueueTrack[], index: number) => {
      const sess = sessionRef.current;
      if (!sess) return;
      const nextSession = { ...sess, tracks, index };
      sessionRef.current = nextSession;
      setSession(nextSession);
      preloadNext(nextSession);
    },
    [preloadNext]
  );

  const playAll = useCallback(
    (opts: {
      queueKey: string;
      tracks: QueueTrack[];
      shuffle?: boolean;
    }) => {
      if (opts.tracks.length === 0) return;
      const tracks = opts.shuffle
        ? shuffleArray(opts.tracks)
        : [...opts.tracks];
      setShuffleState(Boolean(opts.shuffle));
      activeIsA.current = true;
      void loadIndex(
        { queueKey: opts.queueKey, tracks, index: 0 },
        0,
        { autoPlay: true, replaceUrl: true }
      );
    },
    [loadIndex]
  );

  const playNext = useCallback(
    (track: QueueTrack) => {
      const sess = sessionRef.current;
      if (!sess) {
        activeIsA.current = true;
        void loadIndex(
          { queueKey: `upnext:${track.slug}`, tracks: [track], index: 0 },
          0,
          { autoPlay: true, replaceUrl: false }
        );
        return;
      }

      const { tracks, index } = insertTracksAfter(
        sess.tracks,
        sess.index,
        [track]
      );
      commitTracks(tracks, index);
    },
    [commitTracks, loadIndex]
  );

  const playLater = useCallback(
    (track: QueueTrack) => {
      const sess = sessionRef.current;
      if (!sess) {
        activeIsA.current = true;
        void loadIndex(
          { queueKey: `upnext:${track.slug}`, tracks: [track], index: 0 },
          0,
          { autoPlay: true, replaceUrl: false }
        );
        return;
      }

      const { tracks, index } = appendTracks(sess.tracks, sess.index, [track]);
      commitTracks(tracks, index);
    },
    [commitTracks, loadIndex]
  );

  const playCollectionNext = useCallback(
    (incoming: QueueTrack[]) => {
      if (incoming.length === 0) return;
      const sess = sessionRef.current;
      if (!sess) {
        playAll({
          queueKey: `upnext:${incoming[0]!.slug}`,
          tracks: incoming,
        });
        return;
      }
      const { tracks, index } = insertTracksAfter(
        sess.tracks,
        sess.index,
        incoming
      );
      commitTracks(tracks, index);
    },
    [commitTracks, playAll]
  );

  const playCollectionLater = useCallback(
    (incoming: QueueTrack[]) => {
      if (incoming.length === 0) return;
      const sess = sessionRef.current;
      if (!sess) {
        playAll({
          queueKey: `upnext:${incoming[0]!.slug}`,
          tracks: incoming,
        });
        return;
      }
      const { tracks, index } = appendTracks(sess.tracks, sess.index, incoming);
      commitTracks(tracks, index);
    },
    [commitTracks, playAll]
  );

  const removeAt = useCallback(
    (removeIndex: number) => {
      const sess = sessionRef.current;
      if (!sess) return;
      if (removeIndex < 0 || removeIndex >= sess.tracks.length) return;
      if (sess.tracks.length === 1) {
        cancelFade();
        aRef.current?.pause();
        bRef.current?.pause();
        sessionRef.current = null;
        setSession(null);
        setPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        return;
      }

      const tracks = sess.tracks.filter((_, i) => i !== removeIndex);
      let index = sess.index;
      if (removeIndex < index) index -= 1;
      else if (removeIndex === index) {
        index = Math.min(index, tracks.length - 1);
        commitTracks(tracks, index);
        void loadIndex(
          { ...sess, tracks, index },
          index,
          { autoPlay: playingRef.current, replaceUrl: true }
        );
        return;
      }
      commitTracks(tracks, index);
    },
    [cancelFade, commitTracks, loadIndex]
  );

  const setShuffle = useCallback(
    (on: boolean) => {
      setShuffleState(on);
      const sess = sessionRef.current;
      if (!sess || !on) return;
      const head = sess.tracks.slice(0, sess.index + 1);
      const tail = shuffleArray(sess.tracks.slice(sess.index + 1));
      commitTracks([...head, ...tail], sess.index);
    },
    [commitTracks]
  );

  const clear = useCallback(() => {
    cancelFade();
    aRef.current?.pause();
    bRef.current?.pause();
    sessionRef.current = null;
    setSession(null);
    setPlaying(false);
    setShuffleState(false);
    setCurrentTime(0);
    setDuration(0);
  }, [cancelFade]);

  const toggle = useCallback(() => {
    const sess = sessionRef.current;
    const track = sess?.tracks[sess.index];
    if (track && track.kind !== "audio") {
      // Non-audio — navigate so the page player can toggle
      syncUrl(track);
      return;
    }
    const audio = activeEl();
    if (!audio || loadError) return;
    if (audio.paused) {
      pauseAllSiteVideos();
      playingRef.current = true;
      void audio.play().catch(() => undefined);
    } else {
      // Mark paused immediately so a re-attach / lock-kick cannot resume
      playingRef.current = false;
      setPlaying(false);
      audio.pause();
    }
  }, [activeEl, loadError, syncUrl]);

  const seek = useCallback(
    (time: number) => {
      if (crossfadingRef.current) return;
      const audio = activeEl();
      if (!audio) return;
      audio.currentTime = time;
      setCurrentTime(time);
    },
    [activeEl]
  );

  const prev = useCallback(() => {
    const sess = sessionRef.current;
    if (!sess || sess.index <= 0 || crossfadingRef.current) return;
    void loadIndex(sess, sess.index - 1, {
      autoPlay: true,
      replaceUrl: true,
    });
  }, [loadIndex]);

  const next = useCallback(() => {
    const sess = sessionRef.current;
    if (!sess || crossfadingRef.current) return;
    if (sess.index >= sess.tracks.length - 1) return;
    advancingRef.current = true;
    const nextTrack = sess.tracks[sess.index + 1];
    void finishToIndex(sess.index + 1, {
      fadeOutOnly: !nextTrack?.audioSrc || nextTrack.kind !== "audio",
      fadeSec: 0.7,
    });
  }, [finishToIndex]);

  const notifyMediaEnded = useCallback(
    (slug: string) => {
      const sess = sessionRef.current;
      if (!sess) return;
      if (sess.tracks[sess.index]?.slug !== slug) return;
      if (sess.index >= sess.tracks.length - 1) return;
      advancingRef.current = true;
      const nextTrack = sess.tracks[sess.index + 1];
      void finishToIndex(sess.index + 1, {
        fadeOutOnly: !nextTrack?.audioSrc || nextTrack.kind !== "audio",
        fadeSec: SKIP_FADE_SEC,
      });
    },
    [finishToIndex]
  );

  const api = useMemo<QueuePlaybackApi>(
    () => ({
      session,
      playing,
      shuffle,
      currentTime,
      duration,
      loadError,
      attach,
      playAll,
      playNext,
      playLater,
      playCollectionNext,
      playCollectionLater,
      removeAt,
      setShuffle,
      pauseOutput,
      pauseSiteVideos,
      clear,
      toggle,
      seek,
      prev,
      next,
      notifyMediaEnded,
      getActiveMedia: activeEl,
    }),
    [
      session,
      playing,
      shuffle,
      currentTime,
      duration,
      loadError,
      attach,
      playAll,
      playNext,
      playLater,
      playCollectionNext,
      playCollectionLater,
      removeAt,
      setShuffle,
      pauseOutput,
      pauseSiteVideos,
      clear,
      toggle,
      seek,
      prev,
      next,
      notifyMediaEnded,
      activeEl,
    ]
  );

  useEffect(() => {
    for (const el of [aRef.current, bRef.current]) {
      if (!el) continue;
      prepareUnlockableMedia(el);
    }
  }, []);

  useEffect(() => {
    return keepMediaPlayingWhenLocked(activeEl, () => playingRef.current);
  }, [activeEl]);

  return (
    <QueuePlaybackContext.Provider value={api}>
      {children}
      <audio ref={aRef} preload="auto" playsInline className="lock-screen-audio" />
      <audio ref={bRef} preload="auto" playsInline className="lock-screen-audio" />
    </QueuePlaybackContext.Provider>
  );
}
