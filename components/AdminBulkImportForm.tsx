"use client";

import { FileSpreadsheet, Upload } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Person, Platform, SocialAccount } from "@/lib/types";

type ImportRow = {
  fullName: string;
  role: string;
  platform: Platform;
  handle: string;
  profileUrl: string;
  apiAccountId?: string;
};

const sampleRows = [
  "Full name\tRole\tPlatform\tHandle\tProfile URL\tAPI account ID",
  "ΓΙΑΝΝΗΣ ΣΜΥΡΛΗΣ\tΓΕΝΙΚΟΣ ΔΙΕΥΘΥΝΤΗΣ\tFacebook\tsmirlis\thttps://www.facebook.com/smirlis\t"
].join("\n");

const headerMap: Record<string, keyof ImportRow> = {
  name: "fullName",
  "full name": "fullName",
  fullname: "fullName",
  person: "fullName",
  "όνομα": "fullName",
  ονομα: "fullName",
  role: "role",
  title: "role",
  "ρόλος": "role",
  ρολος: "role",
  platform: "platform",
  πλατφόρμα: "platform",
  πλατφορμα: "platform",
  handle: "handle",
  username: "handle",
  url: "profileUrl",
  "profile url": "profileUrl",
  profile: "profileUrl",
  link: "profileUrl",
  "api account id": "apiAccountId",
  "account id": "apiAccountId",
  apiid: "apiAccountId",
  id: "apiAccountId"
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase();
}

function normalizePlatform(value: string): Platform | null {
  const normalized = value.trim().toLowerCase();

  if (normalized === "facebook" || normalized === "fb") {
    return "Facebook";
  }

  if (normalized === "instagram" || normalized === "ig") {
    return "Instagram";
  }

  if (normalized === "x" || normalized === "twitter") {
    return "X";
  }

  return null;
}

function splitRow(row: string) {
  if (row.includes("\t")) {
    return row.split("\t").map((cell) => cell.trim());
  }

  return row.split(",").map((cell) => cell.trim());
}

function getHandleFromUrl(value: string) {
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[0] ?? "";
  } catch {
    return "";
  }
}

function buildProfileUrl(platform: Platform, handle: string) {
  const normalizedHandle = handle.replace(/^@/, "");

  if (platform === "X") {
    return `https://x.com/${normalizedHandle}`;
  }

  if (platform === "Instagram") {
    return `https://www.instagram.com/${normalizedHandle}`;
  }

  return `https://www.facebook.com/${normalizedHandle}`;
}

function parseImportRows(value: string): ImportRow[] {
  const rows = value
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return [];
  }

  const firstCells = splitRow(rows[0]);
  const mappedHeaders = firstCells.map((cell) => headerMap[normalizeHeader(cell)] ?? null);
  const hasHeader = mappedHeaders.some(Boolean);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows
    .map((row) => {
      const cells = splitRow(row);
      const raw = {
        fullName: "",
        role: "",
        platform: "",
        handle: "",
        profileUrl: "",
        apiAccountId: ""
      };

      if (hasHeader) {
        mappedHeaders.forEach((key, index) => {
          if (key) {
            raw[key] = cells[index] ?? "";
          }
        });
      } else {
        raw.fullName = cells[0] ?? "";
        raw.role = cells[1] ?? "";
        raw.platform = cells[2] ?? "";
        raw.handle = cells[3] ?? "";
        raw.profileUrl = cells[4] ?? "";
        raw.apiAccountId = cells[5] ?? "";
      }

      const platform = normalizePlatform(raw.platform);
      const profileUrl = raw.profileUrl || (platform ? buildProfileUrl(platform, raw.handle) : "");
      const handle = raw.handle || getHandleFromUrl(profileUrl);

      if (!raw.fullName || !platform || !handle || !profileUrl) {
        return null;
      }

      return {
        fullName: raw.fullName,
        role: raw.role || "Monitored",
        platform,
        handle,
        profileUrl,
        apiAccountId: raw.apiAccountId || undefined
      };
    })
    .filter(Boolean) as ImportRow[];
}

export function AdminBulkImportForm({
  people,
  onPersonImported,
  onAccountImported
}: {
  people: Person[];
  onPersonImported: (person: Person) => void;
  onAccountImported: (account: SocialAccount) => void;
}) {
  const [text, setText] = useState(sampleRows);
  const [isImporting, setIsImporting] = useState(false);
  const [summary, setSummary] = useState("");
  const rows = useMemo(() => parseImportRows(text), [text]);

  async function ensurePerson(row: ImportRow, currentPeople: Person[]) {
    const existing = currentPeople.find(
      (person) => person.fullName.trim().toLowerCase() === row.fullName.trim().toLowerCase()
    );

    if (existing) {
      return existing;
    }

    const response = await fetch("/api/admin/people", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fullName: row.fullName, role: row.role })
    });
    const data = (await response.json()) as { person?: Person; error?: string };

    if (!data.person) {
      throw new Error(data.error ?? `Could not import ${row.fullName}`);
    }

    onPersonImported(data.person);
    return data.person;
  }

  async function importRows(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rows.length === 0) {
      return;
    }

    setIsImporting(true);
    setSummary("");

    try {
      const importedPeople = [...people];
      let accountCount = 0;

      for (const row of rows) {
        const person = await ensurePerson(row, importedPeople);

        if (!importedPeople.some((entry) => entry.id === person.id)) {
          importedPeople.unshift(person);
        }

        const response = await fetch("/api/admin/social-accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            personId: person.id,
            platform: row.platform,
            handle: row.handle,
            profileUrl: row.profileUrl,
            apiAccountId: row.apiAccountId
          })
        });
        const data = (await response.json()) as { account?: SocialAccount; error?: string };

        if (!data.account) {
          throw new Error(data.error ?? `Could not import ${row.handle}`);
        }

        onAccountImported(data.account);
        accountCount += 1;
      }

      setSummary(`Imported ${accountCount} accounts.`);
    } catch (error) {
      setSummary(error instanceof Error ? error.message : "Import failed.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nd-50 text-nd-700">
          <FileSpreadsheet size={18} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">Excel import</h2>
          <p className="mt-1 text-sm text-zinc-500">Paste copied rows from Excel.</p>
        </div>
      </div>

      <form onSubmit={importRows} className="grid gap-3">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-32 w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs outline-none transition focus:border-nd-500 focus:bg-white"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-500">{rows.length} rows ready</p>
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isImporting || rows.length === 0}
          >
            <Upload size={16} />
            {isImporting ? "Importing" : "Import"}
          </button>
        </div>
        {summary ? <p className="text-sm font-medium text-zinc-600">{summary}</p> : null}
      </form>
    </section>
  );
}
