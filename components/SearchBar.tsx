"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

export function SearchBar({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-3xl">
      <Search
        size={20}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
      />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search people, posts, platforms, topics..."
        className="h-[3.25rem] w-full rounded-full border border-zinc-200 bg-white/90 py-3.5 pl-12 pr-3 text-[13px] shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-nd-500 focus:ring-4 focus:ring-nd-100 sm:pr-12 sm:text-sm"
      />
      <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-400 sm:block">
        /
      </kbd>
    </div>
  );
}
