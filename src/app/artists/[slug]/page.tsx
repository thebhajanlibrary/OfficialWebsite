import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtistAvatar } from "@/components/artists/ArtistAvatar";
import { ArtistLiveClips } from "@/components/artists/ArtistLiveClips";
import { BhajanList } from "@/components/bhajan/BhajanList";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import { getArtistBySlug, resolvePlayQueueTracks } from "@/lib/queries";
import { bhajanPlayHref, encodePlayQueue } from "@/lib/play-queue";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArtistBySlug(slug);
  return { title: data?.artist.name ?? "Artist" };
}

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params;
  const data = await getArtistBySlug(slug);
  if (!data) notFound();

  const { artist, bhajans } = data;
  const playQueue = { kind: "artist" as const, id: slug };
  const queueTracks = await resolvePlayQueueTracks(playQueue);
  const queueKey = encodePlayQueue(playQueue);

  return (
    <div className="space-y-10">
      <header className="space-y-5">
        <p className="text-sm text-muted">
          <Link href="/artists" className="transition hover:text-primary">
            Artists
          </Link>
        </p>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <ArtistAvatar
            name={artist.name}
            photoUrl={artist.photo_url}
            sizeClassName="h-28 w-28 sm:h-36 sm:w-36"
            textClassName="text-3xl sm:text-4xl"
            imageFit={artist.photo_fit}
            priority
          />
          <div className="min-w-0 space-y-3">
            <h1 className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              {artist.name}
            </h1>
            {artist.bio && (
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-foreground/85">
                {artist.bio}
              </p>
            )}
            <p className="text-sm text-muted">
              {artist.bhajanCount} bhajan
              {artist.bhajanCount === 1 ? "" : "s"} in the library
              {bhajans.length > 1 ? " · plays through in order" : ""}
            </p>
            {queueTracks.length > 0 && (
              <CollectionQueueActions
                queueKey={queueKey}
                tracks={queueTracks}
                playAllHref={bhajanPlayHref(queueTracks[0]!.slug, playQueue, {
                  autoplay: true,
                })}
              />
            )}
          </div>
        </div>
      </header>

      {artist.about && artist.about.length > 0 && (
        <section className="max-w-2xl space-y-4">
          <h2 className="font-display text-2xl font-semibold text-primary">
            About
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-muted">
            {artist.about.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {artist.notes?.map((note) => (
        <section key={note.title} className="max-w-2xl space-y-3">
          <h2 className="font-display text-2xl font-semibold text-primary">
            {note.title}
          </h2>
          <p className="text-base leading-relaxed text-muted">{note.body}</p>
          {note.address && (
            <p className="text-base leading-relaxed text-muted">
              <span className="font-medium text-foreground">Address:</span>{" "}
              {note.address}
            </p>
          )}
          {note.href && (
            <p>
              <a
                href={note.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-accent transition hover:underline"
              >
                {note.linkLabel ?? note.href} →
              </a>
            </p>
          )}
        </section>
      ))}

      {artist.live_clips && artist.live_clips.length > 0 && (
        <ArtistLiveClips clips={artist.live_clips} />
      )}

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-primary">
          In the library
        </h2>
        <BhajanList
          bhajans={bhajans}
          playQueue={{ kind: "artist", id: slug }}
          emptyMessage="No bhajans linked to this artist yet."
        />
      </section>
    </div>
  );
}
