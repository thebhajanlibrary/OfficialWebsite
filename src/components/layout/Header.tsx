import Link from "next/link";
import { getCurrentUser } from "@/lib/queries";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavSearch } from "@/components/search/NavSearch";
import { UploadCloud } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";

const links = [
  { href: "/bhajans", label: "Bhajans" },
  { href: "/albums", label: "Albums" },
  { href: "/chutney", label: "Chutney" },
  { href: "/folders/chutney-style-bhajan", label: "Chutney Bhajan" },
  { href: "/browse/occasion", label: "Occasion" },
  { href: "/calendar", label: "Calendar" },
  { href: "/chowtal", label: "Chowtal" },
  { href: "/artists", label: "Artists" },
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 backdrop-blur-md animate-fade">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2.5">
          <BrandMark />
          <p className="font-display text-[1.5rem] font-semibold leading-none tracking-tight text-primary transition group-hover:text-primary-hover sm:text-[1.75rem]">
            Bhajan Library
          </p>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          aria-label="Main"
          className="hidden min-w-0 items-center justify-end gap-0.5 md:flex"
        >
          <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link whitespace-nowrap px-2.5 py-2 text-sm font-medium text-foreground/70 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search Bar in Navigation */}
          <div className="relative z-50 ml-1 shrink-0">
            <NavSearch />
          </div>

          <Link
            href="/upload"
            className="ml-1.5 flex shrink-0 items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/20"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Upload Song
          </Link>
        </nav>

        <MobileNav links={links} loggedIn={Boolean(user)} />
      </div>
    </header>
  );
}
