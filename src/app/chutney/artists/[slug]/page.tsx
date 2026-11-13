import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareSongButton } from "@/components/bhajan/ShareSongButton";
import { ArtistAvatar } from "@/components/artists/ArtistAvatar";
import { ArtistLiveClips } from "@/components/artists/ArtistLiveClips";
import {
  chutneyArtistSlug,
  chutneyPerformerNames,
  getChutneyArtist,
  type ChutneySong,
} from "@/lib/chutney";
import { clip, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

type ArtistSongRow = {
  key: string;
  title: string;
  cue?: string;
  thumbnail_url?: string;
  href: string;
};

function versionBelongsToArtist(
  versionArtist: string | undefined,
  songArtist: string | undefined,
  pageArtistSlug: string,
): boolean {
  const names = versionArtist?.trim()
    ? chutneyPerformerNames(versionArtist)
    : chutneyPerformerNames(songArtist ?? "");
  return names.some((n) => chutneyArtistSlug(n) === pageArtistSlug);
}

/** One catalogue song can be several recordings — list only this artist’s takes. */
function artistSongRows(
  songs: ChutneySong[],
  pageArtistSlug: string,
): ArtistSongRow[] {
  const rows: ArtistSongRow[] = [];
  for (const song of songs) {
    const versions = song.audio_versions;
    if (versions && versions.length > 1) {
      const mine = versions.filter((v) =>
        versionBelongsToArtist(v.artist, song.artist, pageArtistSlug),
      );
      for (const v of mine) {
        rows.push({
          key: `${song.slug}:${v.id}`,
          title: song.title,
          cue: [v.label, v.cue].filter(Boolean).join(" · "),
          thumbnail_url: v.thumbnail_url ?? song.thumbnail_url,
          href: `/chutney/${song.slug}?v=${encodeURIComponent(v.id)}`,
        });
      }
      // Song attributed via collaboration credit but no matching version — still list once
      if (mine.length === 0) {
        rows.push({
          key: song.slug,
          title: song.title,
          cue: song.cue,
          thumbnail_url: song.thumbnail_url,
          href: `/chutney/${song.slug}`,
        });
      }
    } else {
      rows.push({
        key: song.slug,
        title: song.title,
        cue: song.cue,
        thumbnail_url: song.thumbnail_url,
        href: `/chutney/${song.slug}`,
      });
    }
  }
  return rows;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = getChutneyArtist(slug);
  if (!artist) return { title: "Chutney Artist" };
  return pageMeta({
    title: artist.name,
    description: clip(
      artist.bio?.trim() ||
        `${artist.name} in Traditional Chutney. ${artist.songCount} song${artist.songCount === 1 ? "" : "s"} on Bhajan Library.`
    ),
    path: `/chutney/artists/${artist.slug}`,
    image: artist.photo_url,
  });
}

export default async function ChutneyArtistPage({ params }: Props) {
  const { slug } = await params;
  const artist = getChutneyArtist(slug);
  if (!artist) notFound();

  const rows = artistSongRows(artist.songs, artist.slug);
  const versionExtra = rows.length - artist.songCount;

  return (
    <div className="space-y-10">
      <header className="space-y-5">
        <p className="text-sm text-muted">
          <Link href="/chutney" className="transition hover:text-primary">
            Traditional Chutney
          </Link>
          <span className="mx-2 text-border">·</span>
          <Link
            href="/chutney/artists"
            className="transition hover:text-primary"
          >
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
            {artist.bio ? (
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-foreground/85">
                {artist.bio}
              </p>
            ) : null}
            <p className="text-sm text-muted">
              {artist.songCount} Traditional Chutney song
              {artist.songCount === 1 ? "" : "s"}
              {versionExtra > 0
                ? ` · ${rows.length} recording${rows.length === 1 ? "" : "s"}`
                : ""}
            </p>
          </div>
        </div>
      </header>

      {artist.about && artist.about.length > 0 ? (
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
      ) : null}

      {artist.notes?.map((note) => (
        <section key={note.title} className="max-w-2xl space-y-3">
          <h2 className="font-display text-2xl font-semibold text-primary">
            {note.title}
          </h2>
          <p className="text-base leading-relaxed text-muted">{note.body}</p>
          {note.address ? (
            <p className="text-base leading-relaxed text-muted">
              <span className="font-medium text-foreground">Address:</span>{" "}
              {note.address}
            </p>
          ) : null}
          {note.href ? (
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
          ) : null}
        </section>
      ))}

      {artist.live_clips && artist.live_clips.length > 0 ? (
        <ArtistLiveClips clips={artist.live_clips} />
      ) : null}

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-primary">
          In Traditional Chutney
        </h2>
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex items-center gap-3 py-3.5 sm:gap-4 sm:px-2"
            >
              <Link
                href={row.href}
                className="flex min-w-0 flex-1 items-center gap-3 transition hover:text-accent sm:gap-4"
              >
                {row.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.thumbnail_url}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded object-cover"
                  />
                ) : null}
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="font-medium text-primary">{row.title}</span>
                  {row.cue ? (
                    <span className="shrink-0 text-sm text-muted">{row.cue}</span>
                  ) : null}
                </span>
              </Link>
              <ShareSongButton path={row.href} title={row.title} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
