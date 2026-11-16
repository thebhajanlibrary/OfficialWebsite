import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KitchenStudy } from "@/components/learn/KitchenStudy";
import { getLearnCategory, getUnit, pendingPictureCount } from "@/lib/learn/catalog";

type Props = { params: Promise<{ category: string; course: string; unit: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, unit } = await params;
  const found = getUnit(course, unit);
  return { title: found ? found.unit.title : "Unit" };
}

export default async function UnitPage({ params }: Props) {
  const { category: categorySlug, course: courseSlug, unit: unitSlug } = await params;
  const category = getLearnCategory(categorySlug);
  const found = getUnit(courseSlug, unitSlug);
  if (!category || !found || found.course.categorySlug !== category.slug) notFound();
  const { course, unit } = found;

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">
        <Link href="/learn" className="hover:text-primary">
          Learn
        </Link>
        {" · "}
        <Link href={`/learn/${category.slug}/${course.slug}`} className="hover:text-primary">
          {course.title}
        </Link>
      </p>
      <header className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Unit {String(unit.order).padStart(2, "0")}
        </p>
        <h1 className="font-display text-5xl font-semibold">{unit.title}</h1>
        <p className="text-lg leading-relaxed text-muted">{unit.summary}</p>
      </header>
      {unit.vocabulary && <KitchenStudy entries={unit.vocabulary} />}
      {unit.lessons.length === 0 ? (
        <p className="max-w-xl leading-relaxed text-muted">
          Vocabulary for this unit is not on the site yet. It will be added from the reference materials after the words and photographs are checked.
        </p>
      ) : (
        <ul className="space-y-3">
          {unit.lessons.map((lesson) => {
            const waiting = pendingPictureCount(lesson.questions);
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/learn/${category.slug}/${course.slug}/${unit.slug}/${lesson.slug}`}
                  className="block rounded-3xl border-2 border-b-4 border-border bg-surface p-6 transition hover:border-[#58b51d]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {lesson.level}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">{lesson.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{lesson.summary}</p>
                  {waiting > 0 ? (
                    <p className="mt-3 text-sm text-muted">
                      {waiting} picture {waiting === 1 ? "question" : "questions"} waiting on photographs.
                    </p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
