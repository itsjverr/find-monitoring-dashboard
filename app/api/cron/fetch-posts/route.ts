import { NextRequest, NextResponse } from "next/server";
import { runFetchPosts } from "@/lib/sync-posts";

function authorize(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET ?? "dev-cron-secret";
  const headerSecret = request.headers.get("authorization")?.replace("Bearer ", "");
  const querySecret = request.nextUrl.searchParams.get("secret");

  return headerSecret === expectedSecret || querySecret === expectedSecret;
}

async function handler(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await runFetchPosts());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fetch failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
