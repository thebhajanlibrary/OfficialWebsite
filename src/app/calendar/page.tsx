import type { Metadata } from "next";
import { HinduCalendarView } from "@/components/calendar/HinduCalendarView";

export const metadata: Metadata = {
  title: "Hindu Calendar & Festivals",
  description:
    "Upcoming Hindu holidays, festivals, and sacred dates. Sync directly to your Google, Apple, or Outlook calendar.",
};

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
