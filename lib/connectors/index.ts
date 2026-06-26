import { facebookConnector } from "@/lib/connectors/facebook";
import { instagramConnector } from "@/lib/connectors/instagram";
import { PlatformConnector } from "@/lib/connectors/base";
import { xConnector } from "@/lib/connectors/x";
import { Platform } from "@/lib/types";

export const connectors: Record<Platform, PlatformConnector> = {
  X: xConnector,
  Facebook: facebookConnector,
  Instagram: instagramConnector
};
