"use client";

import { Platform, SortMode } from "@/lib/types";
import { clsx } from "clsx";

const filters = [
  "All",
  "New",
  "Seen",
  "X",
  "Facebook",
  "Instagram"
] as const;

export type FeedFilter = (typeof filters)[number];

export function FilterPills({
  activeFilter,
  onFilterChange,
  person,
  onPersonChange,
  dateRange,
  onDateRangeChange,
  sortMode,
  onSortModeChange,
  people
}: {
  activeFilter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
  person: string;
  onPersonChange: (person: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  people: { id: string; fullName: string }[];
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={clsx(
              "h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition",
              activeFilter === filter
                ? "border-ink bg-ink text-white shadow-sm"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-ink"
            )}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
        <select
          value={person}
          onChange={(event) => onPersonChange(event.target.value)}
          className="h-10 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-700 outline-none focus:border-nd-500"
        >
          <option value="all">All people</option>
          {people.map((option) => (
            <option key={option.id} value={option.id}>
              {option.fullName}
            </option>
          ))}
        </select>
        <select
          value={dateRange}
          onChange={(event) => onDateRangeChange(event.target.value)}
          className="h-10 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-700 outline-none focus:border-nd-500"
        >
          <option value="all">Any date</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
        <select
          value={sortMode}
          onChange={(event) => onSortModeChange(event.target.value as SortMode)}
          className="h-10 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-700 outline-none focus:border-nd-500"
        >
          <option value="newest">Newest first</option>
          <option value="platform">Platform</option>
          <option value="person">Person</option>
        </select>
      </div>
    </div>
  );
}

export function isPlatformFilter(filter: FeedFilter): filter is Platform {
  return ["X", "Facebook", "Instagram"].includes(filter);
}
