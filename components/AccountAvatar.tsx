import { SocialAccount } from "@/lib/types";

function initials(handle: string) {
  return handle
    .replace(/^@/, "")
    .split(/[\s._-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AccountAvatar({
  account,
  size = "md"
}: {
  account: SocialAccount;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg"
  };

  if (account.avatarUrl) {
    return (
      <div
        aria-hidden="true"
        className={`${sizes[size]} rounded-full bg-cover bg-center ring-1 ring-zinc-200 dark:ring-zinc-700`}
        style={{ backgroundImage: `url(${account.avatarUrl})` }}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-zinc-100 font-semibold text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700`}
    >
      {initials(account.handle)}
    </div>
  );
}
