import type { ReactNode } from "react";

export function LegalDocument({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl py-4 sm:py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        Bhajan Library
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-muted">Last updated {updated}</p>
      <div className="mt-10 space-y-8">{children}</div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-semibold text-primary">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}
