import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

const links = [
  { href: "/bhajans", label: "Bhajans" },
  { href: "/albums", label: "Albums" },
  { href: "/artists", label: "Artists" },
  { href: "/browse/occasion", label: "Occasions" },
  { href: "/calendar", label: "Calendar" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-muted">
          © {year} Bhajan Library
          <span className="px-1.5 text-border">·</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-primary">
            {CONTACT_EMAIL}
          </a>
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-muted transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
