import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import {
  getCurrentUser,
  getPlaylistById,
  resolvePlayQueueTracks,
} from "@/lib/queries";
import { bhajanPlayHref, encodePlayQueue } from "@/lib/play-queue";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const playlist = await getPlaylistById(id);
  return { title: playlist?.name ?? "Playlist" };
}

export default async function PlaylistDetailPage({ params }: Props) {
  const { id } = await params;
  const playlist = await getPlaylistById(id);
  if (!playlist) notFound();

  const user = await getCurrentUser();
  const playQueue = { kind: "playlist" as const, id: playlist.id };
  const queueTracks = await resolvePlayQueueTracks(playQueue);
  const queueKey = encodePlayQueue(playQueue);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm text-muted">
          <Link href="/playlists" className="hover:text-primary">
            Playlists
          </Link>
        </p>
        <h1 className="font-display text-3xl font-semibold text-primary">
          {playlist.name}
        </h1>
        {playlist.description && (
          <p className="text-muted">{playlist.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {queueTracks.length > 0 && (
            <CollectionQueueActions
              queueKey={queueKey}
              tracks={queueTracks}
              playAllHref={bhajanPlayHref(queueTracks[0]!.slug, playQueue, {
                autoplay: true,
              })}
            />
          )}
          {playlist.items.length > 0 && (
            <Link
              href={`/playlists/${playlist.id}/sing`}
              className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm hover:border-accent"
            >
              Open in singing mode
            </Link>
          )}
          {user && (
            <Link
              href={`/admin/playlists/${playlist.id}/edit`}
              className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm hover:border-accent"
            >
              Edit
            </Link>
          )}
        </div>
      </header>

      <ol className="space-y-3">
        {playlist.items.map((item, index) => (
          <li
            key={item.id}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex gap-4">
              <span className="font-display text-2xl text-accent">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={bhajanPlayHref(item.bhajan.slug, playQueue)}
                  className="font-display text-xl font-semibold text-primary hover:underline"
                >
                  {item.bhajan.title}
                </Link>
                {item.bhajan.artist_version && (
                  <p className="text-sm text-muted">
                    {item.bhajan.artist_version}
                  </p>
                )}
                {item.notes && (
                  <p className="mt-2 text-sm italic text-accent">{item.notes}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {playlist.items.length === 0 && (
        <p className="text-muted">This playlist is empty.</p>
      )}
    </div>
  );
}
