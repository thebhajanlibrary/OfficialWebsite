import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SingingMode } from "@/components/bhajan/SingingMode";
import { getAdjacentBhajans } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { current } = await getAdjacentBhajans(slug);
  if (!current) return { title: "Singing mode", robots: { index: false, follow: false } };
  return pageMeta({
    title: `Sing ${current.title}`,
    description: `Singing view of ${current.title}. The full page, with the recording, is the one to share.`,
    path: `/bhajans/${current.slug}`,
    index: false,
  });
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
