import Image from "next/image";
import { CollectionQueueActions } from "@/components/bhajan/CollectionQueueActions";
import { WeddingSongList } from "@/components/wedding/WeddingSongList";
import { folkQueueTracks, getWeddingSongs } from "@/lib/chutney";

const COVER = "/images/folders/wedding/chutney-wedding.jpg";

type Props = {
  /** Breadcrumb link above the title */
  breadcrumb?: React.ReactNode;
};

export function WeddingIndexContent({ breadcrumb }: Props) {
  const songs = getWeddingSongs();
  const queueTracks = folkQueueTracks("wedding");

  return (
    <div className="space-y-10">
      <header className="space-y-6">
        {breadcrumb}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="relative aspect-square w-full max-w-[14rem] shrink-0 overflow-hidden rounded-xl border border-border bg-surface sm:w-44 md:w-52">
            <Image
              src={COVER}
              alt=""
              fill
              priority
              sizes="208px"
              className="object-cover object-center"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
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
          </div>
        </div>
      </header>

      <WeddingSongList />
    </div>
  );
}
