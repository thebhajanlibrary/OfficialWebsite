/** iPhone / iPad Safari — keep media alive when the screen locks. */

export function isProbablyIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function pageIsHidden(): boolean {
  return typeof document !== "undefined" && document.visibilityState === "hidden";
}

/** Do not use display:none — iOS often suspends that media on lock. */
export function prepareUnlockableMedia(el: HTMLMediaElement) {
  el.setAttribute("playsinline", "true");
  el.setAttribute("webkit-playsinline", "true");
  el.setAttribute("x-webkit-airplay", "allow");
  try {
    el.disableRemotePlayback = false;
  } catch {
    // ignore
  }
}

/**
 * Re-assert play when the phone locks / the tab hides.
 * Safe no-op if the element is already playing.
 */
export function keepMediaPlayingWhenLocked(
  getEl: () => HTMLMediaElement | null,
  shouldPlay: () => boolean
): () => void {
  const kick = () => {
    if (!shouldPlay()) return;
    const el = getEl();
    if (!el) return;
    void el.play().catch(() => undefined);
  };

  document.addEventListener("visibilitychange", kick);
  window.addEventListener("pagehide", kick);
  window.addEventListener("freeze", kick);

  return () => {
    document.removeEventListener("visibilitychange", kick);
    window.removeEventListener("pagehide", kick);
    window.removeEventListener("freeze", kick);
  };
}

type WebkitVideo = HTMLVideoElement & {
  webkitSetPresentationMode?: (
    mode: "inline" | "picture-in-picture" | "fullscreen"
  ) => void;
  webkitPresentationMode?: string;
};

/** PiP continues on a locked iPhone; inline video usually does not. */
export async function enterVideoPip(video: HTMLVideoElement): Promise<void> {
  const v = video as WebkitVideo;
  try {
    if (
      typeof v.webkitSetPresentationMode === "function" &&
      v.webkitPresentationMode !== "picture-in-picture"
    ) {
      v.webkitSetPresentationMode("picture-in-picture");
      return;
    }
    if (
      typeof document !== "undefined" &&
      document.pictureInPictureEnabled &&
      !document.pictureInPictureElement &&
      typeof video.requestPictureInPicture === "function"
    ) {
      await video.requestPictureInPicture();
    }
  } catch {
    // user blocked PiP or the browser refused
  }
}

export async function exitVideoPip(video?: HTMLVideoElement | null): Promise<void> {
  const v = (video ?? undefined) as WebkitVideo | undefined;
  try {
    if (
      v &&
      typeof v.webkitSetPresentationMode === "function" &&
      v.webkitPresentationMode === "picture-in-picture"
    ) {
      v.webkitSetPresentationMode("inline");
      return;
    }
    if (
      typeof document !== "undefined" &&
      document.pictureInPictureElement &&
      typeof document.exitPictureInPicture === "function"
    ) {
      await document.exitPictureInPicture();
    }
  } catch {
    // ignore
  }
}

export function videoIsInPip(video: HTMLVideoElement | null | undefined): boolean {
  if (!video || typeof document === "undefined") return false;
  const v = video as WebkitVideo;
  if (v.webkitPresentationMode === "picture-in-picture") return true;
  return document.pictureInPictureElement === video;
}
