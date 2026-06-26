export type Platform =
  | "X"
  | "Facebook"
  | "Instagram";

export type Person = {
  id: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  active: boolean;
};

export type SocialAccount = {
  id: string;
  personId: string;
  platform: Platform;
  handle: string;
  profileUrl: string;
  avatarUrl?: string;
  apiAccountId?: string;
  active: boolean;
  connected: boolean;
};

export type NormalizedConnectorPost = {
  platform: Platform;
  externalPostId: string;
  postUrl: string;
  text: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaType?: "image" | "video";
  publishedAt: string;
  engagementCount?: number;
  raw: Record<string, unknown>;
};

export type Post = {
  id: string;
  personId: string;
  socialAccountId: string;
  platform: Platform;
  externalPostId: string;
  postUrl: string;
  text: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaType?: "image" | "video";
  publishedAt: string;
  fetchedAt: string;
  rawJson: Record<string, unknown>;
  isSeen: boolean;
  isPinned: boolean;
  isFlagged: boolean;
  engagementCount: number;
  tags: string[];
  notes?: string;
};

export type FeedPost = Post & {
  person: Person;
  account: SocialAccount;
};

export type SortMode = "newest" | "platform" | "person";
