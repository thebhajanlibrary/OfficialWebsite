import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import { RelatedCollections } from "@/components/layout/RelatedCollections";
import { WeddingSongList } from "@/components/wedding/WeddingSongList";
import { getFolderWithBhajans, resolvePlayQueueTracks } from "@/lib/queries";
import { getFolder } from "@/lib/folders";
import { folkQueueTracks } from "@/lib/chutney";
import { bhajanPlayHref, encodePlayQueue } from "@/lib/play-queue";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionJsonLd, pageMeta, clip } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const folder = getFolder(slug);
  if (!folder) return { title: "Folder" };
  return pageMeta({
    title: folder.title,
    description: clip(
      folder.description ||
        `${folder.title} on Bhajan Library. Play the recordings and read the lyrics.`
    ),
    path: `/folders/${folder.slug}`,
    image: folder.cover_url,
  });
}

export default async function FolderDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getFolderWithBhajans(slug);
  if (!data) notFound();

  const { folder } = data;
  const playQueue = { kind: "folder" as const, id: folder.slug };
  const queueKey = encodePlayQueue(playQueue);

  if (folder.slug === "wedding") {
    const queueTracks = folkQueueTracks("wedding");
    const songs = queueTracks.length;

    return (
      <div className="space-y-8">
        <JsonLd
          data={collectionJsonLd({
            name: folder.title,
            path: `/folders/${folder.slug}`,
            description: clip(folder.description),
          })}
        />
        <p className="text-sm text-muted">
          <Link href="/folders" className="transition hover:text-primary">
            Folders
          </Link>
          <span className="mx-2 text-border">·</span>
          <Link
            href="/browse/occasion/wedding"
            className="transition hover:text-primary"
          >
            Occasion · Wedding
          </Link>
        </p>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {folder.cover_url ? (
            <div className="relative aspect-square w-full max-w-[14rem] shrink-0 overflow-hidden rounded-xl border border-border bg-surface sm:w-44 md:w-52">
              <Image
                src={folder.cover_url}
                alt=""
                fill
                priority
                sizes="208px"
                className="object-cover object-center"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
              {folder.title}
            </h1>
            <p className="mt-1 text-muted">{folder.description}</p>
            <p className="mt-2 text-sm text-accent">
              {songs} track{songs === 1 ? "" : "s"}
              {songs > 1 ? " · plays through in order" : ""}
            </p>
            {queueTracks.length > 0 && (
              <div className="mt-4">
                <CollectionQueueActions
                  queueKey={queueKey}
                  tracks={queueTracks}
                  playAllHref={queueTracks[0]?.href}
                />
              </div>
            )}
          </div>
        </div>

        <RelatedCollections
          heading="Albums"
          items={[
            {
              href: "/albums/lets-sing-and-dance-with-dropati",
              title: "Let's Sing & Dance with Dropati",
              kicker: "Album · Wedding",
              hint: "20 tracks — Surinamese wedding songs by Dropati",
              cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
            },
          ]}
        />

        <WeddingSongList />
      </div>
    );
  }

  const { bhajans } = data;
  const queueTracks = await resolvePlayQueueTracks(playQueue);

  return (
    <div className="space-y-8">
      <JsonLd
        data={collectionJsonLd({
          name: folder.title,
          path: `/folders/${folder.slug}`,
          description: clip(folder.description),
        })}
      />
      <p className="text-sm text-muted">
        {folder.slug === "garba" ? (
          <Link href="/browse/occasion/navratri" className="transition hover:text-primary">
            Navratri
          </Link>
        ) : (
          <Link href="/folders" className="transition hover:text-primary">
            Folders
          </Link>
        )}
      </p>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {folder.cover_url ? (
          <div className="relative aspect-square w-full max-w-[14rem] shrink-0 overflow-hidden rounded-xl border border-border bg-surface sm:w-44 md:w-52">
            <Image
              src={folder.cover_url}
              alt=""
              fill
              priority
              sizes="208px"
              className="object-cover object-center"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
            {folder.title}
          </h1>
          <p className="mt-1 text-muted">{folder.description}</p>
          <p className="mt-2 text-sm text-accent">
            {bhajans.length}{" "}
            {folder.member_slugs?.length
              ? `track${bhajans.length === 1 ? "" : "s"}`
              : `version${bhajans.length === 1 ? "" : "s"}`}
            {bhajans.length > 1 ? " · plays through in order" : ""}
          </p>
          {queueTracks.length > 0 && (
            <div className="mt-4">
              <CollectionQueueActions
                queueKey={queueKey}
                tracks={queueTracks}
                playAllHref={bhajanPlayHref(queueTracks[0]!.slug, playQueue, {
                  autoplay: true,
                })}
              />
            </div>
          )}
        </div>
      </div>

      {folder.slug === "holi" && (
        <RelatedCollections
          items={[
            {
              href: "/albums/sweet-phagwah-songs-and-chowtal",
              title: "Sweet Phagwah Songs and Chowtal",
              kicker: "Album · audio",
              hint: "Mohabeer MO-191 (1998) — Pt. Chunelall & Jharna · MG Satsang Society",
              cover_url: "/images/albums/sweet-phagwah-songs-and-chowtal.png",
            },
            {
              href: "/albums/lets-play-holi",
              title: "Let's Play Holi",
              kicker: "Album",
              hint: "VP Premier · Holi remixes — stays in the album, not this folder",
              cover_url: "/images/albums/lets-play-holi.png",
            },
            {
              href: "/chowtal",
              title: "Chowtal",
              kicker: "Lyrics",
              hint: "Phagwah singing lyrics — not mixed into this folder",
            },
          ]}
        />
      )}

      {folder.slug === "instrumentals-karaoke" && (
        <RelatedCollections
          heading="Albums in this folder"
          items={[
            {
              href: "/albums/bhakti-instrumentals-kedar-pandit",
              title: "Bhakti — Instrumentals & Karaoke",
              kicker: "Album · Exotic India",
              hint: "Kedar Pandit · companion to Bhakti 3",
              cover_url: "/images/albums/bhakti-instrumentals-kedar-pandit.png",
            },
            {
              href: "/albums/bhakti-3-instrumentals-kedar-pandit",
              title: "Bhakti 3 — Instrumentals & Karaoke",
              kicker: "Album · Exotic India",
              hint: "Kedar Pandit · volume 3 companion disc",
              cover_url:
                "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
            },
          ]}
        />
      )}

      {folder.slug === "chutney-style-bhajan" && (
        <RelatedCollections
          heading="Albums"
          items={[
            {
              href: "/albums/lets-sing-and-dance-with-dropati",
              title: "Let's Sing & Dance with Dropati",
              kicker: "Album · chutney",
              hint: "Full Dropati set — also under Wedding Songs",
              cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
            },
            {
              href: "/albums/star-melodies-ramdew-chaitoe",
              title: "The Star Melodies",
              kicker: "Album",
              hint: "Ramdew Chaitoe — baithak devotionals in this folder",
              cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
            },
            {
              href: "/chowtal",
              title: "Chowtal",
              kicker: "Lyrics",
              hint: "Phagwah chowtal lyrics — not mixed into this folder",
            },
          ]}
        />
      )}

      <BhajanList
        bhajans={bhajans}
        playQueue={playQueue}
        emptyMessage="No versions in this folder yet."
      />
    </div>
  );
}
