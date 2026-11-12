import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { WeddingIndexContent } from "@/components/wedding/WeddingIndexContent";

export const metadata = pageMeta({
  title: "Wedding Songs",
  description:
    "Indo-Caribbean wedding songs: chutney, lawa, sehra, and the rest of the ceremony.",
  path: "/wedding",
});

export default function WeddingIndexPage() {
  return (
    <WeddingIndexContent
      breadcrumb={
        <p className="text-sm text-muted">
          <Link
            href="/browse/occasion/wedding"
            className="transition hover:text-primary"
          >
            Occasion · Wedding
          </Link>
          <span className="mx-2 text-border">·</span>
          <Link
            href="/folders/wedding"
            className="transition hover:text-primary"
          >
            Wedding folder
          </Link>
        </p>
      }
    />
  );
}
