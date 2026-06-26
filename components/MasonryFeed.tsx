"use client";

import { FeedPost } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { PostCard } from "@/components/PostCard";

export function MasonryFeed({
  posts,
  onOpen,
  onSeen,
  onPin,
  onFlag
}: {
  posts: FeedPost[];
  onOpen: (post: FeedPost) => void;
  onSeen: (postId: string) => void;
  onPin: (postId: string) => void;
  onFlag: (postId: string) => void;
}) {
  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="masonry">
      {posts.map((post) => (
        <div key={post.id} className="masonry-item">
          <PostCard
            post={post}
            onOpen={onOpen}
            onSeen={onSeen}
            onPin={onPin}
            onFlag={onFlag}
          />
        </div>
      ))}
    </section>
  );
}
