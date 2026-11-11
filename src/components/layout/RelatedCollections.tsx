import Image from "next/image";
import Link from "next/link";

export type RelatedCollection = {
  href: string;
  title: string;
  hint: string;
  kicker?: string;
  cover_url?: string;
};

export function RelatedCollections({
  heading = "Also for Holi / Phagwah",
  items,
}: {
  heading?: string;
  items: RelatedCollection[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-primary">{heading}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex gap-4 overflow-hidden rounded-xl border border-border bg-surface p-3 transition hover:border-accent"
          >
            {item.cover_url ? (
              <span className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border border-border sm:w-20">
                <Image
                  src={item.cover_url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </span>
            ) : null}
            <span className="min-w-0 self-center">
              {item.kicker ? (
                <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                  {item.kicker}
                </span>
              ) : null}
              <span className="block font-display text-lg font-semibold text-primary transition group-hover:text-accent">
                {item.title}
              </span>
              <span className="mt-0.5 block text-sm text-muted">{item.hint}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
