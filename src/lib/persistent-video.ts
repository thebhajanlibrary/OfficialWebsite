/** Keep a playing <video> alive across Next.js navigations for PiP. */

const HOST_ID = "bhajan-persistent-video-host";

let orphan: HTMLVideoElement | null = null;

export function getPersistentVideoHost(): HTMLElement {
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement("div");
    host.id = HOST_ID;
    host.setAttribute("aria-hidden", "true");
    host.style.cssText =
      "position:fixed;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0,0,0,0);border:0;pointer-events:none;z-index:-1;";
    document.body.appendChild(host);
  }
  return host;
}

/** Park a playing video so React unmount does not destroy PiP. */
export function orphanPlayingVideo(video: HTMLVideoElement): void {
  if (orphan && orphan !== video) {
    try {
      orphan.pause();
    } catch {
      // ignore
    }
    orphan.removeAttribute("src");
    orphan.load();
    orphan.remove();
  }
  orphan = video;
  const host = getPersistentVideoHost();
  if (video.parentElement !== host) {
    host.appendChild(video);
  }
}

export function clearOrphanVideo(video?: HTMLVideoElement | null): void {
  if (!orphan) return;
  if (video && orphan !== video) return;
  try {
    orphan.pause();
  } catch {
    // ignore
  }
  orphan.removeAttribute("src");
  orphan.load();
  orphan.remove();
  orphan = null;
}

export function takeOrphanVideo(src: string): HTMLVideoElement | null {
  if (!orphan) return null;
  const current = orphan.currentSrc || orphan.src;
  if (!current.includes(src.split("#")[0]!)) return null;
  const el = orphan;
  orphan = null;
  return el;
}
