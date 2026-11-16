import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LearnMascot } from "@/components/learn/LearnMascot";
import { coursesInCategory, getLearnCategory, LEARN_CATEGORIES } from "@/lib/learn/catalog";
import type { LearnCourse } from "@/lib/learn/types";

function CourseCardContent({ course }: { course: LearnCourse }) {
  return (
    <>
      {course.cover && (
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={course.cover.src}
            alt={course.cover.alt}
            width={1254}
            height={1254}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="aspect-square w-full object-contain"
          />
          {course.comingSoon && (
            <>
              <div className="absolute inset-0 flex items-center justify-center bg-black/15 p-6" aria-hidden="true">
                <span className="font-display text-5xl font-semibold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] sm:text-6xl">
                  {course.title}
                </span>
              </div>
              <p className="absolute inset-x-0 bottom-0 bg-primary px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Coming soon
              </p>
            </>
          )}
        </div>
      )}
      <div className="p-5">
        <h2 className="font-display text-3xl font-semibold">{course.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{course.summary}</p>
      </div>
    </>
  );
}

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return LEARN_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getLearnCategory(slug);
  return { title: category ? category.title : "Learn" };
}

export default async function LearnCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getLearnCategory(slug);
  if (!category) notFound();
  const courses = coursesInCategory(slug);

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">
        <Link href="/learn" className="hover:text-primary">
          Learn
        </Link>
      </p>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <h1 className="font-display text-5xl font-semibold">{category.title}</h1>
          <p className="text-lg leading-relaxed text-muted">{category.summary}</p>
        </div>
        <LearnMascot mood="idle" decorative className="h-24 w-24 shrink-0" />
      </header>
      {courses.length === 0 ? (
        <p className="max-w-xl leading-relaxed text-muted">
          No course is published here yet. New courses are added only when the vocabulary has been checked.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <li key={course.slug}>
              {course.comingSoon ? (
                <article className="h-full overflow-hidden border border-border bg-surface">
                  <CourseCardContent course={course} />
                </article>
              ) : (
                <Link
                  href={`/learn/${slug}/${course.slug}`}
                  className="block h-full overflow-hidden border border-border bg-surface transition hover:border-accent"
                >
                  <CourseCardContent course={course} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
