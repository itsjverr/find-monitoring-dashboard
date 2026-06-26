import { NextRequest } from "next/server";

export function getPublicRedirectUrl(request: NextRequest, path: string) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.host;
  const protocol = forwardedProto ?? request.nextUrl.protocol.replace(":", "");

  return new URL(path, `${protocol}://${host}`);
}
