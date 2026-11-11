export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    // Relative/local media paths are not YouTube embeds
    if (url.startsWith("/") || url.startsWith("./")) return null;

    const id = youtubeVideoId(url);
    if (!id) return null;

    const parsed = new URL(url);
    const start = youtubeStartSeconds(parsed);
    const embed = new URL(`https://www.youtube.com/embed/${id}`);
    if (start > 0) embed.searchParams.set("start", String(start));
    return embed.toString();
  } catch {
    return null;
  }
}

/** Poster image for a YouTube watch/embed URL (or null if not YouTube). */
export function youtubePosterUrl(url: string | null | undefined): string | null {
  const id = youtubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

function youtubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    if (url.startsWith("/") || url.startsWith("./")) return null;
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return fromQuery;
      const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/);
      return embedMatch?.[1] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

export function isLocalVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg)(\?[^#]*)?(#.*)?$/i.test(url);
}

export function isLocalAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.(mp3|wav|m4a|aac|ogg)(\?[^#]*)?(#.*)?$/i.test(url);
}

/** Media fragment `#t=40` / `#t=1m20s` → seconds (HTML5 video start offset). */
export function mediaFragmentStartSeconds(
  url: string | null | undefined
): number {
  if (!url) return 0;
  const hash = url.includes("#") ? url.slice(url.indexOf("#") + 1) : "";
  const raw = hash.match(/(?:^|&)t=([^&]+)/)?.[1];
  if (!raw) return 0;
  if (/^\d+(\.\d+)?$/.test(raw)) return Number(raw);
  const hours = Number(raw.match(/(\d+)h/)?.[1] ?? 0);
  const mins = Number(raw.match(/(\d+)m/)?.[1] ?? 0);
  const secs = Number(raw.match(/(\d+(?:\.\d+)?)s/)?.[1] ?? 0);
  return hours * 3600 + mins * 60 + secs;
}

/** Parse YouTube t= / start= into seconds (supports 3858, 1h4m18s, 64m18s). */
function youtubeStartSeconds(parsed: URL): number {
  const raw =
    parsed.searchParams.get("t") ??
    parsed.searchParams.get("start") ??
    parsed.hash.match(/t=([^&]+)/)?.[1] ??
    "";
  if (!raw) return 0;
  if (/^\d+$/.test(raw)) return Number(raw);

  const hours = Number(raw.match(/(\d+)h/)?.[1] ?? 0);
  const mins = Number(raw.match(/(\d+)m/)?.[1] ?? 0);
  const secs = Number(raw.match(/(\d+)s/)?.[1] ?? 0);
  return hours * 3600 + mins * 60 + secs;
}

export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
