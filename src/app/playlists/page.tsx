import type { Metadata } from "next";
import Link from "next/link";
import { getPlaylists } from "@/lib/queries";

export const metadata: Metadata = { title: "Playlists" };

export default async function PlaylistsPage() {
  const playlists = await getPlaylists();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">
            Playlists
          </h1>
          <p className="mt-1 text-muted">
            Custom programmes for satsang, festivals, and services.
          </p>
        </div>
        <Link
          href="/admin/playlists/new"
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm hover:border-accent"
        >
          New playlist
        </Link>
      </div>

      {playlists.length === 0 ? (
        <p className="text-muted">No playlists yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlists/${playlist.id}`}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-accent"
            >
              <h2 className="font-display text-xl font-semibold text-primary">
                {playlist.name}
              </h2>
              {playlist.description && (
                <p className="mt-2 text-sm text-muted">{playlist.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
