import type { Metadata } from "next";
import Link from "next/link";
import { WeddingIndexContent } from "@/components/wedding/WeddingIndexContent";

export const metadata: Metadata = {
  title: "Wedding Songs",
  description:
    "Indo-Caribbean wedding songs — chutney, chutney-bhajan, lawa, sehra, and more.",
};

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
