import { notFound } from "next/navigation";
import { SingingMode } from "@/components/bhajan/SingingMode";
import { neighborsInChowtal } from "@/lib/chowtal";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ChowtalSingPage({ params }: Props) {
  const { slug } = await params;
  const { current, prev, next } = neighborsInChowtal(slug);
  if (!current) notFound();

  return (
    <SingingMode
      current={{
        slug: current.slug,
        title: current.title,
        roman_lyrics: current.roman_lyrics,
      }}
      prev={
        prev
          ? { href: `/chowtal/${prev.slug}/sing`, title: prev.title }
          : null
      }
      next={
        next
          ? { href: `/chowtal/${next.slug}/sing`, title: next.title }
          : null
      }
      backHref={`/chowtal/${current.slug}`}
      backLabel="Exit singing mode"
    />
  );
}
