import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import { RelatedCollections } from "@/components/layout/RelatedCollections";
import { getAlbumWithTracks, resolvePlayQueueTracks } from "@/lib/queries";
import { getAlbum } from "@/lib/albums";
import { artistSlug, creditedArtistNames } from "@/lib/artists";
import { bhajanPlayHref, encodePlayQueue } from "@/lib/play-queue";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionJsonLd, pageMeta, clip } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbum(slug);
  if (!album) return { title: "Album" };
  return pageMeta({
    title: `${album.title} — ${album.artist}`,
    description: clip(
      album.description ||
        `${album.title} by ${album.artist}. Listen in order on Bhajan Library.`
    ),
    path: `/albums/${album.slug}`,
    image: album.cover_url,
  });
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getAlbumWithTracks(slug);
  if (!data) notFound();

  const { album, tracks } = data;
  const artistNames = creditedArtistNames(album.artist);
  const playQueue = { kind: "album" as const, id: album.slug };
  const queueTracks = await resolvePlayQueueTracks(playQueue);
  const queueKey = encodePlayQueue(playQueue);

  return (
    <div className="space-y-8">
      <JsonLd
        data={collectionJsonLd({
          name: album.title,
          path: `/albums/${album.slug}`,
          description: clip(album.description || `${album.title} by ${album.artist}.`),
          kind: "MusicAlbum",
        })}
      />
      <p className="text-sm text-muted">
        <Link href="/albums" className="transition hover:text-primary">
          Albums
        </Link>
      </p>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <Link
          href={`/albums/${album.slug}`}
          className="relative aspect-square w-full max-w-[14rem] shrink-0 overflow-hidden rounded-xl border border-border bg-surface sm:w-44 md:w-52"
        >
          <Image
            src={album.cover_url}
            alt=""
            fill
            priority
            sizes="208px"
            className="object-cover object-center"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
            {album.title}
          </h1>
          {(album.slug === "bhakti-instrumentals-kedar-pandit" ||
            album.slug === "bhakti-3-instrumentals-kedar-pandit") && (
            <p className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                Instrumental
              </span>
              {album.slug === "bhakti-instrumentals-kedar-pandit" ? (
                <Link
                  href="/albums/bhakti-3-instrumentals-kedar-pandit"
                  className="rounded border border-border bg-surface-muted/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary transition hover:border-accent hover:text-accent"
                >
                  Also · Bhakti 3
                </Link>
              ) : (
                <Link
                  href="/albums/bhakti-instrumentals-kedar-pandit"
                  className="rounded border border-border bg-surface-muted/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary transition hover:border-accent hover:text-accent"
                >
                  Also · Bhakti
                </Link>
              )}
            </p>
          )}
          <p className="mt-2 text-sm font-medium tracking-wide text-accent">
            {artistNames.map((name, i) => (
              <span key={artistSlug(name)}>
                {i > 0 ? " · " : null}
                <Link
                  href={`/artists/${artistSlug(name)}`}
                  className="transition hover:underline"
                >
                  {name}
                </Link>
              </span>
            ))}
          </p>
          {(album.year || album.label || album.composer) && (
            <p className="mt-2 text-sm text-muted">
              {[
                album.year,
                album.label,
                album.composer ? `Music: ${album.composer}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <p className="mt-3 text-muted">{album.description}</p>
          {album.slug === "sweet-phagwah-songs-and-chowtal" && (
            <p className="mt-3 rounded-lg border border-border bg-surface-muted/60 px-3 py-2 text-sm text-muted">
              Specialty Phagwah CD — also linked from{" "}
              <Link href="/folders/holi" className="font-medium text-accent hover:underline">
                Holi
              </Link>{" "}
              and{" "}
              <Link href="/chowtal" className="font-medium text-accent hover:underline">
                Chowtal
              </Link>
              . Not included in All Bhajans Play all / shuffle.
            </p>
          )}
          {album.slug === "lets-sing-and-dance-with-dropati" && (
            <p className="mt-3 rounded-lg border border-border bg-surface-muted/60 px-3 py-2 text-sm text-muted">
              Surinamese chutney album — also linked from{" "}
              <Link href="/chutney" className="font-medium text-accent hover:underline">
                Traditional Chutney
              </Link>{" "}
              and{" "}
              <Link
                href="/folders/chutney-style-bhajan"
                className="font-medium text-accent hover:underline"
              >
                Chutney Style Bhajan
              </Link>
              . Not included in All Bhajans Play all / shuffle.
            </p>
          )}
          <p className="mt-2 text-sm text-accent">
            {tracks.length} track{tracks.length === 1 ? "" : "s"}
            {tracks.length > 1 ? " · plays through in order" : ""}
          </p>

          {album.slug === "bhakti-instrumentals-kedar-pandit" && (
            <div className="mt-5">
              <RelatedCollections
                heading="Also in this series"
                items={[
                  {
                    href: "/albums/bhakti-3-instrumentals-kedar-pandit",
                    title: "Bhakti 3 — Instrumentals & Karaoke",
                    kicker: "Album · Exotic India",
                    hint: "Volume 3 companion disc — more karaoke devotionals",
                    cover_url:
                      "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
                  },
                  {
                    href: "/folders/instrumentals-karaoke",
                    title: "Instrumentals & Karaoke",
                    kicker: "Folder",
                    hint: "All instrumental / karaoke tracks together",
                    cover_url:
                      "/images/albums/bhakti-instrumentals-kedar-pandit.png",
                  },
                ]}
              />
            </div>
          )}
          {album.slug === "bhakti-3-instrumentals-kedar-pandit" && (
            <div className="mt-5">
              <RelatedCollections
                heading="Also in this series"
                items={[
                  {
                    href: "/albums/bhakti-instrumentals-kedar-pandit",
                    title: "Bhakti — Instrumentals & Karaoke",
                    kicker: "Album · Exotic India",
                    hint: "Companion disc — more karaoke devotionals",
                    cover_url:
                      "/images/albums/bhakti-instrumentals-kedar-pandit.png",
                  },
                  {
                    href: "/folders/instrumentals-karaoke",
                    title: "Instrumentals & Karaoke",
                    kicker: "Folder",
                    hint: "All instrumental / karaoke tracks together",
                    cover_url:
                      "/images/albums/bhakti-3-instrumentals-kedar-pandit.png",
                  },
                ]}
              />
            </div>
          )}
          {album.slug === "lets-sing-and-dance-with-dropati" && (
            <div className="mt-5">
              <RelatedCollections
                heading="Also in this series"
                items={[
                  {
                    href: "/chutney",
                    title: "Traditional Chutney",
                    kicker: "Section",
                    hint: "Song list with lyrics — same Dropati tracks live here",
                    cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
                  },
                  {
                    href: "/folders/chutney-style-bhajan",
                    title: "Chutney Style Bhajan",
                    kicker: "Folder",
                    hint: "Chutney-style devotionals including Gauri Puja",
                    cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
                  },
                ]}
              />
            </div>
          )}
          {album.slug === "aarti-archan-hari-om-sharan" && (
            <div className="mt-5">
              <RelatedCollections
                heading="Also in this series"
                items={[
                  {
                    href: "/albums/premanjali-pushpanjali-hari-om-sharan",
                    title: "Premanjali Pushpanjali",
                    kicker: "Album · Saregama",
                    hint: "Hari Om Sharan — Hindi bhakti classics",
                    cover_url:
                      "/images/albums/premanjali-pushpanjali-hari-om-sharan.png",
                  },
                  {
                    href: "/albums/shiv-archana-hari-om-sharan",
                    title: "Shiv Archana",
                    kicker: "Album · T-Series · 1997",
                    hint: "Hari Om Sharan — Shiva bhajans & Shivratri",
                    cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
                  },
                ]}
              />
            </div>
          )}
          {album.slug === "shiv-archana-hari-om-sharan" && (
            <div className="mt-5">
              <RelatedCollections
                heading="Also in this series"
                items={[
                  {
                    href: "/albums/premanjali-pushpanjali-hari-om-sharan",
                    title: "Premanjali Pushpanjali",
                    kicker: "Album · Saregama",
                    hint: "Hari Om Sharan — Hindi bhakti classics",
                    cover_url:
                      "/images/albums/premanjali-pushpanjali-hari-om-sharan.png",
                  },
                  {
                    href: "/albums/aarti-archan-hari-om-sharan",
                    title: "Aarti Archan",
                    kicker: "Album · HMV · 1982",
                    hint: "Hari Om Sharan & Nandini — aartis & vandanás",
                    cover_url: "/images/albums/aarti-archan-hari-om-sharan.png",
                  },
                ]}
              />
            </div>
          )}
          {album.slug === "premanjali-pushpanjali-hari-om-sharan" && (
            <div className="mt-5">
              <RelatedCollections
                heading="Also in this series"
                items={[
                  {
                    href: "/albums/aarti-archan-hari-om-sharan",
                    title: "Aarti Archan",
                    kicker: "Album · HMV · 1982",
                    hint: "Hari Om Sharan & Nandini — aartis & vandanás",
                    cover_url: "/images/albums/aarti-archan-hari-om-sharan.png",
                  },
                  {
                    href: "/albums/shiv-archana-hari-om-sharan",
                    title: "Shiv Archana",
                    kicker: "Album · T-Series · 1997",
                    hint: "Hari Om Sharan — Shiva bhajans & Shivratri",
                    cover_url: "/images/albums/shiv-archana-hari-om-sharan.png",
                  },
                ]}
              />
            </div>
          )}

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

          <ol className="mt-6 border-t border-border/80">
            {tracks.map((track, i) => {
              const href = bhajanPlayHref(track.slug, playQueue);
              return (
                <li
                  key={track.id}
                  className="flex items-baseline gap-3 border-b border-border/80 py-3 transition hover:bg-surface/80"
                >
                  <span className="w-5 shrink-0 text-sm tabular-nums text-muted">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={href}
                      className="font-display text-lg font-semibold text-primary transition hover:text-accent"
                    >
                      {track.title}
                    </Link>
                    {track.artist_version && (
                      <p className="mt-0.5 truncate text-sm text-muted">
                        {creditedArtistNames(track.artist_version).join(" · ")}
                        {album.slug === "lets-play-holi" ? " · Holi remix" : ""}
                        {album.slug === "bhakti-instrumentals-kedar-pandit" ||
                        album.slug === "bhakti-3-instrumentals-kedar-pandit"
                          ? " · Instrumental"
                          : ""}
                      </p>
                    )}
                  </div>
                  <Link
                    href={href}
                    className="shrink-0 text-muted"
                    aria-label={`Open ${track.title}`}
                  >
                    →
                  </Link>
                </li>
              );
            })}
          </ol>

          {album.slug === "lets-play-holi" && (
            <div className="mt-8">
              <RelatedCollections
                items={[
                  {
                    href: "/folders/holi",
                    title: "Holi",
                    kicker: "Folder",
                    hint: "Holi / Phagwah bhajans — not mixed into this album",
                    cover_url: "/images/albums/lets-play-holi.png",
                  },
                  {
                    href: "/chowtal",
                    title: "Chowtal",
                    kicker: "Lyrics",
                    hint: "Phagwah singing lyrics — stays on Chowtal, not this album",
                  },
                ]}
              />
            </div>
          )}
          {album.slug === "sweet-phagwah-songs-and-chowtal" && (
            <div className="mt-8">
              <RelatedCollections
                items={[
                  {
                    href: "/folders/holi",
                    title: "Holi",
                    kicker: "Folder",
                    hint: "Holi / Phagwah bhajans — album linked from here",
                    cover_url: "/images/albums/lets-play-holi.png",
                  },
                  {
                    href: "/chowtal",
                    title: "Chowtal",
                    kicker: "Lyrics",
                    hint: "Phagwah singing lyrics — album linked from here too",
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
