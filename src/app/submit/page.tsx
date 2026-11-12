import { redirect } from "next/navigation";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Add a song",
  description: "Send a song to Bhajan Library.",
  path: "/upload",
  index: false,
});

export default function SubmitPage() {
  redirect("/upload");
}
