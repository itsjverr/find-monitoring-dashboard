import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ status: "mock", id, isSeen: true });
  }

  const { error } = await supabase.from("posts").update({ is_seen: true }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "ok", id, isSeen: true });
}
