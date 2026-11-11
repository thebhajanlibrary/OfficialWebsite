import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WeddingIndexContent } from "@/components/wedding/WeddingIndexContent";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import { queueTracksFromBhajans } from "@/lib/play-queue";
import { getBhajansByCategory, getBhajans, getCategoryBySlug } from "@/lib/queries";
import { getFolder } from "@/lib/folders";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug("occasion", slug);
  return { title: category ? category.name : "Occasion" };
}

export default async function OccasionCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug("occasion", slug);
  if (!category) notFound();

  if (slug === "wedding") {
    return (
      <WeddingIndexContent
        breadcrumb={
          <p className="text-sm text-muted">
            <Link href="/browse/occasion" className="transition hover:text-primary">
              Occasion
            </Link>
            <span className="mx-2 text-border">·</span>
            <Link
              href="/folders/wedding"
              className="transition hover:text-primary"
            >
              Wedding folder
            </Link>
          </p>
        }
      />
    );
  }

  const bhajans = await getBhajansByCategory(category.id);
  const playQueue = { kind: "category" as const, id: category.id };
  const queueTracks = queueTracksFromBhajans(bhajans, playQueue);
  const garba =
    slug === "navratri"
      ? await (async () => {
          const members = getFolder("garba")?.member_slugs ?? [];
          const all = await getBhajans();
          const bySlug = new Map(all.map((b) => [b.slug, b]));
          return members
            .map((member) => bySlug.get(member))
            .filter((b): b is NonNullable<typeof b> => Boolean(b));
        })()
      : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">
          <Link href="/browse/occasion" className="hover:text-primary">
            Occasion
          </Link>
        </p>
        <h1 className="font-display text-3xl font-semibold text-primary">
          {category.name}
        </h1>
        <p className="mt-1 text-muted">
          {bhajans.length} bhajan{bhajans.length === 1 ? "" : "s"}
        </p>
        {slug === "holi" && (
          <p className="mt-4">
            <Link
              href="/chowtal"
              className="font-medium text-accent transition hover:underline"
            >
              Chowtal lyrics for Phagwah singing →
            </Link>
          </p>
        )}
      </div>
      {garba.length > 0 && (
        <section className="space-y-3">
          <Link
            href="/folders/garba"
            className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-accent"
          >
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-muted">
              {getFolder("garba")?.cover_url ? (
                <Image
                  src={getFolder("garba")!.cover_url!}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display text-2xl font-semibold text-primary transition group-hover:text-accent">
                Garba
              </span>
              <span className="mt-0.5 block text-sm text-muted">
                {garba.length} track{garba.length === 1 ? "" : "s"} · Navratri garba and timli
              </span>
            </span>
          </Link>
          <BhajanList
            bhajans={garba}
            playQueue={{ kind: "folder", id: "garba" }}
          />
        </section>
      )}
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
        emptyMessage={`No bhajans for ${category.name} yet.`}
      />
    </div>
  );
}
