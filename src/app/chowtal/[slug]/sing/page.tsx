import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SingingMode } from "@/components/bhajan/SingingMode";
import { neighborsInChowtal } from "@/lib/chowtal";
import { pageMeta } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { current } = neighborsInChowtal(slug);
  if (!current) return { title: "Singing mode", robots: { index: false, follow: false } };
  return pageMeta({
    title: `Sing ${current.title}`,
    description: `Singing view of ${current.title}.`,
    path: `/chowtal/${current.slug}`,
    index: false,
  });
}

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
