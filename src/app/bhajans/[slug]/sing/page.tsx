import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SingingMode } from "@/components/bhajan/SingingMode";
import { getAdjacentBhajans } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { current } = await getAdjacentBhajans(slug);
  return { title: current ? `Sing · ${current.title}` : "Singing mode" };
}

export default async function SingPage({ params }: Props) {
  const { slug } = await params;
  const { current, prev, next } = await getAdjacentBhajans(slug);
  if (!current) notFound();

  return (
    <SingingMode
      current={current}
      prev={
        prev
          ? { href: `/bhajans/${prev.slug}/sing`, title: prev.title }
          : null
      }
      next={
        next
          ? { href: `/bhajans/${next.slug}/sing`, title: next.title }
          : null
      }
      backHref={`/bhajans/${current.slug}`}
      backLabel="Back to bhajan"
    />
  );
}
