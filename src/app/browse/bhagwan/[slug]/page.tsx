import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import { queueTracksFromBhajans } from "@/lib/play-queue";
import { getBhajansByCategory, getCategoryBySlug } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug("bhagwan", slug);
  return { title: category ? `${category.name} Bhajans` : "Bhagwan" };
}

export default async function BhagwanCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug("bhagwan", slug);
  if (!category) notFound();

  const bhajans = await getBhajansByCategory(category.id);
  const playQueue = { kind: "category" as const, id: category.id };
  const queueTracks = queueTracksFromBhajans(bhajans, playQueue);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">
          <Link href="/browse/bhagwan" className="hover:text-primary">
            Bhagwan
          </Link>
        </p>
        <h1 className="font-display text-3xl font-semibold text-primary">
          {category.name}
        </h1>
        <p className="mt-1 text-muted">
          {bhajans.length} bhajan{bhajans.length === 1 ? "" : "s"}
        </p>
      </div>
      {queueTracks.length > 0 && (
        <CollectionQueueActions
          queueKey={`category:${category.id}`}
          tracks={queueTracks}
          playAllHref={queueTracks[0]?.href}
        />
      )}
      <BhajanList
        bhajans={bhajans}
        playQueue={playQueue}
        emptyMessage={`No bhajans tagged with ${category.name} yet.`}
      />
    </div>
  );
}
