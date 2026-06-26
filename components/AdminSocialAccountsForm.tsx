"use client";

import { Link2, Plus, Power } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Person, Platform, SocialAccount } from "@/lib/types";
import { PlatformBadge } from "@/components/PlatformBadge";

const platforms: Platform[] = ["X", "Facebook", "Instagram"];

export function AdminSocialAccountsForm({
  people,
  initialAccounts
}: {
  people: Person[];
  initialAccounts: SocialAccount[];
}) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [personId, setPersonId] = useState(people[0]?.id ?? "");
  const [platform, setPlatform] = useState<Platform>("X");
  const [handle, setHandle] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [apiAccountId, setApiAccountId] = useState("");

  const peopleById = useMemo(
    () => new Map(people.map((person) => [person.id, person])),
    [people]
  );

  function addAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!personId || !handle.trim() || !profileUrl.trim()) {
      return;
    }

    setAccounts((currentAccounts) => [
      {
        id: `local-account-${Date.now()}`,
        personId,
        platform,
        handle,
        profileUrl,
        apiAccountId: apiAccountId || undefined,
        active: true,
        connected: Boolean(apiAccountId)
      },
      ...currentAccounts
    ]);
    setHandle("");
    setProfileUrl("");
    setApiAccountId("");
  }

  function toggleActive(id: string) {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        account.id === id ? { ...account, active: !account.active } : account
      )
    );
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-ink">Social accounts</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Public profiles and API account references.
        </p>
      </div>

      <form onSubmit={addAccount} className="grid gap-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            value={personId}
            onChange={(event) => setPersonId(event.target.value)}
            className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-nd-500 focus:bg-white"
          >
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.fullName}
              </option>
            ))}
          </select>
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value as Platform)}
            className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-nd-500 focus:bg-white"
          >
            {platforms.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_1.25fr]">
          <input
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="Handle"
            className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-nd-500 focus:bg-white"
          />
          <input
            value={profileUrl}
            onChange={(event) => setProfileUrl(event.target.value)}
            placeholder="Profile URL"
            className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-nd-500 focus:bg-white"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            value={apiAccountId}
            onChange={(event) => setApiAccountId(event.target.value)}
            placeholder="API account ID"
            className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-nd-500 focus:bg-white"
          />
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
            type="submit"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </form>

      <div className="mt-5 divide-y divide-zinc-100">
        {accounts.map((account) => {
          const person = peopleById.get(account.personId);

          return (
            <div key={account.id} className="grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <PlatformBadge platform={account.platform} />
                  <p className="truncate text-sm font-semibold text-ink">{account.handle}</p>
                </div>
                <p className="mt-1 truncate text-sm text-zinc-500">
                  {person?.fullName ?? "Unassigned"} · {account.apiAccountId ?? "Not connected"}
                </p>
                <a
                  href={account.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-nd-700"
                >
                  <Link2 size={12} />
                  {account.profileUrl}
                </a>
              </div>
              <button
                type="button"
                onClick={() => toggleActive(account.id)}
                className={`flex h-9 items-center justify-center gap-2 rounded-full border px-3 text-xs font-semibold transition ${
                  account.active
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 bg-zinc-50 text-zinc-500"
                }`}
              >
                <Power size={14} />
                {account.active ? "Active" : "Inactive"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
