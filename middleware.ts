import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicRedirectUrl } from "@/lib/http/redirect-url";

const publicPaths = ["/login", "/api/auth/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get("find_session")?.value === "active";

  if (!hasSession && !pathname.startsWith("/api/cron")) {
    return NextResponse.redirect(getPublicRedirectUrl(request, "/login"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"]
};
