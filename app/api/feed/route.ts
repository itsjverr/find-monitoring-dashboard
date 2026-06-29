import { NextResponse } from "next/server";
import { mockPosts } from "@/lib/mock-data";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { FeedPost, Person, Platform, SocialAccount } from "@/lib/types";

type DbFeedPost = {
  id: string;
  person_id: string;
  social_account_id: string;
  platform: Platform;
  external_post_id: string;
  post_url: string;
  text: string;
  media_url: string | null;
  thumbnail_url: string | null;
  media_type: "image" | "video" | null;
  published_at: string;
  fetched_at: string;
  raw_json: Record<string, unknown>;
  is_seen: boolean;
  is_pinned: boolean;
  is_flagged: boolean;
  engagement_count: number;
  tags: string[];
  notes: string | null;
  people: {
    id: string;
    full_name: string;
    role: string;
    avatar_url: string | null;
    active: boolean;
  };
  social_accounts: {
    id: string;
    person_id: string;
    platform: Platform;
    handle: string;
    profile_url: string;
    avatar_url: string | null;
    api_account_id: string | null;
    active: boolean;
  };
};

function toFeedPost(row: DbFeedPost): FeedPost {
  const person: Person = {
    id: row.people.id,
    fullName: row.people.full_name,
    role: row.people.role,
    avatarUrl: row.people.avatar_url ?? undefined,
    active: row.people.active
  };

  const account: SocialAccount = {
    id: row.social_accounts.id,
    personId: row.social_accounts.person_id,
    platform: row.social_accounts.platform,
    handle: row.social_accounts.handle,
    profileUrl: row.social_accounts.profile_url,
    avatarUrl: row.social_accounts.avatar_url ?? undefined,
    apiAccountId: row.social_accounts.api_account_id ?? undefined,
    active: row.social_accounts.active,
    connected:
      Boolean(row.social_accounts.api_account_id) ||
      Boolean(row.social_accounts.profile_url?.trim())
  };

  return {
    id: row.id,
    personId: row.person_id,
    socialAccountId: row.social_account_id,
    platform: row.platform,
    externalPostId: row.external_post_id,
    postUrl: row.post_url,
    text: row.text,
    mediaUrl: row.media_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    mediaType: row.media_type ?? undefined,
    publishedAt: row.published_at,
    fetchedAt: row.fetched_at,
    rawJson: row.raw_json,
    isSeen: row.is_seen,
    isPinned: row.is_pinned,
    isFlagged: row.is_flagged,
    engagementCount: row.engagement_count,
    tags: row.tags ?? [],
    notes: row.notes ?? undefined,
    person,
    account
  };
}

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({
      status: "mock",
      posts: mockPosts
    });
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id,
        person_id,
        social_account_id,
        platform,
        external_post_id,
        post_url,
        text,
        media_url,
        thumbnail_url,
        media_type,
        published_at,
        fetched_at,
        raw_json,
        is_seen,
        is_pinned,
        is_flagged,
        engagement_count,
        tags,
        notes,
        people:person_id (
          id,
          full_name,
          role,
          avatar_url,
          active
        ),
        social_accounts:social_account_id (
          id,
          person_id,
          platform,
          handle,
          profile_url,
          avatar_url,
          api_account_id,
          active
        )
      `
    )
    .order("published_at", { ascending: false })
    .limit(120);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    status: "ok",
    posts: ((data ?? []) as unknown as DbFeedPost[]).map(toFeedPost)
  });
}
