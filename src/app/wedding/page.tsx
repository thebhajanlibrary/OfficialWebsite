import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { WeddingIndexContent } from "@/components/wedding/WeddingIndexContent";

export const metadata = pageMeta({
  title: "Chutney wedding songs",
  description:
    "Chutney wedding songs tagged in the Wedding folder on Bhajan Library.",
  path: "/wedding",
});

export default function WeddingIndexPage() {
  return (
    <WeddingIndexContent
      breadcrumb={
        <p className="text-sm text-muted">
          <Link href="/folders/wedding" className="transition hover:text-primary">
            Wedding folder
          </Link>
        </p>
      }
    />
  );
}
