import { NormalizedConnectorPost, Platform, SocialAccount } from "@/lib/types";

export type ConnectorResult =
  | {
      ok: true;
      posts: NormalizedConnectorPost[];
    }
  | {
      ok: false;
      status: "not_connected" | "error";
      message: string;
      posts: NormalizedConnectorPost[];
    };

export type PlatformConnector = {
  platform: Platform;
  fetchPublicPosts(account: SocialAccount): Promise<ConnectorResult>;
};

export function missingCredentials(platform: Platform): ConnectorResult {
  return {
    ok: false,
    status: "not_connected",
    message: `${platform} connector is not connected. Add official API credentials before live fetching.`,
    posts: []
  };
}

export function missingAccountId(platform: Platform, account: SocialAccount): ConnectorResult {
  return {
    ok: false,
    status: "not_connected",
    message: `${platform} account ${account.handle} needs an API account ID before live fetching.`,
    posts: []
  };
}

export function getFirstEnv(names: string[]) {
  return names.map((name) => process.env[name]).find(Boolean);
}

export async function readJson<T>(
  url: string,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const response = await fetch(url, init);
    const text = await response.text();
    const data = text ? (JSON.parse(text) as T & { error?: { message?: string } }) : null;

    if (!response.ok) {
      return {
        ok: false,
        message:
          data?.error?.message ??
          `Request failed with status ${response.status} ${response.statusText}`
      };
    }

    return { ok: true, data: data as T };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Request failed"
    };
  }
}
