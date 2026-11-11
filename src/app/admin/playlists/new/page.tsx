import type { Metadata } from "next";
import { PlaylistForm } from "@/components/playlist/PlaylistForm";
import { savePlaylistAction } from "@/lib/actions";
import { getBhajans } from "@/lib/queries";

export const metadata: Metadata = { title: "New playlist" };

export default async function NewPlaylistPage() {
  const bhajans = await getBhajans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">
          New playlist
        </h1>
        <p className="mt-1 text-muted">
          Build a programme and open it in singing mode.
        </p>
      </div>
      <PlaylistForm bhajans={bhajans} action={savePlaylistAction} />
    </div>
  );
}
