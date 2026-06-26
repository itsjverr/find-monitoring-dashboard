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
