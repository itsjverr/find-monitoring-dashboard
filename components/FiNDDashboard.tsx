"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Settings2 } from "lucide-react";
import {
  FeedFilter,
  FilterPills,
  isPlatformFilter
} from "@/components/FilterPills";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { MasonryFeed } from "@/components/MasonryFeed";
import { FlaggedPostsSection } from "@/components/FlaggedPostsSection";
import { PersonStatsSection } from "@/components/PersonStatsSection";
import { PostDetailDrawer } from "@/components/PostDetailDrawer";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FeedPost, Person, SocialAccount, SortMode } from "@/lib/types";

type FeedResponse = {
  posts?: FeedPost[];
};

function withinDateRange(dateValue: string, range: string) {
  if (range === "all") {
    return true;
  }

  const hours = range === "24h" ? 24 : range === "7d" ? 24 * 7 : 24 * 30;
  const threshold = Date.now() - hours * 60 * 60 * 1000;
  return new Date(dateValue).getTime() >= threshold;
}

export function FiNDDashboard({
  initialPosts,
  people,
  socialAccounts
}: {
  initialPosts: FeedPost[];
  people: Person[];
  socialAccounts: SocialAccount[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("All");
  const [person, setPerson] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const syncFeed = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch("/api/feed", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as FeedResponse;

        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
          setSelectedPost((currentPost) => {
            if (!currentPost) {
              return currentPost;
            }

            return data.posts?.find((post) => post.id === currentPost.id) ?? currentPost;
          });
        }
      } finally {
        if (showSpinner) {
          window.setTimeout(() => setIsRefreshing(false), 250);
        }
      }
    },
    []
  );

  useEffect(() => {
    void syncFeed(false);

    const interval = window.setInterval(() => {
      void syncFeed(false);
    }, 45000);

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        void syncFeed(false);
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [syncFeed]);

  const newCount = posts.filter((post) => !post.isSeen).length;
  const pinnedCount = posts.filter((post) => post.isPinned).length;
  const flaggedCount = posts.filter((post) => post.isFlagged).length;
  const disconnectedCount = socialAccounts.filter((account) => !account.connected).length;
  const flaggedPosts = posts
    .filter((post) => post.isFlagged)
    .sort((a, b) => b.engagementCount - a.engagementCount);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...posts]
      .filter((post) => {
        const searchable = [
          post.text,
          post.platform,
          post.person.fullName,
          post.person.role,
          post.account.handle,
          ...post.tags
        ]
          .join(" ")
          .toLowerCase();

        if (normalizedQuery && !searchable.includes(normalizedQuery)) {
          return false;
        }

        if (activeFilter === "New" && post.isSeen) {
          return false;
        }

        if (activeFilter === "Seen" && !post.isSeen) {
          return false;
        }

        if (isPlatformFilter(activeFilter) && post.platform !== activeFilter) {
          return false;
        }

        if (person !== "all" && post.personId !== person) {
          return false;
        }

        return withinDateRange(post.publishedAt, dateRange);
      })
      .sort((a, b) => {
        if (sortMode === "platform") {
          return a.platform.localeCompare(b.platform);
        }

        if (sortMode === "person") {
          return a.person.fullName.localeCompare(b.person.fullName);
        }

        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [activeFilter, dateRange, person, posts, query, sortMode]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  function markSeen(postId: string) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, isSeen: true } : post
      )
    );
    setSelectedPost((currentPost) =>
      currentPost?.id === postId ? { ...currentPost, isSeen: true } : currentPost
    );
  }

  function togglePin(postId: string) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, isPinned: !post.isPinned } : post
      )
    );
    setSelectedPost((currentPost) =>
      currentPost?.id === postId
        ? { ...currentPost, isPinned: !currentPost.isPinned }
        : currentPost
    );
  }

  function toggleFlag(postId: string) {
    const nextPost = posts.find((post) => post.id === postId);
    const nextIsFlagged = !(nextPost?.isFlagged ?? false);

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, isFlagged: !post.isFlagged } : post
      )
    );
    setSelectedPost((currentPost) =>
      currentPost?.id === postId
        ? { ...currentPost, isFlagged: !currentPost.isFlagged }
        : currentPost
    );

    fetch(`/api/posts/${postId}/flag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ isFlagged: nextIsFlagged })
    }).catch(() => {
      // The visual state stays optimistic in mock mode.
    });
  }

  function refreshFeed() {
    void syncFeed(true);
  }

  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-zinc-200/80 bg-paper/88 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-4 sm:px-6 xl:px-8">
          <div className="grid gap-4 lg:grid-cols-[220px_1fr_220px] lg:items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
                F<span className="text-nd-100">ND</span>
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-normal text-ink">
                  Fi<span className="text-nd-600">ND</span>
                </div>
                <div className="text-xs font-medium text-zinc-500">
                  Monitoring
                </div>
              </div>
            </Link>

            <SearchBar value={query} onChange={setQuery} />

            <div className="flex justify-start gap-2 lg:justify-end">
              <ThemeToggle />
              <button
                onClick={refreshFeed}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                title="Refresh feed"
                aria-label="Refresh feed"
              >
                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              </button>
              <Link
                href="/admin"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                title="Settings"
                aria-label="Settings"
              >
                <Settings2 size={18} />
              </Link>
            </div>
          </div>

          <FilterPills
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            person={person}
            onPersonChange={setPerson}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
            people={people}
          />
        </nav>
      </div>

      <section className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 xl:px-8">
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="New posts" value={newCount} tone="blue" />
          <Metric label="Flagged" value={flaggedCount} tone="rose" />
          <Metric label="Pinned" value={pinnedCount} tone="amber" />
          <Metric label="Not connected" value={disconnectedCount} tone="zinc" />
        </div>

        <FlaggedPostsSection
          posts={flaggedPosts}
          onOpen={setSelectedPost}
          onFlag={toggleFlag}
        />

        <PersonStatsSection people={people} posts={posts} />

        {isRefreshing ? (
          <LoadingSkeleton />
        ) : (
          <>
            <MasonryFeed
              posts={visiblePosts}
              onOpen={setSelectedPost}
              onSeen={markSeen}
              onPin={togglePin}
              onFlag={toggleFlag}
            />
            {visibleCount < filteredPosts.length ? (
              <div className="flex justify-center py-8">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 6)}
                  className="h-11 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                >
                  Load more
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>

      <PostDetailDrawer
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onSeen={markSeen}
        onPin={togglePin}
        onFlag={toggleFlag}
      />
    </main>
  );
}

function Metric({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: "blue" | "amber" | "rose" | "zinc";
}) {
  const toneClass = {
    blue: "bg-nd-50 text-nd-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    zinc: "bg-zinc-100 text-zinc-700"
  }[tone];

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white/80 px-4 py-3 shadow-sm">
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <span className={`rounded-full px-2.5 py-1 text-sm font-bold ${toneClass}`}>
        {value}
      </span>
    </div>
  );
}
