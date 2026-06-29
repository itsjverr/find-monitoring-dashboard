import { connectors } from "@/lib/connectors";
import { ConnectorResult } from "@/lib/connectors/base";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { Platform, SocialAccount } from "@/lib/types";

type DbSocialAccount = {
  id: string;
  person_id: string;
  platform: Platform;
  handle: string;
  profile_url: string;
  api_account_id: string | null;
  active: boolean;
};

function toSocialAccount(row: DbSocialAccount): SocialAccount {
  return {
    id: row.id,
    personId: row.person_id,
    platform: row.platform,
    handle: row.handle,
    profileUrl: row.profile_url,
    apiAccountId: row.api_account_id ?? undefined,
    active: row.active,
    connected: Boolean(row.api_account_id) || Boolean(row.profile_url?.trim())
  };
}

async function writeLog(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  account: SocialAccount,
  result: ConnectorResult
) {
  await supabase.from("fetch_logs").insert({
    platform: account.platform,
    social_account_id: account.id,
    status: result.ok ? "success" : result.status,
    message: result.ok
      ? `Fetched ${result.posts.length} public posts.`
      : result.message
  });
}

export async function runFetchPosts() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      status: "not_connected",
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable live fetching.",
      fetched: 0,
      logs: []
    };
  }

  const { data: rows, error } = await supabase
    .from("social_accounts")
    .select("id, person_id, platform, handle, profile_url, api_account_id, active")
    .eq("active", true);

  if (error) {
    throw new Error(error.message);
  }

  const accounts = (rows ?? []) as DbSocialAccount[];
  const logs: Array<{ accountId: string; platform: Platform; status: string; message: string }> =
    [];
  let fetched = 0;

  for (const row of accounts) {
    const account = toSocialAccount(row);
    const connector = connectors[account.platform];
    const result = await connector.fetchPublicPosts(account);

    if (result.ok && result.posts.length > 0) {
      const upserts = result.posts.map((post) => ({
        person_id: account.personId,
        social_account_id: account.id,
        platform: post.platform,
        external_post_id: post.externalPostId,
        post_url: post.postUrl,
        text: post.text,
        media_url: post.mediaUrl ?? null,
        thumbnail_url: post.thumbnailUrl ?? null,
        media_type: post.mediaType ?? null,
        published_at: post.publishedAt,
        fetched_at: new Date().toISOString(),
        engagement_count: post.engagementCount ?? 0,
        raw_json: post.raw
      }));

      const { error: upsertError } = await supabase
        .from("posts")
        .upsert(upserts, { onConflict: "platform,external_post_id" });

      if (upsertError) {
        const failedResult: ConnectorResult = {
          ok: false,
          status: "error",
          message: upsertError.message,
          posts: []
        };
        await writeLog(supabase, account, failedResult);
        logs.push({
          accountId: account.id,
          platform: account.platform,
          status: "error",
          message: upsertError.message
        });
        continue;
      }

      fetched += result.posts.length;
    }

    await writeLog(supabase, account, result);
    logs.push({
      accountId: account.id,
      platform: account.platform,
      status: result.ok ? "success" : result.status,
      message: result.ok
        ? `Fetched ${result.posts.length} public posts.`
        : result.message
    });
  }

  return { status: "ok", fetched, logs };
}
