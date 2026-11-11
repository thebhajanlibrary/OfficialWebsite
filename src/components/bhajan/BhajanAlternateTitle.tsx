import Link from "next/link";
import { albumForSubtitleSegment, type Album } from "@/lib/albums";

type Props = {
  alternateTitle: string;
  /** Album this track belongs to (from track list), for fallback link. */
  album?: Album | null;
  className?: string;
};

/** Subtitle under the song title — album names link to the full album when known. */
export function BhajanAlternateTitle({
  alternateTitle,
  album,
  className = "text-lg text-muted",
}: Props) {
  const parts = alternateTitle.split(" · ").map((p) => p.trim());
  const segmentAlbums = parts.map((part) => albumForSubtitleSegment(part));
  const hasInlineAlbumLink = segmentAlbums.some(Boolean);

  return (
    <p className={className}>
      {parts.map((part, i) => {
        const segmentAlbum = segmentAlbums[i];
        return (
          <span key={`${i}-${part}`}>
            {i > 0 ? " · " : null}
            {segmentAlbum ? (
              <Link
                href={`/albums/${segmentAlbum.slug}`}
                className="font-medium text-accent underline-offset-2 transition hover:underline"
              >
                {part}
              </Link>
            ) : (
              part
            )}
          </span>
        );
      })}
      {album && !hasInlineAlbumLink && (
        <>
          {" · "}
          <Link
            href={`/albums/${album.slug}`}
            className="font-medium text-accent underline-offset-2 transition hover:underline"
          >
            {album.title}
          </Link>
        </>
      )}
    </p>
  );
}
