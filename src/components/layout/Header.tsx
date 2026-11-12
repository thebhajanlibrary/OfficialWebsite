import Link from "next/link";
import { getCurrentUser } from "@/lib/queries";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavSearch } from "@/components/search/NavSearch";
import { BrandMark } from "@/components/layout/BrandMark";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 border-t-[3px] border-t-accent bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2.5">
          <BrandMark />
          <p className="font-display text-[1.5rem] font-semibold leading-none tracking-tight text-primary transition group-hover:text-primary-hover sm:text-[1.75rem]">
            Bhajan Library
          </p>
        </Link>

        <div className="hidden min-w-0 items-center gap-2 md:flex">
          <DesktopNav />
          <div className="relative z-50 shrink-0">
            <NavSearch />
          </div>
          <Link
            href="/upload"
            className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-accent-soft hover:text-primary"
          >
            Add a song
          </Link>
        </div>

        <MobileNav loggedIn={Boolean(user)} />
      </div>
    </header>
  );
}
