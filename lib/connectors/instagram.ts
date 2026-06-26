import {
  getFirstEnv,
  missingAccountId,
  missingCredentials,
  PlatformConnector,
  readJson
} from "@/lib/connectors/base";
import { fetchApifyPublicPosts, hasApifyActor } from "@/lib/connectors/apify";

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REELS";
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

type InstagramMediaResponse = {
  data?: InstagramMedia[];
};

function graphVersion() {
  return process.env.META_GRAPH_VERSION ?? "v21.0";
}

function getAccessToken() {
  return getFirstEnv(["INSTAGRAM_ACCESS_TOKEN", "META_ACCESS_TOKEN"]);
}

export const instagramConnector: PlatformConnector = {
  platform: "Instagram",
  async fetchPublicPosts(account) {
    if (hasApifyActor("Instagram")) {
      return fetchApifyPublicPosts("Instagram", account);
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      return missingCredentials("Instagram");
    }

    if (!account.apiAccountId) {
      return missingAccountId("Instagram", account);
    }

    const params = new URLSearchParams({
      fields:
        "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
      limit: process.env.INSTAGRAM_FETCH_LIMIT ?? "10",
      access_token: accessToken
    });
    const url = `https://graph.facebook.com/${graphVersion()}/${account.apiAccountId}/media?${params.toString()}`;
    const result = await readJson<InstagramMediaResponse>(url);

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
      posts: (result.data.data ?? []).map((post) => {
        const isVideo = post.media_type === "VIDEO" || post.media_type === "REELS";
        const preview = post.thumbnail_url ?? post.media_url;

        return {
          platform: "Instagram",
          externalPostId: post.id,
          postUrl: post.permalink ?? account.profileUrl,
          text: post.caption ?? "",
          mediaUrl: post.media_url,
          thumbnailUrl: preview,
          mediaType: isVideo ? "video" : preview ? "image" : undefined,
          publishedAt: post.timestamp ?? new Date().toISOString(),
          engagementCount: (post.like_count ?? 0) + (post.comments_count ?? 0),
          raw: post
        };
      })
    };
  }
};
