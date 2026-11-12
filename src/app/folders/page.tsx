import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { getFolders } from "@/lib/queries";

export const metadata = pageMeta({
  title: "Folders",
  description:
    "Shelves for Hanuman Chalisa, aarti, garba, birthday songs, and the other collections in the library.",
  path: "/folders",
});

export default async function FoldersPage() {
  const folders = await getFolders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
          Folders
        </h1>
        <p className="mt-1 text-muted">
          Hymns with multiple versions gathered in one place.
        </p>
      </div>

      {folders.length === 0 ? (
        <p className="border border-dashed border-border px-4 py-10 text-center text-muted">
          No folders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {folders.map(({ folder, count }) => (
            <Link
              key={folder.slug}
              href={`/folders/${folder.slug}`}
              className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-surface p-4 transition hover:border-accent sm:flex-row sm:items-start sm:gap-5 sm:p-5"
            >
              {folder.cover_url ? (
                <span className="relative aspect-square w-36 shrink-0 overflow-hidden rounded-lg border border-border bg-surface sm:w-40 md:w-44">
                  <Image
                    src={folder.cover_url}
                    alt=""
                    fill
                    sizes="176px"
                    className="object-cover object-center"
                  />
                </span>
              ) : null}
              <span className="min-w-0 flex-1">
                <p className="font-display text-2xl font-semibold text-primary transition group-hover:text-accent">
                  {folder.title}
                </p>
                <p className="mt-1 text-sm text-accent">
                  {folder.slug === "wedding"
                    ? `${count} track${count === 1 ? "" : "s"}`
                    : `${count} version${count === 1 ? "" : "s"}`}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {folder.description}
                </p>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
