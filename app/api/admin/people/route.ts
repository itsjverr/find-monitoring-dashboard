import { NextRequest, NextResponse } from "next/server";
import { toPerson } from "@/lib/admin-data";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { Person } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    fullName?: string;
    role?: string;
    avatarUrl?: string;
  };
  const fullName = body.fullName?.trim();
  const role = body.role?.trim();

  if (!fullName || !role) {
    return NextResponse.json({ error: "Full name and role are required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    const person: Person = {
      id: `local-${Date.now()}`,
      fullName,
      role,
      avatarUrl: body.avatarUrl || undefined,
      active: true
    };

    return NextResponse.json({ status: "mock", person });
  }

  const { data, error } = await supabase
    .from("people")
    .insert({
      full_name: fullName,
      role,
      avatar_url: body.avatarUrl || null,
      active: true
    })
    .select("id, full_name, role, avatar_url, active")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "ok", person: toPerson(data) });
}
