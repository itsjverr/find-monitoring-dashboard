import { inflateRawSync } from "zlib";
import { NextRequest, NextResponse } from "next/server";
import { toPerson, toSocialAccount } from "@/lib/admin-data";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { Person, Platform, SocialAccount } from "@/lib/types";

type ZipEntry = {
  name: string;
  data: Buffer;
};

type ParsedRow = {
  fullName: string;
  role: string;
  accounts: Array<{
    platform: Platform;
    handle: string;
    profileUrl: string;
  }>;
};

export const maxDuration = 30;

function readUInt16(buffer: Buffer, offset: number) {
  return buffer.readUInt16LE(offset);
}

function readUInt32(buffer: Buffer, offset: number) {
  return buffer.readUInt32LE(offset);
}

function unzipXlsx(buffer: Buffer) {
  const eocdSignature = 0x06054b50;
  let eocdOffset = -1;

  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (readUInt32(buffer, offset) === eocdSignature) {
      eocdOffset = offset;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error("Could not read Excel file.");
  }

  const entryCount = readUInt16(buffer, eocdOffset + 10);
  let centralOffset = readUInt32(buffer, eocdOffset + 16);
  const entries = new Map<string, Buffer>();

  for (let index = 0; index < entryCount; index += 1) {
    if (readUInt32(buffer, centralOffset) !== 0x02014b50) {
      throw new Error("Invalid Excel central directory.");
    }

    const compressionMethod = readUInt16(buffer, centralOffset + 10);
    const compressedSize = readUInt32(buffer, centralOffset + 20);
    const fileNameLength = readUInt16(buffer, centralOffset + 28);
    const extraLength = readUInt16(buffer, centralOffset + 30);
    const commentLength = readUInt16(buffer, centralOffset + 32);
    const localHeaderOffset = readUInt32(buffer, centralOffset + 42);
    const name = buffer
      .subarray(centralOffset + 46, centralOffset + 46 + fileNameLength)
      .toString("utf8");
    const localNameLength = readUInt16(buffer, localHeaderOffset + 26);
    const localExtraLength = readUInt16(buffer, localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    const data =
      compressionMethod === 0
        ? compressed
        : compressionMethod === 8
          ? inflateRawSync(compressed)
          : null;

    if (!data) {
      throw new Error("Unsupported Excel compression.");
    }

    entries.set(name, data);
    centralOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function decodeXml(value: string) {
  return value
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function stripTags(value: string) {
  return decodeXml(value.replace(/<[^>]+>/g, ""));
}

function parseSharedStrings(xml: string) {
  return [...xml.matchAll(/<si[\s\S]*?<\/si>/g)].map(([si]) => {
    const textParts = [...si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((match) =>
      decodeXml(match[1])
    );
    return textParts.length > 0 ? textParts.join("") : stripTags(si);
  });
}

function columnIndex(reference: string) {
  const letters = reference.match(/[A-Z]+/)?.[0] ?? "A";
  return [...letters].reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function cellValue(cellXml: string, sharedStrings: string[]) {
  const type = cellXml.match(/\st="([^"]+)"/)?.[1];
  const inline = cellXml.match(/<is[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/is>/)?.[1];
  const rawValue = cellXml.match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1];

  if (type === "inlineStr" && inline) {
    return decodeXml(inline).trim();
  }

  if (rawValue === undefined) {
    return "";
  }

  if (type === "s") {
    return (sharedStrings[Number(rawValue)] ?? "").trim();
  }

  return decodeXml(rawValue).trim();
}

function parseSheet(xml: string, sharedStrings: string[]) {
  return [...xml.matchAll(/<row[\s\S]*?<\/row>/g)].map(([rowXml]) => {
    const cells: string[] = [];

    for (const match of rowXml.matchAll(/<c\b[^>]*>[\s\S]*?<\/c>/g)) {
      const cellXml = match[0];
      const reference = cellXml.match(/\br="([^"]+)"/)?.[1] ?? "A1";
      cells[columnIndex(reference)] = cellValue(cellXml, sharedStrings);
    }

    return cells.map((cell) => cell ?? "");
  });
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase();
}

function getHandleFromUrl(value: string, platform: Platform) {
  if (!value.trim()) {
    return "";
  }

  if (!value.startsWith("http")) {
    return value.replace(/^@/, "").trim();
  }

  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    const first = parts[0] ?? "";

    if (platform === "X" && first.toLowerCase() === "i") {
      return parts[1] ?? "";
    }

    return first.replace(/^@/, "");
  } catch {
    return "";
  }
}

function normalizeProfileUrl(value: string, platform: Platform) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http")) {
    return trimmed;
  }

  const handle = trimmed.replace(/^@/, "");

  if (platform === "Instagram") {
    return `https://www.instagram.com/${handle}`;
  }

  if (platform === "X") {
    return `https://x.com/${handle}`;
  }

  return `https://www.facebook.com/${handle}`;
}

function platformColumns(headers: string[]) {
  return headers
    .map((header, index) => {
      const normalized = normalizeHeader(header);

      if (normalized === "fb" || normalized === "facebook") {
        return { platform: "Facebook" as const, index };
      }

      if (normalized === "instagram" || normalized === "ig") {
        return { platform: "Instagram" as const, index };
      }

      if (normalized === "x" || normalized === "twitter") {
        return { platform: "X" as const, index };
      }

      return null;
    })
    .filter(Boolean) as Array<{ platform: Platform; index: number }>;
}

function parseRows(rows: string[][]): ParsedRow[] {
  const headerRowIndex = rows.findIndex((row) =>
    row.some((cell) => ["ιδιοτητα", "ιδιότητα", "role"].includes(normalizeHeader(cell)))
  );
  const headers = rows[headerRowIndex] ?? rows[0] ?? [];
  const roleIndex = headers.findIndex((header) =>
    ["ιδιοτητα", "ιδιότητα", "role", "title"].includes(normalizeHeader(header))
  );
  const lastNameIndex = headers.findIndex((header) =>
    ["επωνυμο", "επώνυμο", "last name", "surname"].includes(normalizeHeader(header))
  );
  const firstNameIndex = headers.findIndex((header) =>
    ["ονομα", "όνομα", "first name", "name"].includes(normalizeHeader(header))
  );
  const fullNameIndex = headers.findIndex((header) =>
    ["full name", "fullname", "person"].includes(normalizeHeader(header))
  );
  const socialColumns = platformColumns(headers);

  return rows
    .slice(headerRowIndex + 1)
    .map((row) => {
      const fullName =
        fullNameIndex >= 0
          ? row[fullNameIndex]?.trim()
          : [row[firstNameIndex], row[lastNameIndex]]
              .filter(Boolean)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
      const role = row[roleIndex]?.trim() || "Monitored";
      const accounts = socialColumns
        .map(({ platform, index }) => {
          const profileUrl = normalizeProfileUrl(row[index] ?? "", platform);
          const handle = getHandleFromUrl(profileUrl || row[index] || "", platform);

          if (!profileUrl || !handle) {
            return null;
          }

          return { platform, handle, profileUrl };
        })
        .filter(Boolean) as ParsedRow["accounts"];

      if (!fullName || accounts.length === 0) {
        return null;
      }

      return { fullName, role, accounts };
    })
    .filter(Boolean) as ParsedRow[];
}

function firstWorksheet(entries: Map<string, Buffer>) {
  return (
    entries.get("xl/worksheets/sheet1.xml") ??
    [...entries.entries()].find(([name]) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name))?.[1]
  );
}

function parseXlsx(buffer: Buffer) {
  const entries = unzipXlsx(buffer);
  const sharedStrings = entries.get("xl/sharedStrings.xml")
    ? parseSharedStrings(entries.get("xl/sharedStrings.xml")!.toString("utf8"))
    : [];
  const sheet = firstWorksheet(entries);

  if (!sheet) {
    throw new Error("No worksheet found in Excel file.");
  }

  return parseRows(parseSheet(sheet.toString("utf8"), sharedStrings));
}

function personKey(fullName: string) {
  return fullName.trim().toLowerCase();
}

function accountKey(personId: string, platform: Platform, handle: string) {
  return `${personId}:${platform}:${handle.trim().toLowerCase()}`;
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const buffer = Buffer.from(await request.arrayBuffer());
  const rows = parseXlsx(buffer);
  const peopleByName = new Map<string, Person>();
  const importedPeople: Person[] = [];

  const { data: existingPeople, error: peopleError } = await supabase
    .from("people")
    .select("id, full_name, role, avatar_url, active");

  if (peopleError) {
    return NextResponse.json({ error: peopleError.message }, { status: 500 });
  }

  for (const person of (existingPeople ?? []).map(toPerson)) {
    peopleByName.set(personKey(person.fullName), person);
  }

  const missingPeople = rows
    .filter((row) => !peopleByName.has(personKey(row.fullName)))
    .filter((row, index, list) => list.findIndex((entry) => personKey(entry.fullName) === personKey(row.fullName)) === index);

  if (missingPeople.length > 0) {
    const { data, error } = await supabase
      .from("people")
      .insert(
        missingPeople.map((row) => ({
          full_name: row.fullName,
          role: row.role,
          active: true
        }))
      )
      .select("id, full_name, role, avatar_url, active");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    for (const person of (data ?? []).map(toPerson)) {
      peopleByName.set(personKey(person.fullName), person);
      importedPeople.push(person);
    }
  }

  const { data: existingAccounts, error: existingAccountsError } = await supabase
    .from("social_accounts")
    .select("id, person_id, platform, handle, profile_url, avatar_url, api_account_id, active");

  if (existingAccountsError) {
    return NextResponse.json({ error: existingAccountsError.message }, { status: 500 });
  }

  const accountKeys = new Set(
    ((existingAccounts ?? []) as Array<{
      person_id: string;
      platform: Platform;
      handle: string;
    }>).map((account) => accountKey(account.person_id, account.platform, account.handle))
  );
  const accountPayloads: Array<{
    person_id: string;
    platform: Platform;
    handle: string;
    profile_url: string;
    active: boolean;
  }> = [];

  for (const row of rows) {
    const person = peopleByName.get(personKey(row.fullName));

    if (!person) {
      continue;
    }

    for (const account of row.accounts) {
      const key = accountKey(person.id, account.platform, account.handle);

      if (accountKeys.has(key)) {
        continue;
      }

      accountKeys.add(key);
      accountPayloads.push({
        person_id: person.id,
        platform: account.platform,
        handle: account.handle,
        profile_url: account.profileUrl,
        active: true
      });
    }
  }

  const { data: insertedAccounts, error: accountsError } =
    accountPayloads.length > 0
      ? await supabase
          .from("social_accounts")
          .insert(accountPayloads)
          .select("id, person_id, platform, handle, profile_url, avatar_url, api_account_id, active")
      : { data: [], error: null };

  if (accountsError) {
    return NextResponse.json({ error: accountsError.message }, { status: 500 });
  }

  const importedAccounts = ((insertedAccounts ?? []) as Parameters<typeof toSocialAccount>[0][]).map(toSocialAccount);

  return NextResponse.json({
    status: "ok",
    rows: rows.length,
    people: importedPeople,
    accounts: importedAccounts
  });
}
