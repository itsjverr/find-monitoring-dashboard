"use client";

import { AlertTriangle, Flag } from "lucide-react";
import { FeedPost } from "@/lib/types";
import { AccountAvatar } from "@/components/AccountAvatar";
import { PlatformBadge } from "@/components/PlatformBadge";

function formatEngagement(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value);
}

export function FlaggedPostsSection({
  posts,
  onOpen,
  onFlag
}: {
  posts: FeedPost[];
  onOpen: (post: FeedPost) => void;
  onFlag: (postId: string) => void;
}) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mb-5 rounded-lg border border-rose-200 bg-rose-50/80 p-4 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white">
            <AlertTriangle size={18} />
          </span>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-rose-900 dark:text-rose-100">
              Flagged posts
            </h2>
            <p className="text-sm text-rose-700 dark:text-rose-200">
              High-priority items for immediate attention.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-rose-700 shadow-sm dark:bg-zinc-900 dark:text-rose-200">
          {posts.length}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <article
            key={post.id}
            className="rounded-lg border border-rose-200 bg-white p-3 shadow-sm dark:border-rose-500/30 dark:bg-zinc-950/70"
          >
            <button
              type="button"
              onClick={() => onOpen(post)}
              className="mb-3 block w-full text-left"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <PlatformBadge platform={post.platform} />
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-200">
                  {formatEngagement(post.engagementCount)} engagement
                </span>
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-ink">{post.text}</p>
            </button>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <AccountAvatar account={post.account} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {post.person.fullName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {post.account.handle} · {post.person.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onFlag(post.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-100"
                title="Unflag"
                aria-label="Unflag"
              >
                <Flag size={16} fill="currentColor" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
