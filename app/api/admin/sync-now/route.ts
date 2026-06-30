import { NextResponse } from "next/server";
import { runFetchPosts } from "@/lib/sync-posts";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      cursor?: string;
      limit?: number;
    };

    return NextResponse.json(
      await runFetchPosts({
        cursor: body.cursor,
        limit: body.limit
      })
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
