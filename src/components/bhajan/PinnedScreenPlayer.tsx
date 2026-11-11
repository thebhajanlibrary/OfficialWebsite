"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Pause, Play, Pin, PinOff, SkipBack, SkipForward } from "lucide-react";
import { useQueuePlaybackOptional } from "@/components/bhajan/QueuePlayback";
import {
  DISMISS_FLOATING_PLAYERS_EVENT,
} from "@/lib/floating-playback";

type DocPiP = {
  requestWindow: (options?: {
    width?: number;
    height?: number;
    preferInitialWindowPlacement?: boolean;
  }) => Promise<Window>;
  window: Window | null;
};

function getDocPiP(): DocPiP | null {
  if (typeof window === "undefined") return null;
  const api = (
    window as Window & { documentPictureInPicture?: DocPiP }
  ).documentPictureInPicture;
  return api ?? null;
}

export function supportsDocumentPiP() {
  return Boolean(getDocPiP());
}

function copyStylesTo(pipDoc: Document) {
  // Prefer linking same stylesheets so Tailwind/app CSS applies
  for (const node of Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))) {
    pipDoc.head.appendChild(node.cloneNode(true));
  }

  // Fall back: copy accessible cssRules
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = Array.from(sheet.cssRules)
        .map((r) => r.cssText)
        .join("\n");
      if (!rules) continue;
      const style = pipDoc.createElement("style");
      style.textContent = rules;
      pipDoc.head.appendChild(style);
    } catch {
      if (sheet.href) {
        const link = pipDoc.createElement("link");
        link.rel = "stylesheet";
        link.href = sheet.href;
        pipDoc.head.appendChild(link);
      }
    }
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const vars = [
    "--background",
    "--foreground",
    "--primary",
    "--accent",
    "--accent-soft",
    "--muted",
    "--border",
    "--surface",
    "--surface-muted",
    "--font-display",
    "--font-body",
  ];
  const body = pipDoc.body;
  body.style.margin = "0";
  body.style.fontFamily = rootStyles.fontFamily || "system-ui, sans-serif";
  body.style.background = rootStyles.getPropertyValue("--surface").trim() || "#f7f3ee";
  body.style.color = rootStyles.getPropertyValue("--primary").trim() || "#1c1917";
  for (const v of vars) {
    const val = rootStyles.getPropertyValue(v).trim();
    if (val) pipDoc.documentElement.style.setProperty(v, val);
  }
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function PipControls() {
  const queue = useQueuePlaybackOptional();
  if (!queue?.session) {
    return (
      <div style={{ padding: 16, fontSize: 13, opacity: 0.7 }}>
        Nothing playing
      </div>
    );
  }

  const track = queue.session.tracks[queue.session.index];
  if (!track) return null;

  const canPrev = queue.session.index > 0;
  const canNext = queue.session.index < queue.session.tracks.length - 1;
  const progress =
    queue.duration > 0
      ? Math.min(100, (queue.currentTime / queue.duration) * 100)
      : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: 12,
        gap: 10,
        background: "var(--surface, #f7f3ee)",
        color: "var(--primary, #1c1917)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 10,
            overflow: "hidden",
            flexShrink: 0,
            background: "#111",
          }}
        >
          {track.miniCover || track.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={(track.miniCover || track.cover)!}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontWeight: 650,
              fontSize: 14,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {track.title}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              opacity: 0.65,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {track.artist || "Bhajan Library"}
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            height: 4,
            borderRadius: 999,
            background: "rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "var(--accent, #b85a2a)",
              transition: "width 200ms linear",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
            fontSize: 11,
            opacity: 0.6,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>{formatTime(queue.currentTime)}</span>
          <span>{formatTime(queue.duration)}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {queue.session.tracks.length > 1 && (
          <button
            type="button"
            onClick={queue.prev}
            disabled={!canPrev}
            aria-label="Previous"
            style={btnStyle(!canPrev)}
          >
            <SkipBack size={18} fill="currentColor" />
          </button>
        )}
        <button
          type="button"
          onClick={queue.toggle}
          aria-label={queue.playing ? "Pause" : "Play"}
          style={{
            ...btnStyle(false),
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "var(--primary, #1c1917)",
            color: "#fff",
          }}
        >
          {queue.playing ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" style={{ marginLeft: 2 }} />
          )}
        </button>
        {queue.session.tracks.length > 1 && (
          <button
            type="button"
            onClick={queue.next}
            disabled={!canNext}
            aria-label="Next"
            style={btnStyle(!canNext)}
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    border: "none",
    background: "transparent",
    color: "inherit",
    padding: 8,
    borderRadius: 10,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.3 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

/**
 * Optional always-on-top mini player (Chrome / Edge / Arc on desktop).
 * Audio stays in the main tab; this window is just the pinned controls.
 */
export function PinnedScreenPlayer({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const queue = useQueuePlaybackOptional();
  const [supported, setSupported] = useState(false);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSupported(supportsDocumentPiP());
  }, []);

  const closePip = useCallback(() => {
    try {
      pipWindow?.close();
    } catch {
      // already closed
    }
    setPipWindow(null);
    setPortalNode(null);
  }, [pipWindow]);

  const openPip = useCallback(async () => {
    const api = getDocPiP();
    if (!api) return;

    try {
      const win = await api.requestWindow({
        width: 360,
        height: 168,
        preferInitialWindowPlacement: true,
      });
      copyStylesTo(win.document);
      win.document.title = "Bhajan Library · Now playing";

      const mount = win.document.createElement("div");
      mount.id = "bhajan-pip-root";
      win.document.body.append(mount);

      setPipWindow(win);
      setPortalNode(mount);

      const onHide = () => {
        setPipWindow(null);
        setPortalNode(null);
      };
      win.addEventListener("pagehide", onHide);
    } catch {
      // User cancelled or browser blocked
    }
  }, []);

  // Close pinned window when playback session ends
  useEffect(() => {
    if (!queue?.session && pipWindow) closePip();
  }, [queue?.session, pipWindow, closePip]);

  // Close pinned window when user switches song/video while corner mini was active
  useEffect(() => {
    const onDismiss = () => {
      if (pipWindow) closePip();
    };
    window.addEventListener(DISMISS_FLOATING_PLAYERS_EVENT, onDismiss);
    return () =>
      window.removeEventListener(DISMISS_FLOATING_PLAYERS_EVENT, onDismiss);
  }, [pipWindow, closePip]);

  if (!supported || !queue?.session) return null;

  const track = queue.session.tracks[queue.session.index];
  if (!track?.audioSrc) return null;

  const pinned = Boolean(pipWindow && portalNode);

  let portal: ReactNode = null;
  if (pinned && portalNode && pipWindow) {
    portal = createPortal(<PipControls />, portalNode);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (pinned) closePip();
          else void openPip();
        }}
        className={
          className ||
          (compact
            ? "rounded-lg p-2 text-primary transition hover:bg-surface-muted"
            : "rounded-md p-1.5 text-white transition hover:bg-white/10")
        }
        aria-label={pinned ? "Unpin from screen" : "Pin player to screen"}
        title={
          pinned
            ? "Unpin floating player"
            : "Pin mini player on top of other apps"
        }
      >
        {pinned ? (
          <PinOff className="h-4 w-4" aria-hidden />
        ) : (
          <Pin className="h-4 w-4" aria-hidden />
        )}
      </button>
      {portal}
    </>
  );
}
