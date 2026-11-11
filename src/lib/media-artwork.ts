/** Absolute URL the Cast/AirPlay receiver can fetch (not a relative path). */
export function absoluteMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (typeof window === "undefined") return path;
  try {
    return new URL(path, window.location.href).href;
  } catch {
    return path;
  }
}

export function imageMimeFromUrl(url: string): string {
  const clean = url.split("?")[0]?.toLowerCase() ?? "";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".gif")) return "image/gif";
  if (clean.endsWith(".svg")) return "image/svg+xml";
  return "image/png";
}

export function mediaSessionArtwork(
  cover: string | null | undefined
): MediaImage[] {
  const src = absoluteMediaUrl(cover);
  if (!src) return [];
  const type = imageMimeFromUrl(src);
  return [
    { src, sizes: "512x512", type },
    { src, sizes: "256x256", type },
    { src, sizes: "96x96", type },
  ];
}

/** Poster + title so Chromecast / AirPlay can show album art with the stream. */
export function applyCastArtwork(
  el: HTMLMediaElement | null | undefined,
  opts: {
    poster?: string | null;
    title?: string | null;
    artist?: string | null;
  }
) {
  if (!el) return;
  const poster = absoluteMediaUrl(opts.poster);
  if (poster) el.setAttribute("poster", poster);
  else el.removeAttribute("poster");

  const title = opts.title?.trim();
  if (title) el.setAttribute("title", title);
  else el.removeAttribute("title");

  const artist = opts.artist?.trim();
  if (artist) el.setAttribute("artist", artist);
  else el.removeAttribute("artist");
}
