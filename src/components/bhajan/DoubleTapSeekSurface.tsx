"use client";

import { RotateCcw, RotateCw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

export const DOUBLE_TAP_SEEK_SECONDS = 30;
const DOUBLE_TAP_MS = 320;

type Flash = "back" | "forward" | null;

type Props = {
  children: ReactNode;
  onSeekBack: () => void;
  onSeekForward: () => void;
  /** Single tap on centre toggles play/pause. Side double-taps seek only. */
  onSingleTap?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  /** Side zones only — centre clicks pass through (e.g. YouTube iframe). */
  overlayOnly?: boolean;
  /** Leave the bottom of the frame clickable (YouTube’s own control bar). */
  reserveBottom?: number;
};

export function DoubleTapSeekSurface({
  children,
  onSeekBack,
  onSeekForward,
  onSingleTap,
  disabled = false,
  className = "",
  ariaLabel,
  overlayOnly = false,
  reserveBottom = 0,
}: Props) {
  const [flash, setFlash] = useState<Flash>(null);
  const lastTapRef = useRef<{ side: "left" | "right"; time: number } | null>(
    null
  );
  const flashTimerRef = useRef<number | null>(null);
  const singleTapTimerRef = useRef<number | null>(null);

  const cancelPendingSingleTap = useCallback(() => {
    if (singleTapTimerRef.current != null) {
      window.clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
    }
  }, []);

  const scheduleSingleTap = useCallback(() => {
    if (!onSingleTap) return;
    cancelPendingSingleTap();
    singleTapTimerRef.current = window.setTimeout(() => {
      singleTapTimerRef.current = null;
      onSingleTap();
    }, DOUBLE_TAP_MS + 20);
  }, [cancelPendingSingleTap, onSingleTap]);

  useEffect(() => cancelPendingSingleTap, [cancelPendingSingleTap]);

  const showFlash = useCallback((side: Flash) => {
    if (flashTimerRef.current != null) {
      window.clearTimeout(flashTimerRef.current);
    }
    setFlash(side);
    flashTimerRef.current = window.setTimeout(() => {
      setFlash(null);
      flashTimerRef.current = null;
    }, 650);
  }, []);

  const triggerSeek = useCallback(
    (side: "left" | "right") => {
      lastTapRef.current = null;
      if (side === "left") onSeekBack();
      else onSeekForward();
      showFlash(side === "left" ? "back" : "forward");
    },
    [onSeekBack, onSeekForward, showFlash]
  );

  const handleZonePointerUp = useCallback(
    (side: "left" | "right", e: PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      e.stopPropagation();

      const now = Date.now();
      const last = lastTapRef.current;

      if (last && last.side === side && now - last.time <= DOUBLE_TAP_MS) {
        e.preventDefault();
        cancelPendingSingleTap();
        triggerSeek(side);
        return;
      }

      lastTapRef.current = { side, time: now };
      if (overlayOnly && onSingleTap) scheduleSingleTap();
    },
    [cancelPendingSingleTap, disabled, onSingleTap, overlayOnly, scheduleSingleTap, triggerSeek]
  );

  const handleCenterPointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled || !onSingleTap || e.button !== 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (ratio < 0.42 || ratio > 0.58) return;
      lastTapRef.current = null;
      onSingleTap();
    },
    [disabled, onSingleTap]
  );

  const coversParent = /\b(absolute|fixed)\b/.test(className);

  const edgeStyle =
    reserveBottom > 0 ? { top: 0, bottom: reserveBottom } : undefined;

  const zoneClass = (side: "left" | "right") =>
    `absolute z-10 w-[42%] touch-manipulation pointer-events-auto ${
      reserveBottom > 0 ? "" : "inset-y-0"
    } ${side === "left" ? "left-0" : "right-0"} group/zone`;

  const hintClass = (side: "left" | "right") =>
    `pointer-events-none absolute z-[15] flex w-[38%] items-center justify-center opacity-0 transition-opacity duration-200 group-hover/zone:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 ${
      reserveBottom > 0 ? "" : "inset-y-0"
    } ${side === "left" ? "left-0" : "right-0"}`;

  return (
    <div
      className={`group group/seek block w-full ${
        coversParent ? "" : "relative"
      } ${overlayOnly && !onSingleTap ? "pointer-events-none" : ""} ${className}`}
      role={onSingleTap ? "button" : undefined}
      tabIndex={onSingleTap ? 0 : undefined}
      aria-label={ariaLabel}
      onPointerUp={onSingleTap ? handleCenterPointerUp : undefined}
      onKeyDown={
        onSingleTap
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSingleTap();
              }
            }
          : undefined
      }
    >
      {children}

      {!disabled && (
        <>
          <div className={hintClass("left")} style={edgeStyle} aria-hidden>
            <span className="flex h-11 w-11 flex-col items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm sm:h-12 sm:w-12">
              <RotateCcw className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
              <span className="mt-0.5 text-[10px] font-semibold tabular-nums leading-none sm:text-[11px]">
                {DOUBLE_TAP_SEEK_SECONDS}
              </span>
            </span>
          </div>
          <div className={hintClass("right")} style={edgeStyle} aria-hidden>
            <span className="flex h-11 w-11 flex-col items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm sm:h-12 sm:w-12">
              <RotateCw className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
              <span className="mt-0.5 text-[10px] font-semibold tabular-nums leading-none sm:text-[11px]">
                {DOUBLE_TAP_SEEK_SECONDS}
              </span>
            </span>
          </div>

          <div
            className={zoneClass("left")}
            style={edgeStyle}
            aria-hidden
            onPointerUp={(e) => handleZonePointerUp("left", e)}
          />
          <div
            className={zoneClass("right")}
            style={edgeStyle}
            aria-hidden
            onPointerUp={(e) => handleZonePointerUp("right", e)}
          />

          {flash === "back" && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex w-1/2 items-center justify-center">
              <span className="seek-flash rounded-full bg-black/55 px-4 py-2 text-xl font-semibold text-white tabular-nums backdrop-blur-sm sm:text-2xl">
                −{DOUBLE_TAP_SEEK_SECONDS}
              </span>
            </div>
          )}
          {flash === "forward" && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 flex w-1/2 items-center justify-center">
              <span className="seek-flash rounded-full bg-black/55 px-4 py-2 text-xl font-semibold text-white tabular-nums backdrop-blur-sm sm:text-2xl">
                +{DOUBLE_TAP_SEEK_SECONDS}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function seekByOffset(
  current: number,
  duration: number,
  offset: number
): number {
  const max =
    duration > 0 ? duration : Math.max(0, current + Math.abs(offset));
  return Math.min(max, Math.max(0, current + offset));
}
