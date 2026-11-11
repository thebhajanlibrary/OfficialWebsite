import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SingingMode } from "@/components/bhajan/SingingMode";
import { getPlaylistById } from "@/lib/queries";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ i?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const playlist = await getPlaylistById(id);
  return {
    title: playlist ? `Sing · ${playlist.name}` : "Singing mode",
  };
}

export default async function PlaylistSingPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { i = "0" } = await searchParams;
  const playlist = await getPlaylistById(id);
  if (!playlist || playlist.items.length === 0) notFound();

  const index = Math.min(
    Math.max(Number.parseInt(i, 10) || 0, 0),
    playlist.items.length - 1
  );
  const currentItem = playlist.items[index];
  const prevItem = index > 0 ? playlist.items[index - 1] : null;
  const nextItem =
    index < playlist.items.length - 1 ? playlist.items[index + 1] : null;

  return (
    <SingingMode
      current={{
        slug: currentItem.bhajan.slug,
        title: currentItem.bhajan.title,
        roman_lyrics: currentItem.bhajan.roman_lyrics,
        devanagari_lyrics: currentItem.bhajan.devanagari_lyrics,
        translation: currentItem.bhajan.translation,
      }}
      prev={
        prevItem
          ? {
              href: `/playlists/${id}/sing?i=${index - 1}`,
              title: prevItem.bhajan.title,
            }
          : null
      }
      next={
        nextItem
          ? {
              href: `/playlists/${id}/sing?i=${index + 1}`,
              title: nextItem.bhajan.title,
            }
          : null
      }
      backHref={`/playlists/${id}`}
      backLabel="Back to playlist"
    />
  );
}
