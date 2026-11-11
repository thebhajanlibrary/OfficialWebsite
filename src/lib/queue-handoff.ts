import type { QueueTrack } from "@/lib/play-queue";

export const QUEUE_HANDOFF_EVENT = "bhajan-queue-handoff";

/** Tell the page / YouTube host to take over a non-audio queue track. */
export function dispatchQueueHandoff(track: QueueTrack) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<QueueTrack>(QUEUE_HANDOFF_EVENT, { detail: track })
  );
}
