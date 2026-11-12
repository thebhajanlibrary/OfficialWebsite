"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAV_GROUPS, navLinkActive } from "@/lib/nav";

const primary = NAV_GROUPS[0].links.filter((link) => link.href !== "/");
const collections = NAV_GROUPS[1].links;

function itemClass(active: boolean) {
  return active
    ? "bg-accent-soft text-primary"
    : "text-foreground/75 hover:bg-surface-muted hover:text-primary";
}

export function DesktopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const collectionsActive = collections.some((link) =>
    navLinkActive(pathname, link.href)
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {primary.map((link) => {
        const active = navLinkActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${itemClass(active)}`}
          >
            {link.label}
          </Link>
        );
      })}

      <div ref={menuRef} className="relative">
        <button
          type="button"
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${itemClass(collectionsActive || open)}`}
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen((value) => !value)}
        >
          Collections
          <ChevronDown
            className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {open ? (
          <div className="absolute right-0 top-[calc(100%+0.45rem)] z-50 w-56 rounded-2xl border border-border bg-surface p-1.5 shadow-[0_16px_40px_rgba(21,34,56,0.12)]">
            {collections.map((link) => {
              const active = navLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${itemClass(active)}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
