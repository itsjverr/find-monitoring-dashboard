"use client";

import { useState } from "react";
import { CheckCircle2, RefreshCw, TriangleAlert } from "lucide-react";

type SyncLog = {
  accountId: string;
  platform: string;
  status: string;
  message: string;
};

type SyncResponse = {
  status?: string;
  fetched?: number;
  logs?: SyncLog[];
  message?: string;
  error?: string;
};

export function AdminSyncPanel() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncResponse | null>(null);

  async function syncNow() {
    setIsSyncing(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/sync-now", {
        method: "POST",
        cache: "no-store"
      });
      const text = await response.text();
      let data: SyncResponse = {};

      try {
        data = text ? (JSON.parse(text) as SyncResponse) : {};
      } catch {
        data = { error: text || "Sync failed" };
      }

      setResult(response.ok ? data : { error: data.error ?? "Sync failed" });
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Sync failed" });
    } finally {
      setIsSyncing(false);
    }
  }

  const failedLogs = result?.logs?.filter((log) => log.status !== "success") ?? [];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Live source sync</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">
            Pull the newest public posts from configured sources. This is the
            reliable manual control for review sessions.
          </p>
        </div>
        <button
          type="button"
          onClick={syncNow}
          disabled={isSyncing}
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-nd-600 px-4 text-sm font-semibold text-white transition hover:bg-nd-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Syncing" : "Sync now"}
        </button>
      </div>

      {result ? (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950">
          {result.error ? (
            <div className="flex gap-3 text-sm text-rose-700 dark:text-rose-200">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Sync failed</p>
                <p className="mt-1 leading-6">{result.error}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-ink">
                  Sync complete: {result.fetched ?? 0} posts fetched.
                </p>
                <p className="mt-1 leading-6 text-zinc-500">
                  {failedLogs.length === 0
                    ? "All checked sources responded cleanly."
                    : `${failedLogs.length} sources need attention.`}
                </p>
              </div>
            </div>
          )}

          {failedLogs.length > 0 ? (
            <div className="mt-3 grid gap-2">
              {failedLogs.slice(0, 5).map((log) => (
                <div
                  key={`${log.accountId}-${log.platform}-${log.message}`}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
                >
                  {log.platform}: {log.message}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
