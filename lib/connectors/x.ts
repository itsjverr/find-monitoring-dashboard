import {
  getFirstEnv,
  missingCredentials,
  PlatformConnector,
  readJson
} from "@/lib/connectors/base";
import { SocialAccount } from "@/lib/types";

type XUserResponse = {
  data?: {
    id: string;
    username: string;
  };
};

type XTweetsResponse = {
  data?: Array<{
    id: string;
    text?: string;
    created_at?: string;
    attachments?: {
      media_keys?: string[];
    };
    public_metrics?: {
      retweet_count?: number;
      reply_count?: number;
      like_count?: number;
      quote_count?: number;
    };
  }>;
  includes?: {
    media?: Array<{
      media_key: string;
      type?: "photo" | "video" | "animated_gif";
      url?: string;
      preview_image_url?: string;
    }>;
  };
};

function getBearerToken() {
  return getFirstEnv(["X_BEARER_TOKEN", "TWITTER_BEARER_TOKEN"]);
}

function cleanUsername(account: SocialAccount) {
  return account.handle.replace(/^@/, "").trim();
}

async function resolveUserId(account: SocialAccount, bearerToken: string) {
  if (account.apiAccountId) {
    return account.apiAccountId;
  }

  const username = cleanUsername(account);

  if (!username) {
    return null;
  }

  const params = new URLSearchParams({
    "user.fields": "username"
  });
  const url = `https://api.twitter.com/2/users/by/username/${encodeURIComponent(
    username
  )}?${params.toString()}`;
  const result = await readJson<XUserResponse>(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  });

  if (!result.ok) {
    return null;
  }

  return result.data.data?.id ?? null;
}

function getEngagement(tweet: NonNullable<XTweetsResponse["data"]>[number]) {
  return (
    (tweet.public_metrics?.retweet_count ?? 0) +
    (tweet.public_metrics?.reply_count ?? 0) +
    (tweet.public_metrics?.like_count ?? 0) +
    (tweet.public_metrics?.quote_count ?? 0)
  );
}

export const xConnector: PlatformConnector = {
  platform: "X",
  async fetchPublicPosts(account) {
    const bearerToken = getBearerToken();

    if (!bearerToken) {
      return missingCredentials("X");
    }

    const userId = await resolveUserId(account, bearerToken);

    if (!userId) {
      return {
        ok: false,
        status: "not_connected",
        message: `X account ${account.handle} needs a valid username or API user ID.`,
        posts: []
      };
    }

    const params = new URLSearchParams({
      max_results: process.env.X_FETCH_LIMIT ?? "10",
      exclude: "retweets,replies",
      "tweet.fields": "created_at,public_metrics,attachments,text",
      expansions: "attachments.media_keys",
      "media.fields": "url,preview_image_url,type"
    });
    const url = `https://api.twitter.com/2/users/${userId}/tweets?${params.toString()}`;
    const result = await readJson<XTweetsResponse>(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });

    if (!result.ok) {
      return {
        ok: false,
        status: "error",
        message: result.message,
        posts: []
      };
    }

    const mediaByKey = new Map(
      (result.data.includes?.media ?? []).map((media) => [media.media_key, media])
    );

    return {
      ok: true,
      posts: (result.data.data ?? []).map((tweet) => {
        const media = tweet.attachments?.media_keys
          ?.map((key) => mediaByKey.get(key))
          .find(Boolean);
        const image = media?.url ?? media?.preview_image_url;

        return {
          platform: "X",
          externalPostId: tweet.id,
          postUrl: `https://x.com/${cleanUsername(account)}/status/${tweet.id}`,
          text: tweet.text ?? "",
          mediaUrl: image,
          thumbnailUrl: media?.preview_image_url ?? image,
          mediaType:
            media?.type === "video" || media?.type === "animated_gif"
              ? "video"
              : image
                ? "image"
                : undefined,
          publishedAt: tweet.created_at ?? new Date().toISOString(),
          engagementCount: getEngagement(tweet),
          raw: tweet
        };
      })
    };
  }
};
