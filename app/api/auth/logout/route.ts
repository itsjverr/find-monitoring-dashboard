import { NextRequest, NextResponse } from "next/server";
import { getPublicRedirectUrl } from "@/lib/http/redirect-url";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(getPublicRedirectUrl(request, "/login"), 303);
  response.cookies.delete("find_session");
  return response;
}
