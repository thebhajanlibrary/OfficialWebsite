import type { Metadata } from "next";
import Link from "next/link";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import { isOmittedFromLibrary } from "@/lib/albums";
import { queueTracksFromBhajans } from "@/lib/play-queue";
import { getBhajans } from "@/lib/queries";

export const metadata: Metadata = {
  title: "All Bhajans",
};

export default async function AllBhajansPage() {
  const all = await getBhajans();
  const bhajans = all.filter((b) => !isOmittedFromLibrary(b.slug));
  const playQueue = { kind: "library" as const, id: "all" };
  const queueTracks = queueTracksFromBhajans(bhajans, playQueue);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">
            All Bhajans
          </h1>
          <p className="mt-1 text-muted">
            {bhajans.length} bhajan{bhajans.length === 1 ? "" : "s"} in the library
          </p>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Party remixes and instrumental / karaoke tracks stay in the list but
            are skipped when you Play all / shuffle here — open{" "}
            <Link
              href="/folders/bhajan-party-mix"
              className="text-accent transition hover:underline"
            >
              Bhajan Party Mix
            </Link>{" "}
            or{" "}
            <Link
              href="/folders/instrumentals-karaoke"
              className="text-accent transition hover:underline"
            >
              Instrumentals &amp; Karaoke
            </Link>{" "}
            for those.
          </p>
        </div>
        <Link
          href="/search"
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm hover:border-accent"
        >
          Search
        </Link>
      </div>

      {queueTracks.length > 0 && (
        <CollectionQueueActions
          queueKey="library:all"
          tracks={queueTracks}
          playAllHref={queueTracks[0]?.href}
        />
      )}

      <BhajanList
        bhajans={bhajans}
        playQueue={playQueue}
        emptyMessage="No bhajans yet. Add one from Admin."
      />
    </div>
  );
}
