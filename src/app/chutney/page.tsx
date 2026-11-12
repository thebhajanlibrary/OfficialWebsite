import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { RelatedCollections } from "@/components/layout/RelatedCollections";
import {
  chutneyArtistSlug,
  chutneyPerformerCredit,
  chutneyPerformerNames,
  getChutneySorted,
} from "@/lib/chutney";

export const metadata = pageMeta({
  title: "Traditional Chutney",
  description:
    "Traditional Indo-Caribbean chutney songs, with the lyrics beside the recording.",
  path: "/chutney",
});

export default function ChutneyIndexPage() {
  const songs = getChutneySorted();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
          Traditional Chutney
        </h1>
        <p className="max-w-2xl text-muted">
          Classic Indo-Caribbean chutney — {songs.length} piece
          {songs.length === 1 ? "" : "s"} here. These stay in this section only
          and do not appear under All Bhajans.
        </p>
        <div className="pt-1">
          <Link
            href="/chutney/artists"
            className="btn-secondary inline-flex rounded-lg px-4 py-2.5 text-sm"
          >
            Chutney Artists
          </Link>
        </div>
      </header>

      <RelatedCollections
        heading="Albums"
        items={[
          {
            href: "/albums/lets-sing-and-dance-with-dropati",
            title: "Let's Sing & Dance with Dropati",
            kicker: "Album · audio",
            hint: "20 tracks — Surinamese wedding chutney & chutney-bhajan",
            cover_url: "/images/albums/lets-sing-and-dance-with-dropati.png",
          },
          {
            href: "/albums/star-melodies-ramdew-chaitoe",
            title: "The Star Melodies of Ramdew Chaitoe",
            kicker: "Album · Traditional Chaitoe",
            hint: "8 tracks — baithak gana devotionals · also in Chutney Style Bhajan",
            cover_url: "/images/albums/star-melodies-ramdew-chaitoe.jpg",
          },
        ]}
      />

      <ul className="divide-y divide-border border-y border-border">
        {songs.map((song) => {
          const performers = song.artist
            ? chutneyPerformerNames(song.artist)
            : [];
          const credit = chutneyPerformerCredit(song.artist);
          return (
            <li
              key={song.slug}
              className="flex items-center gap-3 py-3.5 sm:gap-4 sm:px-2"
            >
              {song.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={song.thumbnail_url}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded object-cover"
                />
              ) : null}
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="min-w-0">
                  <Link
                    href={`/chutney/${song.slug}`}
                    className="font-medium text-primary transition hover:text-accent"
                  >
                    {song.title}
                  </Link>
                  {credit ? (
                    performers.length === 1 ? (
                      <Link
                        href={`/chutney/artists/${chutneyArtistSlug(performers[0]!)}`}
                        className="mt-0.5 block text-sm text-muted transition hover:text-accent"
                      >
                        {credit}
                        {song.remixer ? ` · remix ${song.remixer}` : ""}
                      </Link>
                    ) : (
                      <span className="mt-0.5 block text-sm text-muted">
                        {credit}
                        {song.remixer ? ` · remix ${song.remixer}` : ""}
                      </span>
                    )
                  ) : null}
                </span>
                {song.cue && (
                  <span className="shrink-0 text-sm text-muted">{song.cue}</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
