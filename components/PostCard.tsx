"use client";

import Image from "next/image";
import {
  Bookmark,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flag,
  Play,
  Plus,
  Pin
} from "lucide-react";
import { FeedPost } from "@/lib/types";
import { AccountAvatar } from "@/components/AccountAvatar";
import { PlatformBadge } from "@/components/PlatformBadge";
import { clsx } from "clsx";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function PostCard({
  post,
  onOpen,
  onSeen,
  onPin,
  onFlag
}: {
  post: FeedPost;
  onOpen: (post: FeedPost) => void;
  onSeen: (postId: string) => void;
  onPin: (postId: string) => void;
  onFlag: (postId: string) => void;
}) {
  const preview = post.mediaUrl ?? post.thumbnailUrl;

  return (
    <article
      className={clsx(
        "group relative overflow-hidden rounded-lg border bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft",
        post.isFlagged
          ? "border-rose-300 ring-2 ring-rose-100 dark:border-rose-500 dark:ring-rose-500/20"
          : post.isSeen
            ? "border-zinc-200"
            : "border-nd-100 ring-2 ring-nd-50"
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(post)}
        className="block w-full text-left"
        aria-label={`Open ${post.platform} post by ${post.person.fullName}`}
      >
        {preview ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
            <Image
              src={preview}
              alt=""
              fill
              sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
            {post.mediaType === "video" ? (
              <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
                <Play size={20} fill="currentColor" />
              </span>
            ) : null}
            {!post.isSeen ? (
              <span className="absolute left-3 top-3 rounded-full bg-nd-600 px-2.5 py-1 text-xs font-semibold text-white">
                new
              </span>
            ) : null}
            {post.isFlagged ? (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                <Flag size={12} fill="currentColor" />
                flagged
              </span>
            ) : null}
          </div>
        ) : (
          <div className="relative bg-zinc-950 px-5 py-5 text-white">
            {post.isFlagged ? (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                <Flag size={12} fill="currentColor" />
                flagged
              </span>
            ) : null}
            <div className="mb-4 flex items-center gap-3">
              <AccountAvatar account={post.account} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{post.person.fullName}</p>
                <p className="truncate text-xs text-zinc-300">{post.account.handle}</p>
              </div>
            </div>
            <p className="line-clamp-6 text-xl font-semibold leading-snug">{post.text}</p>
          </div>
        )}

        <div className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <PlatformBadge platform={post.platform} />
            <div className="flex items-center gap-1 text-zinc-400">
              {post.isFlagged ? (
                <Flag size={16} className="text-rose-600" fill="currentColor" />
              ) : null}
              {post.isPinned ? <Bookmark size={16} fill="currentColor" /> : null}
              <span className="text-xs">{formatDate(post.publishedAt)}</span>
            </div>
          </div>

          {preview ? (
            <p className="line-clamp-4 text-sm leading-6 text-zinc-700">{post.text}</p>
          ) : null}

          <div className="flex items-center gap-3">
            <AccountAvatar account={post.account} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{post.person.fullName}</p>
              <p className="truncate text-xs text-zinc-500">
                {post.account.handle} · {post.person.role}
              </p>
            </div>
          </div>
        </div>
      </button>

      <div
        className={clsx(
          "pointer-events-none absolute right-3 flex translate-y-1 gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
          post.isFlagged ? "top-12" : "top-3"
        )}
      >
        <a
          href={post.postUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-sm transition hover:text-nd-700"
          title="Open original"
          aria-label="Open original"
        >
          <ExternalLink size={16} />
        </a>
        <button
          type="button"
          onClick={() => onSeen(post.id)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-sm transition hover:text-emerald-700"
          title="Mark as seen"
          aria-label="Mark as seen"
        >
          <CheckCircle2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => onPin(post.id)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-sm transition hover:text-amber-600"
          title="Pin"
          aria-label="Pin"
        >
          <Pin size={16} />
        </button>
        <button
          type="button"
          onClick={() => onFlag(post.id)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-sm transition hover:text-rose-700"
          title={post.isFlagged ? "Unflag" : "Flag"}
          aria-label={post.isFlagged ? "Unflag" : "Flag"}
        >
          <Flag size={16} fill={post.isFlagged ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(post.postUrl)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-sm transition hover:text-nd-700"
          title="Copy link"
          aria-label="Copy link"
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-sm transition hover:text-nd-700"
          title="Add tag"
          aria-label="Add tag"
        >
          <Plus size={16} />
        </button>
      </div>
    </article>
  );
}
