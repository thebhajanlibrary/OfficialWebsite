import type { QueueTrack } from "@/lib/play-queue";
import { exitVideoPip } from "@/lib/ios-playback";
import {
  clearOrphanVideo,
  getPersistentVideoHost,
} from "@/lib/persistent-video";

export const DISMISS_FLOATING_PLAYERS_EVENT = "bhajan-dismiss-floating-players";

export function trackPathname(href: string): string {
  try {
    return new URL(href, "https://example.com").pathname;
  } catch {
    return href.split("?")[0]?.split("#")[0] ?? href;
  }
}

export function mediaPageFromPath(
  pathname: string
): { section: string; slug: string } | null {
  const match = pathname.match(/^\/(bhajans|chutney|wedding|chowtal)\/([^/]+)/);
  if (!match) return null;
  return { section: match[1]!, slug: decodeURIComponent(match[2]!) };
}

export type FloatingPlaybackState = {
  active: boolean;
  slug: string | null;
  kind: "audio" | "video" | "youtube" | null;
};

/** True when the corner mini player would be showing (browsing away from the playing track). */
export function getFloatingPlaybackState(
  pathname: string,
  queueSession: { tracks: QueueTrack[]; index: number } | null,
  ytSession: { slug: string; href: string } | null,
  opts?: { playing?: boolean; currentTime?: number }
): FloatingPlaybackState {
  if (queueSession) {
    const track = queueSession.tracks[queueSession.index];
    if (track) {
      const onPage = pathname === trackPathname(track.href);
      const isAudio = track.kind === "audio" && Boolean(track.audioSrc);

      if (isAudio && !onPage) {
        const engaged =
          Boolean(opts?.playing) ||
          (opts?.currentTime ?? 0) > 0.25 ||
          queueSession.tracks.length > 1;
        if (engaged) {
          return { active: true, slug: track.slug, kind: "audio" };
        }
      }

      if (track.kind === "video" && !onPage) {
        return { active: true, slug: track.slug, kind: "video" };
      }
    }
  }

  if (ytSession) {
    const onPage = pathname === trackPathname(ytSession.href);
    if (!onPage) {
      return { active: true, slug: ytSession.slug, kind: "youtube" };
    }
  }

  return { active: false, slug: null, kind: null };
}

export function shouldDismissFloatingPlayers(opts: {
  wasFloating: boolean;
  previousSlug: string | null;
  nextSlug: string | null;
  pathname: string;
}): boolean {
  const { wasFloating, previousSlug, nextSlug, pathname } = opts;
  if (!wasFloating || !previousSlug) return false;

  if (nextSlug && nextSlug !== previousSlug) return true;

  const page = mediaPageFromPath(pathname);
  if (page && page.slug !== previousSlug) return true;

  return false;
}

export function dismissFloatingPlayers(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DISMISS_FLOATING_PLAYERS_EVENT));
}

/** Close pinned PiP, video PiP, and floating corner players before a new track claims playback. */
export function claimSitePlayback(): void {
  dismissFloatingPlayers();
  void dismissOrphanVideoPip();
}

export async function dismissOrphanVideoPip(): Promise<void> {
  if (typeof document === "undefined") return;

  const host = getPersistentVideoHost();
  const orphan = host.querySelector("video");
  const candidates = [
    orphan,
    document.pictureInPictureElement,
  ].filter((el): el is HTMLVideoElement => el instanceof HTMLVideoElement);

  for (const video of candidates) {
    await exitVideoPip(video);
    clearOrphanVideo(video);
  }
}
