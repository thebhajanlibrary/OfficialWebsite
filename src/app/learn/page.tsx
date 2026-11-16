import type { Metadata } from "next";
import Link from "next/link";
import { LearnMascot } from "@/components/learn/LearnMascot";
import { LearnXp } from "@/components/learn/LearnXp";
import { LEARN_CATEGORIES, coursesInCategory } from "@/lib/learn/catalog";

export const metadata: Metadata = {
  title: "Bhajan Learn",
  description:
    "Lessons in languages, religion, culture, and devotional music. Caribistani (Caribbean Hindustani) is the first course.",
};

export default function LearnHomePage() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Bhajan Learn</p>
          <h1 className="font-display text-5xl font-semibold text-primary sm:text-6xl">Learn</h1>
          <p className="text-lg leading-relaxed text-muted">
            Short lessons on language, religion, culture, and the music itself. The library of recordings stays where it is. This section is for practice.
          </p>
          <p className="text-sm text-muted">Mor, the peacock, stays with you through each lesson.</p>
          <LearnXp />
        </div>
        <LearnMascot mood="idle" className="h-36 w-36 shrink-0" />
      </header>

      <section className="space-y-4" aria-labelledby="learn-categories">
        <h2 id="learn-categories" className="font-display text-3xl font-semibold">
          Categories
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {LEARN_CATEGORIES.map((category) => {
            const courses = coursesInCategory(category.slug);
            const available = courses.filter((course) => !course.comingSoon).length;
            const upcoming = courses.length - available;
            return (
              <li key={category.slug}>
                <Link
                  href={`/learn/${category.slug}`}
                  className="block h-full border border-border bg-surface p-5 transition hover:border-accent"
                >
                  <h3 className="font-display text-2xl font-semibold">{category.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{category.summary}</p>
                  <p className="mt-4 text-sm text-accent">
                    {available === 0
                      ? "No course published yet"
                      : `${available} course${available === 1 ? "" : "s"}`}
                    {upcoming > 0 && ` · ${upcoming} coming soon`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
