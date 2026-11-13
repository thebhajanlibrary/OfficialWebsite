import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ShareSongButton } from "@/components/bhajan/ShareSongButton";
import { getAlbums } from "@/lib/queries";

export const metadata = pageMeta({
  title: "Albums",
  description:
    "Bhajan albums in track order. Play the recording and read the lyrics for each song.",
  path: "/albums",
});

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
          Albums
        </h1>
        <p className="mt-1 text-muted">
          Full sets kept together in track order.
        </p>
      </div>

      {albums.length === 0 ? (
        <p className="border border-dashed border-border px-4 py-10 text-center text-muted">
          No albums yet.
        </p>
      ) : (
        <div className="space-y-5">
          {albums.map(({ album, count, tracks }) => (
            <article
              key={album.slug}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
                <Link
                  href={`/albums/${album.slug}`}
                  className="relative aspect-square w-36 shrink-0 overflow-hidden rounded-lg border border-border bg-surface sm:w-40 md:w-44"
                >
                  <Image
                    src={album.cover_url}
                    alt=""
                    fill
                    sizes="176px"
                    className="object-cover object-center"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/albums/${album.slug}`} className="group block">
                    <h2 className="font-display text-xl font-semibold text-primary transition group-hover:text-accent sm:text-2xl">
                      {album.title}
                    </h2>
                  </Link>
                  <p className="mt-1 text-sm text-accent">
                    {album.artist}
                    {album.year ? ` · ${album.year}` : ""}
                    {album.label ? ` · ${album.label}` : ""}
                    {` · ${count} tracks`}
                  </p>

                  <ol className="mt-3 columns-1 gap-x-8 sm:columns-2">
                    {tracks.map((track, i) => (
                      <li
                        key={track.id}
                        className="flex break-inside-avoid items-center gap-2 py-1"
                      >
                        <span className="w-4 shrink-0 text-xs tabular-nums text-muted">
                          {i + 1}
                        </span>
                        <Link
                          href={`/bhajans/${track.slug}`}
                          className="min-w-0 flex-1 truncate text-sm text-foreground transition hover:text-accent"
                        >
                          {track.title}
                        </Link>
                        <ShareSongButton
                          size="sm"
                          path={`/bhajans/${track.slug}`}
                          title={track.title}
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
