"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CalendarDays,
  Download,
  Copy,
  Check,
  ExternalLink,
  Search,
  Sparkles,
  ChevronRight,
  Share2,
} from "lucide-react";
import {
  CALENDAR_LINKS,
  MONTH_NAMES,
  getCalendarYears,
  getUpcomingEventsByYear,
  groupEventsByMonth,
  localDateString,
  type CalendarEvent,
} from "@/lib/hindu-calendar";

export function HinduCalendarView() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const availableYears = getCalendarYears(now);
  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0] ?? currentYear
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const todayStr = localDateString(now);

  const yearEvents = getUpcomingEventsByYear(selectedYear, now);

  // Filter events
  const filteredEvents = yearEvents.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.summary.toLowerCase().includes(q) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.bhagwanSlug && e.bhagwanSlug.toLowerCase().includes(q)) ||
      MONTH_NAMES[e.month - 1].toLowerCase().includes(q)
    );
  });

  const monthGroups = groupEventsByMonth(filteredEvents);

  const handleCopy = () => {
    navigator.clipboard.writeText(CALENDAR_LINKS.icsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Subscribe & Action Bar */}
      <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-accent" />
              Sync Hindu Holidays to Your Calendar
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Subscribe once to get all major Hindu festivals automatically updated on your phone, Mac, or Google Calendar.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={CALENDAR_LINKS.googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-muted/60 px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-accent" />
              Google Calendar
            </a>

            <a
              href={CALENDAR_LINKS.webcalUrl}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-muted/60 px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted transition"
            >
              <Calendar className="h-3.5 w-3.5 text-accent" />
              Apple / Outlook
            </a>

            <a
              href={CALENDAR_LINKS.icsUrl}
              download="Hindu_Holidays.ics"
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/20 transition"
            >
              <Download className="h-3.5 w-3.5" />
              Download .ICS
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted hover:text-foreground transition"
              title="Copy calendar URL"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Year Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Year Selector */}
        {availableYears.length > 0 && (
          <div className="inline-flex rounded-xl border border-border bg-surface p-1 shadow-sm">
            {availableYears.map((year) => {
              const isSelected = selectedYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`rounded-lg px-4 py-1.5 text-xs sm:text-sm font-semibold transition ${
                    isSelected
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {year} Calendar
                </button>
              );
            })}
          </div>
        )}

        {/* Search Filter */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search festivals, deities, months..."
            className="w-full rounded-xl border border-border bg-surface pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Monthly Event List */}
      {monthGroups.length > 0 ? (
        <div className="space-y-6">
          {monthGroups.map((group) => (
            <div key={group.monthIndex} className="space-y-3">
              <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm py-1 border-b border-border/50">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {group.monthName} {selectedYear}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.events.map((event) => {
                  const eventDate = new Date(event.date + "T00:00:00");
                  const weekday = eventDate.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  const isToday = event.date === todayStr;

                  return (
                    <div
                      key={event.id}
                      className={`group relative flex flex-col justify-between rounded-xl border bg-surface p-4 transition hover:border-accent/50 hover:shadow-sm ${
                        isToday
                          ? "border-accent ring-1 ring-accent/30 bg-accent-soft/20"
                          : "border-border/80"
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Date header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-xs font-bold text-primary">
                              {event.day}
                            </span>
                            <span className="text-xs font-medium text-muted">
                              {weekday}, {group.monthName.slice(0, 3)}{" "}
                              {event.day}
                            </span>
                          </div>

                          {isToday && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                              <Sparkles className="h-2.5 w-2.5" />
                              Today
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-semibold text-sm sm:text-base text-primary group-hover:text-accent transition">
                          {event.summary}
                        </h4>

                        {/* Description */}
                        {event.description && (
                          <p className="text-xs text-muted leading-relaxed line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* Link to Bhajans or Occasion if applicable */}
                      <div className="pt-3 mt-2 border-t border-border/40 flex items-center justify-between">
                        {event.bhagwanSlug ? (
                          <Link
                            href={`/browse/bhagwan/${event.bhagwanSlug}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
                          >
                            Explore {event.bhagwanSlug} songs
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        ) : event.occasionSlug ? (
                          <Link
                            href={`/browse/occasion/${event.occasionSlug}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
                          >
                            Explore celebration songs
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-[11px] text-muted/60">
                            Sacred observance
                          </span>
                        )}

                        <span className="text-[10px] text-muted/50 font-mono">
                          {event.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            {searchQuery.trim()
              ? `No upcoming holidays found matching “${searchQuery}” in ${selectedYear}.`
              : `No upcoming holidays left in ${selectedYear}.`}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs text-accent hover:underline font-semibold"
          >
            Clear search filter
          </button>
        </div>
      )}
    </div>
  );
}
