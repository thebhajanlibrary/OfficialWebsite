"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Category, CategoryType } from "@/lib/types";
import { CATEGORY_TYPE_LABELS } from "@/lib/types";
import { slugify } from "@/lib/utils";

type Props = {
  categories: Category[];
  initial?: {
    id?: string;
    title?: string;
    alternate_title?: string | null;
    slug?: string;
    artist_version?: string | null;
    roman_lyrics?: string;
    devanagari_lyrics?: string | null;
    translation?: string | null;
    meaning?: string | null;
    audio_url?: string | null;
    pdf_url?: string | null;
    display_order?: number | null;
    category_ids?: string[];
  };
  action: (formData: FormData) => Promise<void>;
};

const TYPE_ORDER: CategoryType[] = [
  "bhagwan",
  "occasion",
  "bhajan_type",
  "theme",
  "language",
  "suitability",
];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-foreground shadow-sm";
const textareaClass = `${inputClass} min-h-40 font-mono text-sm leading-relaxed`;

export function BhajanForm({ categories, initial, action }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initial?.category_ids ?? [])
  );

  const grouped = useMemo(() => {
    const map = new Map<CategoryType, Category[]>();
    for (const type of TYPE_ORDER) map.set(type, []);
    for (const cat of categories) {
      const list = map.get(cat.type) ?? [];
      list.push(cat);
      map.set(cat.type, list);
    }
    return map;
  }, [categories]);

  function toggleCategory(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form action={action} className="space-y-8">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="category_ids" value={id} />
      ))}

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
        <h2 className="font-display text-xl text-primary">Details</h2>
        <Field label="Title *">
          <input
            name="title"
            required
            className={inputClass}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="Alternative title">
          <input
            name="alternate_title"
            className={inputClass}
            defaultValue={initial?.alternate_title ?? ""}
          />
        </Field>
        <Field label="Slug *" hint="Used in the URL">
          <input
            name="slug"
            required
            className={inputClass}
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="Artist / version">
          <input
            name="artist_version"
            className={inputClass}
            defaultValue={initial?.artist_version ?? ""}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Audio or YouTube URL">
            <input
              name="audio_url"
              type="url"
              className={inputClass}
              defaultValue={initial?.audio_url ?? ""}
            />
          </Field>
          <Field label="PDF URL">
            <input
              name="pdf_url"
              type="url"
              className={inputClass}
              defaultValue={initial?.pdf_url ?? ""}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display order">
            <input
              name="display_order"
              type="number"
              className={inputClass}
              defaultValue={initial?.display_order ?? ""}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
        <h2 className="font-display text-xl text-primary">Lyrics & meaning</h2>
        <Field
          label="Romanised lyrics *"
          hint="One singing line per row. Blank lines separate verses."
        >
          <textarea
            name="roman_lyrics"
            required
            className={textareaClass}
            defaultValue={initial?.roman_lyrics ?? ""}
          />
        </Field>
        <Field
          label="Devanagari / Hindi lyrics"
          hint="Same line breaks as roman. Hidden on the site until Show Hindi is opened."
        >
          <textarea
            name="devanagari_lyrics"
            className={textareaClass}
            defaultValue={initial?.devanagari_lyrics ?? ""}
          />
        </Field>
        <Field
          label="English translation"
          hint="One English line per roman line (same line breaks). Shown under each lyric."
        >
          <textarea
            name="translation"
            className={textareaClass}
            defaultValue={initial?.translation ?? ""}
          />
        </Field>
        <Field label="Overall meaning">
          <textarea
            name="meaning"
            className={`${inputClass} min-h-28`}
            defaultValue={initial?.meaning ?? ""}
          />
        </Field>
      </section>

      <section className="space-y-6 rounded-2xl border border-border bg-surface p-4 sm:p-6">
        <div>
          <h2 className="font-display text-xl text-primary">Categories</h2>
          <p className="mt-1 text-sm text-muted">
            Select all that apply. The bhajan will appear under each one.
          </p>
        </div>

        {TYPE_ORDER.map((type) => {
          const list = grouped.get(type) ?? [];
          if (list.length === 0) return null;
          return (
            <div key={type}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
                {CATEGORY_TYPE_LABELS[type]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {list.map((cat) => {
                  const active = selected.has(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface-muted text-foreground hover:border-accent"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {initial?.id ? "Save changes" : "Add bhajan"}
        </button>
      </div>
    </form>
  );
}
