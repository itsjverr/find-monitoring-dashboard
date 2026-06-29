import { NextRequest, NextResponse } from "next/server";
import { toSocialAccount } from "@/lib/admin-data";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { Platform, SocialAccount } from "@/lib/types";

const platforms = new Set<Platform>(["X", "Facebook", "Instagram"]);

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    personId?: string;
    platform?: Platform;
    handle?: string;
    profileUrl?: string;
    apiAccountId?: string;
    avatarUrl?: string;
  };
  const personId = body.personId?.trim();
  const platform = body.platform;
  const handle = body.handle?.trim();
  const profileUrl = body.profileUrl?.trim();
  const apiAccountId = body.apiAccountId?.trim();

  if (!personId || !platform || !platforms.has(platform) || !handle || !profileUrl) {
    return NextResponse.json(
      { error: "Person, platform, handle, and profile URL are required." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    const account: SocialAccount = {
      id: `local-account-${Date.now()}`,
      personId,
      platform,
      handle,
      profileUrl,
      apiAccountId: apiAccountId || undefined,
      avatarUrl: body.avatarUrl || undefined,
      active: true,
      connected: Boolean(apiAccountId) || Boolean(profileUrl)
    };

    return NextResponse.json({ status: "mock", account });
  }

  const { data, error } = await supabase
    .from("social_accounts")
    .insert({
      person_id: personId,
      platform,
      handle,
      profile_url: profileUrl,
      avatar_url: body.avatarUrl || null,
      api_account_id: apiAccountId || null,
      active: true
    })
    .select("id, person_id, platform, handle, profile_url, avatar_url, api_account_id, active")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: "ok", account: toSocialAccount(data) });
}
