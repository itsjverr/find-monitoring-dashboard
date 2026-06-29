import { ConnectorResult } from "@/lib/connectors/base";
import { NormalizedConnectorPost, Platform, SocialAccount } from "@/lib/types";

type ApifyItem = Record<string, unknown>;

function platformKey(platform: Platform) {
  return platform === "X" ? "X" : platform.toUpperCase();
}

function getActorId(platform: Platform) {
  return process.env[`APIFY_${platformKey(platform)}_ACTOR_ID`];
}

function getInputTemplate(platform: Platform) {
  return process.env[`APIFY_${platformKey(platform)}_INPUT_TEMPLATE`];
}

function maxItems() {
  return Number(process.env.APIFY_MAX_ITEMS ?? "5");
}

export function hasApifyActor(platform: Platform) {
  return Boolean(process.env.APIFY_TOKEN && getActorId(platform));
}

function replaceTemplateValues(template: string, account: SocialAccount) {
  const handleNoAt = account.handle.replace(/^@/, "");
  return template
    .replaceAll("{{profileUrl}}", account.profileUrl)
    .replaceAll("{{handle}}", account.handle)
    .replaceAll("{{handleNoAt}}", handleNoAt)
    .replaceAll("{{apiAccountId}}", account.apiAccountId ?? "")
    .replaceAll("{{limit}}", String(maxItems()));
}

function buildInput(platform: Platform, account: SocialAccount) {
  const template = getInputTemplate(platform);

  if (template) {
    return JSON.parse(replaceTemplateValues(template, account)) as Record<string, unknown>;
  }

  return {
    startUrls: [{ url: account.profileUrl }],
    maxItems: maxItems(),
    resultsLimit: maxItems(),
    resultsType: "posts"
  };
}

function asObject(value: unknown): ApifyItem | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApifyItem)
    : null;
}

function getPath(item: ApifyItem, path: string) {
  return path
    .split(".")
    .reduce<unknown>((current, key) => asObject(current)?.[key], item);
}

function pickString(item: ApifyItem, paths: string[]) {
  for (const path of paths) {
    const value = getPath(item, path);

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function pickNumber(item: ApifyItem, paths: string[]) {
  for (const path of paths) {
    const value = getPath(item, path);

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value.replace(/[^\d.-]/g, ""));

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

function pickFirstArrayString(item: ApifyItem, paths: string[]) {
  for (const path of paths) {
    const value = getPath(item, path);

    if (Array.isArray(value)) {
      const firstString = value.find((entry) => typeof entry === "string");

      if (firstString) {
        return firstString as string;
      }

      const firstObject = value.map(asObject).find(Boolean);
      const image = firstObject
        ? pickString(firstObject, ["url", "src", "image", "imageUrl", "displayUrl"])
        : undefined;

      if (image) {
        return image;
      }
    }
  }

  return undefined;
}

function looksLikeImageUrl(value: string) {
  return (
    /^https?:\/\//i.test(value) &&
    (/\.(avif|gif|jpe?g|png|webp)(\?|$)/i.test(value) ||
      /scontent|fbcdn|cdninstagram|twimg|image|photo|picture/i.test(value))
  );
}

function findImageUrl(value: unknown, depth = 0): string | undefined {
  if (depth > 5 || value == null) {
    return undefined;
  }

  if (typeof value === "string") {
    return looksLikeImageUrl(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const result = findImageUrl(entry, depth + 1);

      if (result) {
        return result;
      }
    }

    return undefined;
  }

  const object = asObject(value);

  if (!object) {
    return undefined;
  }

  const preferredKeys = [
    "full_picture",
    "fullPicture",
    "displayUrl",
    "imageUrl",
    "image",
    "thumbnailUrl",
    "thumbnail",
    "picture",
    "photo",
    "src",
    "url"
  ];

  for (const key of preferredKeys) {
    const result = findImageUrl(object[key], depth + 1);

    if (result) {
      return result;
    }
  }

  for (const entry of Object.values(object)) {
    const result = findImageUrl(entry, depth + 1);

    if (result) {
      return result;
    }
  }

  return undefined;
}

function toIsoDate(value: string | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  const numeric = Number(value);
  const date =
    Number.isFinite(numeric) && numeric > 0
      ? new Date(numeric > 10_000_000_000 ? numeric : numeric * 1000)
      : new Date(value);

  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function fallbackExternalId(platform: Platform, account: SocialAccount, item: ApifyItem) {
  const base = pickString(item, ["url", "postUrl", "permalink", "link"]) ?? account.profileUrl;
  return `apify-${platform}-${encodeURIComponent(base).slice(0, 180)}`;
}

function normalizeApifyItem(
  platform: Platform,
  account: SocialAccount,
  item: ApifyItem
): NormalizedConnectorPost {
  const postUrl =
    pickString(item, [
      "url",
      "postUrl",
      "permalink",
      "permalinkUrl",
      "shortCodeUrl",
      "link",
      "facebookUrl"
    ]) ?? account.profileUrl;
  const image =
    pickString(item, [
      "full_picture",
      "fullPicture",
      "picture",
      "photo",
      "displayUrl",
      "imageUrl",
      "image",
      "thumbnail",
      "thumbnailUrl",
      "mediaUrl",
      "videoThumbnail",
      "owner.profilePicUrl"
    ]) ??
    pickFirstArrayString(item, ["images", "imageUrls", "media", "attachments"]) ??
    findImageUrl(item);
  const video = pickString(item, ["videoUrl", "video", "video.url", "videoUrlHd"]);
  const text =
    pickString(item, [
      "text",
      "caption",
      "description",
      "message",
      "postText",
      "title",
      "alt",
      "edge_media_to_caption.edges.0.node.text"
    ]) ?? "";

  return {
    platform,
    externalPostId:
      pickString(item, ["id", "postId", "shortCode", "shortcode", "pk"]) ??
      fallbackExternalId(platform, account, item),
    postUrl,
    text,
    mediaUrl: video ?? image,
    thumbnailUrl: image,
    mediaType: video ? "video" : image ? "image" : undefined,
    publishedAt: toIsoDate(
      pickString(item, [
        "timestamp",
        "datetime",
        "date",
        "postedAt",
        "time",
        "publishedAt",
        "createdAt",
        "created_time"
      ])
    ),
    engagementCount:
      pickNumber(item, ["likesCount", "likes", "likeCount", "reactionsCount"]) +
      pickNumber(item, ["commentsCount", "comments", "commentCount"]) +
      pickNumber(item, ["sharesCount", "shares", "shareCount"]) +
      pickNumber(item, ["viewsCount", "views", "videoViewCount"]),
    raw: item
  };
}

export async function fetchApifyPublicPosts(
  platform: Platform,
  account: SocialAccount
): Promise<ConnectorResult> {
  const token = process.env.APIFY_TOKEN;
  const actorId = getActorId(platform);

  if (!token || !actorId) {
    return {
      ok: false,
      status: "not_connected",
      message: `Apify ${platform} connector needs APIFY_TOKEN and APIFY_${platformKey(
        platform
      )}_ACTOR_ID.`,
      posts: []
    };
  }

  const params = new URLSearchParams({
    clean: "true",
    format: "json",
    limit: String(maxItems()),
    maxItems: String(maxItems())
  });
  const url = `https://api.apify.com/v2/actors/${encodeURIComponent(
    actorId
  )}/run-sync-get-dataset-items?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildInput(platform, account))
    });
    const body = (await response.json()) as unknown;

    if (!response.ok) {
      const error = asObject(body)?.error;
      const message =
        (asObject(error)?.message as string | undefined) ??
        `Apify request failed with status ${response.status}`;

      return { ok: false, status: "error", message, posts: [] };
    }

    const items = Array.isArray(body) ? body.map(asObject).filter(Boolean) : [];

    return {
      ok: true,
      posts: (items as ApifyItem[]).map((item) => normalizeApifyItem(platform, account, item))
    };
  } catch (error) {
    return {
      ok: false,
      status: "error",
      message: error instanceof Error ? error.message : "Apify request failed",
      posts: []
    };
  }
}
