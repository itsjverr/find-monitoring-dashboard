import { NextResponse } from "next/server";
import { runFetchPosts } from "@/lib/sync-posts";

export async function POST() {
  try {
    return NextResponse.json(await runFetchPosts());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
