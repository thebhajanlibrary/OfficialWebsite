import fs from "fs";
import path from "path";
import { BHAJAN_CONTENT } from "@/lib/bhajan-content";
import { CHUTNEY_SONGS } from "@/lib/chutney";
import { notifyLibrary } from "@/lib/notify";
import { SITE_URL } from "@/lib/site";
import { isLocalAudioUrl, isLocalVideoUrl, youtubeVideoId } from "@/lib/utils";

const DATA_FILE = path.join(process.cwd(), "data", "playback-alerts.json");
const BATCH = 36;

export type BrokenRecording = {
  key: string;
  title: string;
  artist: string;
  href: string;
  reason: string;
  since: string;
};

export type PlaybackReport = {
  cursor: number;
  total: number;
  checkedAt: string | null;
  lastBatch: number;
  broken: BrokenRecording[];
};

type Stored = {
  cursor: number;
  checkedAt: string | null;
  broken: Record<string, BrokenRecording>;
};

type Target = {
  key: string;
  title: string;
  artist: string;
  href: string;
  url: string;
  kind: "youtube" | "file" | "remote";
};

function emptyStore(): Stored {
  return { cursor: 0, checkedAt: null, broken: {} };
}

function readStore(): Stored {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(raw) as Stored;
    if (!data || typeof data !== "object" || !data.broken) return emptyStore();
    return {
      cursor: Number(data.cursor) || 0,
      checkedAt: data.checkedAt ?? null,
      broken: data.broken,
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: Stored) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function playingUrl(
  audioUrl: string | null | undefined,
  youtubeUrl: string | null | undefined
): { url: string; kind: Target["kind"] } | null {
  const audio = audioUrl?.trim() || "";
  const youtube = youtubeUrl?.trim() || "";
  if (audio && youtubeVideoId(audio)) return { url: audio, kind: "youtube" };
  if (audio && (isLocalAudioUrl(audio) || isLocalVideoUrl(audio) || audio.startsWith("/"))) {
    return { url: audio, kind: "file" };
  }
  if (youtube && youtubeVideoId(youtube)) return { url: youtube, kind: "youtube" };
  if (audio.startsWith("http")) return { url: audio, kind: "remote" };
  return null;
}

function recordingTargets(): Target[] {
  const targets: Target[] = [];

  for (const [slug, content] of Object.entries(BHAJAN_CONTENT)) {
    const playing = playingUrl(content.audio_url, content.youtube_url);
    if (!playing) continue;
    targets.push({
      key: slug,
      title: content.title?.trim() || slug,
      artist: content.artist_version?.trim() || "",
      href: `${SITE_URL}/bhajans/${slug}`,
      url: playing.url,
      kind: playing.kind,
    });
  }

  for (const song of CHUTNEY_SONGS) {
    const section = song.sections?.includes("wedding") ? "wedding" : "chutney";
    const versions = song.audio_versions?.length
      ? song.audio_versions
      : [{ id: "main", label: "", audio_url: song.audio_url, youtube_url: song.youtube_url }];
    for (const version of versions) {
      const playing = playingUrl(version.audio_url, version.youtube_url);
      if (!playing) continue;
      const key = version.id === "main" ? song.slug : `${song.slug}:${version.id}`;
      targets.push({
        key,
        title: version.label ? `${song.title} (${version.label})` : song.title,
        artist: version.artist || song.artist || "",
        href: `${SITE_URL}/${section}/${song.slug}`,
        url: playing.url,
        kind: playing.kind,
      });
    }
  }

  return targets;
}

async function failureReason(target: Target): Promise<string | null> {
  if (target.kind === "file") {
    const relative = target.url.split("?")[0]?.split("#")[0] ?? target.url;
    const file = path.join(process.cwd(), "public", relative.replace(/^\//, ""));
    return fs.existsSync(file) ? null : "The audio file is missing from the site.";
  }

  if (target.kind === "youtube") {
    const id = youtubeVideoId(target.url);
    if (!id) return "The YouTube link is not a video.";
    const watch = `https://www.youtube.com/watch?v=${id}`;
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(watch)}&format=json`,
        { redirect: "follow", signal: AbortSignal.timeout(8000) }
      );
      if (response.ok) return null;
      if (response.status === 404 || response.status === 401 || response.status === 403) {
        return "YouTube will not play this video.";
      }
      return null;
    } catch {
      return null;
    }
  }

  try {
    const response = await fetch(target.url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 404 || response.status === 410) {
      return "The audio link no longer opens.";
    }
    return null;
  } catch {
    return null;
  }
}

export function getPlaybackReport(): PlaybackReport {
  const store = readStore();
  const total = recordingTargets().length;
  return {
    cursor: store.cursor,
    total,
    checkedAt: store.checkedAt,
    lastBatch: 0,
    broken: Object.values(store.broken).sort((a, b) => a.title.localeCompare(b.title)),
  };
}

export async function runPlaybackCheck(): Promise<PlaybackReport> {
  const targets = recordingTargets();
  const store = readStore();
  const start = targets.length === 0 ? 0 : store.cursor % targets.length;
  const batch = targets.slice(start, start + BATCH);
  const wrapped = batch.length < BATCH ? targets.slice(0, BATCH - batch.length) : [];
  const checking = [...batch, ...wrapped].filter(
    (target, index, list) => list.findIndex((item) => item.key === target.key) === index
  );

  const newlyBroken: BrokenRecording[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < checking.length; i += 6) {
    const slice = checking.slice(i, i + 6);
    const results = await Promise.all(
      slice.map(async (target) => ({ target, reason: await failureReason(target) }))
    );
    for (const { target, reason } of results) {
      if (reason) {
        if (!store.broken[target.key]) {
          const entry: BrokenRecording = {
            key: target.key,
            title: target.title,
            artist: target.artist,
            href: target.href,
            reason,
            since: now,
          };
          store.broken[target.key] = entry;
          newlyBroken.push(entry);
        }
      } else {
        delete store.broken[target.key];
      }
    }
  }

  store.cursor = (start + checking.length) % Math.max(targets.length, 1);
  store.checkedAt = now;
  try {
    writeStore(store);
  } catch (err) {
    console.error("Could not save the playback check:", err);
  }

  if (newlyBroken.length > 0) {
    const lines = newlyBroken.map(
      (item) => `${item.title}${item.artist ? ` — ${item.artist}` : ""}\n${item.reason}\n${item.href}`
    );
    await notifyLibrary(
      newlyBroken.length === 1
        ? `A recording stopped playing: ${newlyBroken[0]?.title}`
        : `${newlyBroken.length} recordings stopped playing`,
      [
        "These recordings no longer play on Bhajan Library.",
        "",
        ...lines,
      ].join("\n")
    );
  }

  return {
    cursor: store.cursor,
    total: targets.length,
    checkedAt: store.checkedAt,
    lastBatch: checking.length,
    broken: Object.values(store.broken).sort((a, b) => a.title.localeCompare(b.title)),
  };
}
