import { missingCredentials, PlatformConnector } from "@/lib/connectors/base";

export const facebookConnector: PlatformConnector = {
  platform: "Facebook",
  async fetchPublicPosts() {
    return missingCredentials("Facebook");
  }
};
