import Image from "next/image";
import { Person } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PersonAvatar({
  person,
  size = "md"
}: {
  person: Person;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg"
  };

  if (person.avatarUrl) {
    return (
      <Image
        src={person.avatarUrl}
        alt=""
        width={80}
        height={80}
        className={`${sizes[size]} rounded-full object-cover ring-1 ring-zinc-200`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-nd-50 font-semibold text-nd-700 ring-1 ring-nd-100`}
    >
      {initials(person.fullName)}
    </div>
  );
}
