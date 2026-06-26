import { missingCredentials, PlatformConnector } from "@/lib/connectors/base";

export const instagramConnector: PlatformConnector = {
  platform: "Instagram",
  async fetchPublicPosts() {
    return missingCredentials("Instagram");
  }
};
