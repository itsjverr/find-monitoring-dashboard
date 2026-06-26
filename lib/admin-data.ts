import { people as mockPeople, socialAccounts as mockSocialAccounts } from "@/lib/mock-data";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { Person, Platform, SocialAccount } from "@/lib/types";

type DbPerson = {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  active: boolean;
};

type DbSocialAccount = {
  id: string;
  person_id: string;
  platform: Platform;
  handle: string;
  profile_url: string;
  avatar_url: string | null;
  api_account_id: string | null;
  active: boolean;
};

export function toPerson(row: DbPerson): Person {
  return {
    id: row.id,
    fullName: row.full_name,
    role: row.role,
    avatarUrl: row.avatar_url ?? undefined,
    active: row.active
  };
}

export function toSocialAccount(row: DbSocialAccount): SocialAccount {
  return {
    id: row.id,
    personId: row.person_id,
    platform: row.platform,
    handle: row.handle,
    profileUrl: row.profile_url,
    avatarUrl: row.avatar_url ?? undefined,
    apiAccountId: row.api_account_id ?? undefined,
    active: row.active,
    connected: Boolean(row.api_account_id)
  };
}

export async function getAdminData() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      people: mockPeople,
      socialAccounts: mockSocialAccounts
    };
  }

  const [peopleResult, accountsResult] = await Promise.all([
    supabase
      .from("people")
      .select("id, full_name, role, avatar_url, active")
      .order("full_name"),
    supabase
      .from("social_accounts")
      .select("id, person_id, platform, handle, profile_url, avatar_url, api_account_id, active")
      .order("created_at", { ascending: false })
  ]);

  if (peopleResult.error || accountsResult.error) {
    return {
      people: mockPeople,
      socialAccounts: mockSocialAccounts
    };
  }

  return {
    people: ((peopleResult.data ?? []) as DbPerson[]).map(toPerson),
    socialAccounts: ((accountsResult.data ?? []) as DbSocialAccount[]).map(toSocialAccount)
  };
}
