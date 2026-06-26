"use client";

import Image from "next/image";
import {
  CheckCircle2,
  ExternalLink,
  Flag,
  Pin,
  Tag,
  X as CloseIcon
} from "lucide-react";
import { FeedPost } from "@/lib/types";
import { AccountAvatar } from "@/components/AccountAvatar";
import { PlatformBadge } from "@/components/PlatformBadge";
import { useEffect } from "react";

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function PostDetailDrawer({
  post,
  onClose,
  onSeen,
  onPin,
  onFlag
}: {
  post: FeedPost | null;
  onClose: () => void;
  onSeen: (postId: string) => void;
  onPin: (postId: string) => void;
  onFlag: (postId: string) => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!post) {
    return null;
  }

  const preview = post.mediaUrl ?? post.thumbnailUrl;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
        aria-label="Close detail drawer"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-zinc-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <AccountAvatar account={post.account} />
            <div>
              <p className="font-semibold text-ink">{post.person.fullName}</p>
              <p className="text-sm text-zinc-500">
                {post.account.handle} · {post.person.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50"
            aria-label="Close"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {preview ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={preview}
                alt=""
                fill
                unoptimized={preview.startsWith("data:")}
                sizes="560px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <PlatformBadge platform={post.platform} />
            {!post.isSeen ? (
              <span className="rounded-full bg-nd-50 px-2.5 py-1 text-xs font-semibold text-nd-700">
                new
              </span>
            ) : null}
            {post.isFlagged ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">
                <Flag size={12} fill="currentColor" />
                flagged
              </span>
            ) : null}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>

          <p className="whitespace-pre-line text-lg leading-8 text-ink">{post.text}</p>

          <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
            <Meta label="Published" value={formatFullDate(post.publishedAt)} />
            <Meta label="Fetched" value={formatFullDate(post.fetchedAt)} />
            <Meta label="Handle" value={post.account.handle} />
            <Meta label="Platform" value={post.platform} />
            <Meta label="External ID" value={post.externalPostId} />
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-zinc-700">Notes</span>
            <textarea
              defaultValue={post.notes}
              placeholder="Add internal notes..."
              className="mt-2 min-h-28 w-full resize-none rounded-lg border border-zinc-200 bg-white p-4 text-sm outline-none transition focus:border-nd-500 focus:ring-4 focus:ring-nd-100"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <a
              href={post.postUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              <ExternalLink size={16} />
              Open original
            </a>
            <button
              type="button"
              onClick={() => onSeen(post.id)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <CheckCircle2 size={16} />
              Mark as seen
            </button>
            <button
              type="button"
              onClick={() => onPin(post.id)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <Pin size={16} />
              {post.isPinned ? "Unpin" : "Pin"}
            </button>
            <button
              type="button"
              onClick={() => onFlag(post.id)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-rose-200 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-200 dark:hover:bg-rose-500/10"
            >
              <Flag size={16} fill={post.isFlagged ? "currentColor" : "none"} />
              {post.isFlagged ? "Unflag" : "Flag"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      <span className="truncate font-medium text-zinc-800">{value}</span>
    </div>
  );
}
