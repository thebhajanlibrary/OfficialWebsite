import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaylistForm } from "@/components/playlist/PlaylistForm";
import { savePlaylistAction } from "@/lib/actions";
import { getBhajans, getPlaylistById } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const playlist = await getPlaylistById(id);
  return { title: playlist ? `Edit · ${playlist.name}` : "Edit playlist" };
}

export default async function EditPlaylistPage({ params }: Props) {
  const { id } = await params;
  const [playlist, bhajans] = await Promise.all([
    getPlaylistById(id),
    getBhajans(),
  ]);
  if (!playlist) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">
          Edit playlist
        </h1>
        <p className="mt-1 text-muted">{playlist.name}</p>
      </div>
      <PlaylistForm
        bhajans={bhajans}
        action={savePlaylistAction}
        initial={{
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          items: playlist.items.map((item) => ({
            bhajan_id: item.bhajan_id,
            notes: item.notes,
            title: item.bhajan.title,
          })),
        }}
      />
    </div>
  );
}
