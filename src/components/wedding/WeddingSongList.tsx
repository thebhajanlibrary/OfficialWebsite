import Link from "next/link";
import { ShareSongButton } from "@/components/bhajan/ShareSongButton";
import {
  chutneyPerformerCredit,
  chutneyPerformerNames,
  getWeddingSongs,
} from "@/lib/chutney";

export function WeddingSongList() {
  const songs = getWeddingSongs();

  if (songs.length === 0) {
    return (
      <p className="border border-dashed border-border px-4 py-10 text-center text-muted">
        No wedding songs yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      {songs.map((song) => {
        const performers = song.artist ? chutneyPerformerNames(song.artist) : [];
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
              <Link
                href={`/wedding/${song.slug}`}
                className="font-medium text-primary transition hover:text-accent"
              >
                {song.title}
              </Link>
              <span className="shrink-0 text-sm text-muted">
                {song.cue}
                {credit && performers.length > 0 && (
                  <>
                    {" · "}
                    {performers.length === 1 ? (
                      credit
                    ) : (
                      performers.map((name, i) => (
                        <span key={name}>
                          {i > 0 && " X "}
                          {name}
                        </span>
                      ))
                    )}
                    {song.remixer && <> · Remix: {song.remixer}</>}
                  </>
                )}
              </span>
            </span>
            <ShareSongButton path={`/wedding/${song.slug}`} title={song.title} />
          </li>
        );
      })}
    </ul>
  );
}
