"use client";

import { useState } from "react";
import { BarChart3, ChevronDown } from "lucide-react";
import { FeedPost, Person } from "@/lib/types";
import { PersonAvatar } from "@/components/PersonAvatar";
import { clsx } from "clsx";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value);
}

function formatFrequency(posts: FeedPost[]) {
  if (posts.length === 0) {
    return "0/week";
  }

  const times = posts.map((post) => new Date(post.publishedAt).getTime());
  const spanDays = Math.max(
    1,
    Math.ceil((Math.max(...times) - Math.min(...times)) / (1000 * 60 * 60 * 24)) + 1
  );
  const perWeek = (posts.length / spanDays) * 7;

  return `${perWeek.toFixed(perWeek >= 10 ? 0 : 1)}/week`;
}

export function PersonStatsSection({
  people,
  posts
}: {
  people: Person[];
  posts: FeedPost[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rows = people
    .map((person) => {
      const personPosts = posts.filter((post) => post.personId === person.id);
      const engagement = personPosts.reduce(
        (total, post) => total + post.engagementCount,
        0
      );

      return {
        person,
        postCount: personPosts.length,
        engagement,
        frequency: formatFrequency(personPosts)
      };
    })
    .sort((a, b) => b.engagement - a.engagement);

  return (
    <section className="mb-5 rounded-lg border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-nd-50 text-nd-700 dark:bg-nd-500/15 dark:text-nd-100">
            <BarChart3 size={18} />
          </span>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink">
              Stats by person
            </h2>
            <p className="text-sm text-zinc-500">
              Posts, engagement and publishing frequency.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
          {rows.length} people
          <ChevronDown
            size={16}
            className={clsx("transition", isExpanded ? "rotate-180" : "rotate-0")}
          />
        </span>
      </button>

      {isExpanded ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {rows.map((row) => (
            <article
              key={row.person.id}
              className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-950/70"
            >
              <div className="flex items-center gap-3">
                <PersonAvatar person={row.person} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {row.person.fullName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{row.person.role}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat label="Posts" value={String(row.postCount)} />
                <Stat label="Eng." value={formatNumber(row.engagement)} />
                <Stat label="Freq." value={row.frequency} />
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 px-2 py-2 dark:bg-zinc-800/80">
      <p className="text-sm font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}
