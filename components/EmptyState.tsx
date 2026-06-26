import { SearchX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white/70 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
        <SearchX size={22} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-ink">No posts found</h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
        Adjust the search, person, date, or platform filters to widen the board.
      </p>
    </div>
  );
}
