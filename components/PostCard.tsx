"use client";

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
import { useState } from "react";
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

function PostPreviewFallback({ post }: { post: FeedPost }) {
  return (
    <div className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden bg-zinc-950 p-5 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_34%),linear-gradient(145deg,rgba(39,39,42,0.95),rgba(9,9,11,1))]" />
      <div className="relative flex items-center gap-3">
        <AccountAvatar account={post.account} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{post.person.fullName}</p>
          <p className="truncate text-xs text-zinc-300">{post.account.handle}</p>
        </div>
      </div>
      <p className="relative line-clamp-6 text-sm font-medium leading-6 text-zinc-100">
        {post.text || `Latest ${post.platform} post from ${post.person.fullName}.`}
      </p>
      <div className="relative flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-100 ring-1 ring-white/15">
          Post preview
        </span>
        <span className="truncate text-xs font-medium text-zinc-400">{post.platform}</span>
      </div>
    </div>
  );
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
  const [imageFailed, setImageFailed] = useState(false);
  const showImagePreview = Boolean(preview) && !imageFailed;

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
        {showImagePreview ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
            <img
              src={preview}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
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
          <div className="relative">
            {post.isFlagged ? (
              <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                <Flag size={12} fill="currentColor" />
                flagged
              </span>
            ) : null}
            {!post.isSeen ? (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-nd-600 px-2.5 py-1 text-xs font-semibold text-white">
                new
              </span>
            ) : null}
            <PostPreviewFallback post={post} />
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

          <p className="line-clamp-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {post.text}
          </p>

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
