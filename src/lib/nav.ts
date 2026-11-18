import { LEARN_ENABLED, TRADITIONAL_CHUTNEY_ENABLED } from "@/lib/features";

export type NavLink = { href: string; label: string };

export type NavGroup = { title: string; links: NavLink[] };

/** Mobile menu. Home is exact-match; other links match their section. */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Library",
    links: [
      { href: "/", label: "Home" },
      { href: "/bhajans", label: "Bhajans" },
      { href: "/albums", label: "Albums" },
      { href: "/artists", label: "Artists" },
      ...(LEARN_ENABLED ? [{ href: "/learn", label: "Learn" }] : []),
    ],
  },
  {
    title: "Collections",
    links: [
      ...(TRADITIONAL_CHUTNEY_ENABLED
        ? [{ href: "/chutney", label: "Traditional Chutney" }]
        : []),
      { href: "/folders/chutney-style-bhajan", label: "Chutney Bhajan" },
      { href: "/chowtal", label: "Chowtal" },
      { href: "/folders/wedding", label: "Wedding" },
      { href: "/folders/funeral-memorial", label: "Funeral & Memorial" },
      { href: "/folders/mantras", label: "Mantras" },
      { href: "/browse/occasion", label: "Occasions" },
      { href: "/browse/bhagwan", label: "By Bhagwan" },
      { href: "/calendar", label: "Calendar" },
    ],
  },
];

export const LIBRARY_LINKS: NavLink[] = [
  { href: "/upload", label: "Upload a song" },
  { href: "/contact", label: "Contact" },
];

export function navLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
