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

function isPlaceholderText(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    !normalized ||
    normalized.startsWith("latest facebook post") ||
    normalized.startsWith("newest facebook post") ||
    normalized.includes("no caption was returned") ||
    normalized.includes("native media was not returned")
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
  const [imageIsSharpEnough, setImageIsSharpEnough] = useState(true);
  const showImagePreview = Boolean(preview) && !imageFailed && imageIsSharpEnough;
  const hasRealCaption = !isPlaceholderText(post.text);

  if (!showImagePreview && !hasRealCaption && (imageFailed || !imageIsSharpEnough)) {
    return null;
  }

  return (
    <article
      className={clsx(
        "group relative overflow-hidden rounded-lg border bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:bg-zinc-950",
        post.isFlagged
          ? "border-rose-300 ring-2 ring-rose-100 dark:border-rose-500 dark:ring-rose-500/20"
          : post.isSeen
            ? "border-zinc-200 dark:border-zinc-800"
            : "border-nd-100 ring-2 ring-nd-50 dark:border-nd-400/40 dark:ring-nd-500/10"
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(post)}
        className="block w-full text-left"
        aria-label={`Open ${post.platform} post by ${post.person.fullName}`}
      >
        {showImagePreview ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <img
              src={preview}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={(event) => {
                const image = event.currentTarget;
                const shortestSide = Math.min(image.naturalWidth, image.naturalHeight);

                if (shortestSide > 0 && shortestSide < 260) {
                  setImageIsSharpEnough(false);
                }
              }}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
            />
            {post.mediaType === "video" ? (
              <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
                <Play size={20} fill="currentColor" />
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <AccountAvatar account={post.account} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {post.person.fullName}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {post.account.handle}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!post.isSeen ? (
                <span className="rounded-full bg-nd-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                  new
                </span>
              ) : null}
              {post.isFlagged ? (
                <Flag size={15} className="text-rose-600" fill="currentColor" />
              ) : null}
              {post.isPinned ? <Bookmark size={15} fill="currentColor" /> : null}
            </div>
          </div>

          {hasRealCaption ? (
            <p
              className={clsx(
                "whitespace-pre-line text-sm leading-6 text-zinc-700 dark:text-zinc-300",
                showImagePreview ? "line-clamp-4" : "line-clamp-7"
              )}
            >
              {post.text}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <PlatformBadge platform={post.platform} />
            <span className="text-xs font-medium text-zinc-400">
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>
      </button>

      <div
        className={clsx(
          "pointer-events-none absolute right-3 top-3 flex translate-y-1 gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
          !showImagePreview ? "top-auto bottom-3" : "top-3"
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
