import { notFound } from "next/navigation";
import { LEARN_ENABLED } from "@/lib/features";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  if (!LEARN_ENABLED) notFound();
  return children;
}
