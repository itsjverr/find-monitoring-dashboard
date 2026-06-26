import { NextRequest, NextResponse } from "next/server";
import { getPublicRedirectUrl } from "@/lib/http/redirect-url";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password");
  const expectedPassword = process.env.INTERNAL_APP_PASSWORD ?? "find-demo";

  if (password !== expectedPassword) {
    return NextResponse.redirect(getPublicRedirectUrl(request, "/login"), 303);
  }

  const response = NextResponse.redirect(getPublicRedirectUrl(request, "/"), 303);
  response.cookies.set("find_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/"
  });

  return response;
}
