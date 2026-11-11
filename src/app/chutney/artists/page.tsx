import type { Metadata } from "next";
import Link from "next/link";
import { ArtistAvatar } from "@/components/artists/ArtistAvatar";
import { getChutneyArtists } from "@/lib/chutney";

export const metadata: Metadata = {
  title: "Chutney Artists · Traditional Chutney",
  description:
    "Singers in the Traditional Chutney section only — separate from the bhajan Artists page.",
};

export default function ChutneyArtistsPage() {
  const artists = getChutneyArtists();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted">
          <Link href="/chutney" className="transition hover:text-primary">
            Traditional Chutney
          </Link>
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
          Chutney Artists
        </h1>
        <p className="mt-1 text-muted">
          Artists from Traditional Chutney only — not listed under the main
          Artists page.
        </p>
      </div>

      {artists.length === 0 ? (
        <p className="border border-dashed border-border px-4 py-10 text-center text-muted">
          No chutney artists yet.
        </p>
      ) : (
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/chutney/artists/${artist.slug}`}
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
                {artist.bio ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {artist.bio}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-muted">
                  {artist.songCount} song
                  {artist.songCount === 1 ? "" : "s"}
                </p>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
