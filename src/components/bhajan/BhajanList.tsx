import { BhajanCard } from "@/components/bhajan/BhajanCard";
import type { PlayQueueRef } from "@/lib/play-queue";
import type { BhajanWithCategories } from "@/lib/types";

type Props = {
  bhajans: BhajanWithCategories[];
  emptyMessage?: string;
  /** When set, opening a bhajan starts continuous play through this list */
  playQueue?: PlayQueueRef | null;
};

export function BhajanList({
  bhajans,
  emptyMessage = "No bhajans found.",
  playQueue = null,
}: Props) {
  if (bhajans.length === 0) {
    return (
      <p className="border border-dashed border-border px-4 py-10 text-center text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="border-t border-border/80">
      {bhajans.map((bhajan) => (
        <BhajanCard key={bhajan.id} bhajan={bhajan} playQueue={playQueue} />
      ))}
    </div>
  );
}
