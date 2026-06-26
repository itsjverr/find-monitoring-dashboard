import { missingCredentials, PlatformConnector } from "@/lib/connectors/base";

export const xConnector: PlatformConnector = {
  platform: "X",
  async fetchPublicPosts() {
    return missingCredentials("X");
  }
};
