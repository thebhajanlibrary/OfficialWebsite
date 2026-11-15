"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";

export type ShelfItem = {
  href: string;
  title: string;
  note: string;
  image: string;
};

export function RotatingShelf({ items }: { items: ShelfItem[] }) {
  const [visible, setVisible] = useState(4);
  const [showAll, setShowAll] = useState(false);

  useLayoutEffect(() => {
    const wide = window.matchMedia("(min-width: 640px)");
    const apply = () => setVisible(wide.matches ? 4 : 2);
    apply();
    wide.addEventListener("change", apply);
    return () => wide.removeEventListener("change", apply);
  }, []);

  const count = Math.min(visible, items.length);

  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <section className="space-y-5">
      <div className="flex items-end gap-4">
        <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
          On the shelf
        </h2>
        <span className="mb-2 hidden h-px flex-1 bg-border sm:block" />
        {items.length > count && (
          <button
            type="button"
            aria-expanded={showAll}
            onClick={() => setShowAll((value) => !value)}
            className="text-sm text-accent transition hover:text-primary"
          >
            {showAll ? "Show less" : "See all"}
          </button>
        )}
      </div>

      {showAll ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {items.map((item) => (
            <ShelfCard key={item.href} item={item} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden [container-type:inline-size]">
          <div
            className="shelf-marquee flex"
            style={{
              width: `calc(100cqw * ${items.length} / ${count} * 2)`,
              animationDuration: `${items.length * 4.5}s`,
            }}
          >
            {loop.map((item, i) => (
              <div
                key={`${item.href}-${i}`}
                className="shrink-0 px-1.5 sm:px-2"
                style={{ width: `calc(100cqw / ${count})` }}
              >
                <ShelfCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ShelfCard({ item }: { item: ShelfItem }) {
  return (
    <Link href={item.href} className="group block min-w-0">
      <span className="relative block aspect-square overflow-hidden rounded-xl border border-border bg-surface">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="220px"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </span>
      <span className="mt-2.5 block truncate font-display text-lg font-semibold text-primary group-hover:text-accent">
        {item.title}
      </span>
      <span className="block truncate text-sm text-muted">{item.note}</span>
    </Link>
  );
}
