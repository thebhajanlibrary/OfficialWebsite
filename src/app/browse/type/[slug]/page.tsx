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
  const category = await getCategoryBySlug("bhajan_type", slug);
  return { title: category ? category.name : "Type" };
}

export default async function TypeCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug("bhajan_type", slug);
  if (!category) notFound();

  const bhajans = await getBhajansByCategory(category.id);
  const playQueue = { kind: "category" as const, id: category.id };
  const queueTracks = queueTracksFromBhajans(bhajans, playQueue);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">
          <Link href="/browse/type" className="hover:text-primary">
            Type
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
        emptyMessage={`No ${category.name.toLowerCase()} entries yet.`}
      />
    </div>
  );
}
