import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import { WeddingSongList } from "@/components/wedding/WeddingSongList";
import { folkQueueTracks, getWeddingSongs } from "@/lib/chutney";

type Props = {
  /** Breadcrumb link above the title */
  breadcrumb?: React.ReactNode;
};

export function WeddingIndexContent({ breadcrumb }: Props) {
  const songs = getWeddingSongs();
  const queueTracks = folkQueueTracks("wedding");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        {breadcrumb}
        <h1 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
          Chutney wedding songs
        </h1>
        <p className="max-w-2xl text-muted">
          Tagged in the Wedding folder. {songs.length} song
          {songs.length === 1 ? "" : "s"} here.
        </p>
        {queueTracks.length > 0 && (
          <div className="pt-1">
            <CollectionQueueActions
              queueKey="wedding:all"
              tracks={queueTracks}
              playAllHref={queueTracks[0]?.href}
            />
          </div>
        )}
      </header>

      <WeddingSongList />
    </div>
  );
}
