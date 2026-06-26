import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { isFlagged?: boolean };
  const isFlagged = Boolean(body.isFlagged);
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ status: "mock", id, isFlagged });
  }

  const { error } = await supabase
    .from("posts")
    .update({ is_flagged: isFlagged })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "ok", id, isFlagged });
}
