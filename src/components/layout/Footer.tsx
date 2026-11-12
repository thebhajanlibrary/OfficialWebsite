import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { CONTACT_EMAIL } from "@/lib/site";

const columns = [
  {
    title: "Browse",
    links: [
      { href: "/bhajans", label: "Bhajans" },
      { href: "/albums", label: "Albums" },
      { href: "/artists", label: "Artists" },
      { href: "/browse/occasion", label: "Occasions" },
    ],
  },
  {
    title: "Library",
    links: [
      { href: "/calendar", label: "Hindu Calendar" },
      { href: "/upload", label: "Upload a song" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms and Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-surface/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="flex items-center gap-2.5 font-display text-xl font-semibold text-primary">
              <BrandMark className="h-9 w-9" />
              Bhajan Library
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Lyrics and recordings for satsang, organised by path, artist, and
              occasion.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block text-sm font-medium text-primary transition hover:text-accent"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {column.title}
              </p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-border/70 pt-6">
          <p className="text-xs text-muted">© {year} Bhajan Library</p>
        </div>
      </div>
    </footer>
  );
}
