import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BhajanForm } from "@/components/bhajan/BhajanForm";
import { saveBhajanAction } from "@/lib/actions";
import { getBhajanById, getCategories } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bhajan = await getBhajanById(id);
  return { title: bhajan ? `Edit · ${bhajan.title}` : "Edit bhajan" };
}

export default async function EditBhajanPage({ params }: Props) {
  const { id } = await params;
  const [bhajan, categories] = await Promise.all([
    getBhajanById(id),
    getCategories(),
  ]);
  if (!bhajan) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">
          Edit bhajan
        </h1>
        <p className="mt-1 text-muted">{bhajan.title}</p>
      </div>
      <BhajanForm
        categories={categories}
        action={saveBhajanAction}
        initial={{
          id: bhajan.id,
          title: bhajan.title,
          alternate_title: bhajan.alternate_title,
          slug: bhajan.slug,
          artist_version: bhajan.artist_version,
          roman_lyrics: bhajan.roman_lyrics,
          devanagari_lyrics: bhajan.devanagari_lyrics,
          translation: bhajan.translation,
          meaning: bhajan.meaning,
          audio_url: bhajan.audio_url,
          pdf_url: bhajan.pdf_url,
          display_order: bhajan.display_order,
          category_ids: bhajan.categories.map((c) => c.id),
        }}
      />
    </div>
  );
}
