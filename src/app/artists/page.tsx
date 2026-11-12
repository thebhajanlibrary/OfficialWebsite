import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ArtistAvatar } from "@/components/artists/ArtistAvatar";
import { getArtists } from "@/lib/queries";

export const metadata = pageMeta({
  title: "Artists",
  description:
    "Singers and teachers in the Bhajan Library. Open a voice and play their songs with the lyrics beside the recording.",
  path: "/artists",
});

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
          Artists
        </h1>
        <p className="mt-1 text-muted">
          Singers and teachers in your satsang collection.
        </p>
      </div>

      {artists.length === 0 ? (
        <p className="border border-dashed border-border px-4 py-10 text-center text-muted">
          No artists yet. Add an artist name when saving a bhajan.
        </p>
      ) : (
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="group flex gap-4 bg-surface px-5 py-6 transition hover:bg-accent-soft"
            >
              <ArtistAvatar
                name={artist.name}
                photoUrl={artist.photo_url}
                imageFit={artist.photo_fit}
              />
              <span className="min-w-0">
                <p className="font-display text-2xl font-semibold text-primary transition group-hover:text-accent">
                  {artist.name}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {artist.bhajanCount} bhajan
                  {artist.bhajanCount === 1 ? "" : "s"}
                </p>
                {artist.bio && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {artist.bio}
                  </p>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
