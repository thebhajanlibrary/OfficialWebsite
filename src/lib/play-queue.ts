import { getAlbum, isOmittedFromLibrary } from "@/lib/albums";
import {
  canonicalArtistName,
  creditedArtistNames,
  getArtistProfile,
} from "@/lib/artists";
import { getFolder, isLibraryQueueSkipTrack } from "@/lib/folders";
import { getFestivalById } from "@/lib/festivals";
import {
  isLocalAudioUrl,
  isLocalVideoUrl,
  youtubeEmbedUrl,
} from "@/lib/utils";

export type PlayQueueKind =
  | "album"
  | "folder"
  | "artist"
  | "playlist"
  | "category"
  | "festival"
  | "library";

export type PlayQueueRef = {
  kind: PlayQueueKind;
  id: string;
};

export type QueueMediaKind = "audio" | "youtube" | "video";

/** Unified queue item — local audio, YouTube, or site video */
export type QueueTrack = {
  slug: string;
  title: string;
  artist: string | null;
  href: string;
  kind: QueueMediaKind;
  /** Local mp3/etc — enables crossfade between consecutive audio tracks */
  audioSrc: string | null;
  /** Local mp4/webm */
  videoSrc: string | null;
  /** YouTube embed URL */
  youtubeEmbedUrl: string | null;
  cover: string | null;
  miniCover?: string | null;
  coverAspect?: "wide" | "square";
};

/** @deprecated Use QueueTrack — kept as alias for existing imports */
export type QueueAudioTrack = QueueTrack;

export function inferQueueMediaKind(
  audioUrl: string | null | undefined
): QueueMediaKind {
  if (isLocalAudioUrl(audioUrl)) return "audio";
  if (isLocalVideoUrl(audioUrl)) return "video";
  if (youtubeEmbedUrl(audioUrl)) return "youtube";
  return "audio";
}

/** Build a queue track from bhajan media fields */
export function buildQueueTrack(opts: {
  slug: string;
  title: string;
  artist?: string | null;
  audioUrl?: string | null;
  cover?: string | null;
  miniCover?: string | null;
  coverAspect?: "wide" | "square";
  queue?: PlayQueueRef | null;
  autoplay?: boolean;
}): QueueTrack {
  const audioUrl = opts.audioUrl ?? null;
  const localAudio = isLocalAudioUrl(audioUrl) ? audioUrl : null;
  const localVideo = isLocalVideoUrl(audioUrl) ? audioUrl : null;
  const yt = !localAudio && !localVideo ? youtubeEmbedUrl(audioUrl) : null;
  const kind: QueueMediaKind = localAudio
    ? "audio"
    : localVideo
      ? "video"
      : yt
        ? "youtube"
        : "audio";

  return {
    slug: opts.slug,
    title: opts.title,
    artist: opts.artist ?? null,
    href: bhajanPlayHref(opts.slug, opts.queue, {
      autoplay: opts.autoplay ?? true,
    }),
    kind,
    audioSrc: localAudio,
    videoSrc: localVideo,
    youtubeEmbedUrl: yt,
    cover: opts.cover ?? null,
    miniCover: opts.miniCover ?? opts.cover ?? null,
    coverAspect: opts.coverAspect,
  };
}

const PLAY_QUEUE_KINDS: PlayQueueKind[] = [
  "album",
  "folder",
  "artist",
  "playlist",
  "category",
  "festival",
  "library",
];

/** Internal session key, e.g. festival:navratri — not shown in the address bar */
export function encodePlayQueue(queue: PlayQueueRef): string {
  return `${queue.kind}:${queue.id}`;
}

const AUTOPLAY_KEY = "bhajan-autoplay";

/** Remember that the next song page should start playing, without putting it in the URL */
export function markBhajanAutoplay() {
  try {
    sessionStorage.setItem(AUTOPLAY_KEY, "1");
  } catch {
    // private mode / SSR
  }
}

export function consumeBhajanAutoplay(): boolean {
  try {
    if (sessionStorage.getItem(AUTOPLAY_KEY) !== "1") return false;
    sessionStorage.removeItem(AUTOPLAY_KEY);
    return true;
  } catch {
    return false;
  }
}

export function parsePlayQueue(
  value: string | string[] | undefined | null
): PlayQueueRef | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const i = raw.indexOf(":");
  if (i <= 0) return null;
  const kind = raw.slice(0, i);
  const id = raw.slice(i + 1).trim();
  if (!id) return null;
  if (
    kind !== "album" &&
    kind !== "folder" &&
    kind !== "artist" &&
    kind !== "playlist" &&
    kind !== "category" &&
    kind !== "festival" &&
    kind !== "library"
  ) {
    return null;
  }
  return { kind, id };
}

/** Read ?festival=navratri (or the older ?queue=festival:navratri) */
export function queueFromSearch(
  search: Record<string, string | string[] | undefined> | null | undefined
): PlayQueueRef | null {
  if (!search) return null;
  for (const kind of PLAY_QUEUE_KINDS) {
    const raw = search[kind];
    const id = (Array.isArray(raw) ? raw[0] : raw)?.trim();
    if (id) return { kind, id };
  }
  return parsePlayQueue(search.queue);
}

export function bhajanPlayHref(
  slug: string,
  queue?: PlayQueueRef | null,
  _opts?: { autoplay?: boolean }
): string {
  const params = new URLSearchParams();
  if (queue) params.set(queue.kind, queue.id);
  const q = params.toString();
  return q ? `/bhajans/${slug}?${q}` : `/bhajans/${slug}`;
}

/** Human label for the active continuous-play queue */
export function playQueueLabel(queue: PlayQueueRef): string | null {
  if (queue.kind === "album") {
    const album = getAlbum(queue.id);
    return album ? `Playing album · ${album.title}` : "Playing album";
  }
  if (queue.kind === "folder") {
    const folder = getFolder(queue.id);
    return folder ? `Playing folder · ${folder.title}` : "Playing folder";
  }
  if (queue.kind === "playlist") {
    return "Playing playlist";
  }
  if (queue.kind === "category") {
    return "Playing category";
  }
  if (queue.kind === "festival") {
    const fest = getFestivalById(queue.id);
    return fest ? `Celebrating · ${fest.name}` : "Playing festival celebration";
  }
  if (queue.kind === "library") {
    return "Playing all bhajans";
  }
  const profile = getArtistProfile(queue.id);
  const name = profile?.name ?? canonicalArtistName(queue.id);
  return `Playing · ${name}`;
}

/** Map a bhajan list into queue tracks (for category / library). */
export function queueTracksFromBhajans(
  bhajans: Array<{
    slug: string;
    title: string;
    artist_version?: string | null;
    audio_url?: string | null;
    cover_url?: string | null;
    thumbnail_url?: string | null;
    mini_cover_url?: string | null;
    player_cover_aspect?: "wide" | "square";
  }>,
  queue?: PlayQueueRef | null
): QueueTrack[] {
  const forCasualPlay =
    queue?.kind === "library" || queue?.kind === "category";
  const list = forCasualPlay
    ? bhajans.filter(
        (b) => !isLibraryQueueSkipTrack(b.slug) && !isOmittedFromLibrary(b.slug)
      )
    : bhajans;

  return list.map((b) =>
    buildQueueTrack({
      slug: b.slug,
      title: b.title,
      artist: creditedArtistNames(b.artist_version).join(" · ") || null,
      audioUrl: b.audio_url ?? null,
      cover: b.cover_url ?? b.thumbnail_url ?? null,
      miniCover: b.mini_cover_url ?? b.thumbnail_url ?? b.cover_url ?? null,
      coverAspect: b.player_cover_aspect,
      queue: queue ?? null,
      autoplay: true,
    })
  );
}

export function shuffleArray<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
