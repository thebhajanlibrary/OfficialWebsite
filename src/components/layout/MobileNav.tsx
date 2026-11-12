"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { logoutAction } from "@/lib/actions";
import { SearchBar } from "@/components/search/SearchBar";
import { BrandMark } from "@/components/layout/BrandMark";
import { LIBRARY_LINKS, NAV_GROUPS, navLinkActive } from "@/lib/nav";

export function MobileNav({ loggedIn = false }: { loggedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panel =
    mounted && open
      ? createPortal(
          <div className="fixed inset-0 z-[80] md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-primary/40"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <nav
              id="mobile-nav"
              aria-label="Mobile"
              className="absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col bg-surface pt-[env(safe-area-inset-top)] shadow-[0_16px_40px_rgba(21,34,56,0.2)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <p className="flex items-center gap-2.5 font-display text-xl font-semibold leading-none text-primary">
                  <BrandMark className="h-8 w-8" />
                  Bhajan Library
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary transition hover:bg-surface-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <div className="border-b border-border px-4 py-3">
                <SearchBar />
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                {NAV_GROUPS.map((group) => (
                  <div key={group.title} className="mb-4">
                    <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {group.title}
                    </p>
                    <ul>
                      {group.links.map((link) => {
                        const active = navLinkActive(pathname, link.href);
                        return (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className={`block rounded-xl px-3 py-2.5 text-base font-medium transition ${
                                active
                                  ? "bg-accent-soft text-primary"
                                  : "text-foreground/80 hover:bg-surface-muted hover:text-primary"
                              }`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                <ul>
                  {LIBRARY_LINKS.map((link) => {
                    const active = navLinkActive(pathname, link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`block rounded-xl px-3 py-2.5 text-base font-medium transition ${
                            active
                              ? "bg-accent-soft text-primary"
                              : link.href === "/upload"
                                ? "text-accent hover:bg-accent/10"
                                : "text-foreground/80 hover:bg-surface-muted hover:text-primary"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {loggedIn ? (
                  <form action={logoutAction} className="mt-4 px-1">
                    <button
                      type="submit"
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-muted transition hover:bg-surface-muted hover:text-foreground"
                    >
                      Log out
                    </button>
                  </form>
                ) : null}
              </div>
            </nav>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-primary transition hover:bg-surface-muted"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <Menu className="h-5 w-5" aria-hidden />
        )}
      </button>
      {panel}
    </div>
  );
}
