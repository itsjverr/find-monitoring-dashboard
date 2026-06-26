import {
  getFirstEnv,
  missingAccountId,
  missingCredentials,
  PlatformConnector,
  readJson
} from "@/lib/connectors/base";
import { fetchApifyPublicPosts, hasApifyActor } from "@/lib/connectors/apify";
import { NormalizedConnectorPost, SocialAccount } from "@/lib/types";

type FacebookPost = {
  id: string;
  message?: string;
  story?: string;
  created_time?: string;
  permalink_url?: string;
  full_picture?: string;
  shares?: { count?: number };
  reactions?: { summary?: { total_count?: number } };
  comments?: { summary?: { total_count?: number } };
  attachments?: {
    data?: Array<{
      type?: string;
      url?: string;
      media?: {
        image?: {
          src?: string;
        };
      };
    }>;
  };
};

type FacebookPostsResponse = {
  data?: FacebookPost[];
};

function graphVersion() {
  return process.env.META_GRAPH_VERSION ?? "v21.0";
}

function getAccessToken() {
  return getFirstEnv(["FACEBOOK_ACCESS_TOKEN", "META_ACCESS_TOKEN"]);
}

function getPostImage(post: FacebookPost) {
  return (
    post.full_picture ??
    post.attachments?.data?.find((attachment) => attachment.media?.image?.src)?.media?.image?.src
  );
}

function getEngagement(post: FacebookPost) {
  return (
    (post.shares?.count ?? 0) +
    (post.comments?.summary?.total_count ?? 0) +
    (post.reactions?.summary?.total_count ?? 0)
  );
}

function normalizePost(account: SocialAccount, post: FacebookPost): NormalizedConnectorPost {
  const image = getPostImage(post);

  return {
    platform: "Facebook",
    externalPostId: post.id,
    postUrl: post.permalink_url ?? account.profileUrl,
    text: post.message ?? post.story ?? "",
    mediaUrl: image,
    thumbnailUrl: image,
    mediaType: image ? "image" : undefined,
    publishedAt: post.created_time ?? new Date().toISOString(),
    engagementCount: getEngagement(post),
    raw: post
  };
}

export const facebookConnector: PlatformConnector = {
  platform: "Facebook",
  async fetchPublicPosts(account) {
    if (hasApifyActor("Facebook")) {
      return fetchApifyPublicPosts("Facebook", account);
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      return missingCredentials("Facebook");
    }

    if (!account.apiAccountId) {
      return missingAccountId("Facebook", account);
    }

    const params = new URLSearchParams({
      fields:
        "id,message,story,created_time,permalink_url,full_picture,attachments{media,type,url},shares,comments.summary(true),reactions.summary(true)",
      limit: process.env.FACEBOOK_FETCH_LIMIT ?? "10",
      access_token: accessToken
    });
    const url = `https://graph.facebook.com/${graphVersion()}/${account.apiAccountId}/posts?${params.toString()}`;
    const result = await readJson<FacebookPostsResponse>(url);

    if (!result.ok) {
      return {
        ok: false,
        status: "error",
        message: result.message,
        posts: []
      };
    }

    return {
      ok: true,
      posts: (result.data.data ?? []).map((post) => normalizePost(account, post))
    };
  }
};
