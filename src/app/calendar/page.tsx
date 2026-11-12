import { pageMeta } from "@/lib/seo";
import { HinduCalendarView } from "@/components/calendar/HinduCalendarView";

export const metadata = pageMeta({
  title: "Hindu Calendar and Festivals",
  description:
    "Hindu festival dates for the year, with the bhajans that belong to each one.",
  path: "/calendar",
});

export default function CalendarPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
          Hindu Calendar & Festivals
        </h1>
        <p className="mt-1 text-sm text-muted">
          Religious festival dates, observances, and one-click calendar sync.
        </p>
      </div>

      <HinduCalendarView />
    </div>
  );
}
