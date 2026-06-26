import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { active?: boolean };
  const active = Boolean(body.active);
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ status: "mock", id, active });
  }

  const { error } = await supabase.from("social_accounts").update({ active }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "ok", id, active });
}
