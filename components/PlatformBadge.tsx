import { Platform } from "@/lib/types";
import { clsx } from "clsx";

const platformStyles: Record<Platform, string> = {
  X: "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950",
  Facebook:
    "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-500/20",
  Instagram:
    "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-500/20"
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span
      className={clsx(
        "inline-flex h-7 items-center rounded-full px-2.5 text-xs font-semibold ring-1 ring-inset",
        platformStyles[platform]
      )}
    >
      {platform}
    </span>
  );
}
