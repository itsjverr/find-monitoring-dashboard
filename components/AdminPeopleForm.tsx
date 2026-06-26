"use client";

import { Plus, Power } from "lucide-react";
import { FormEvent, useState } from "react";
import { Person } from "@/lib/types";
import { PersonAvatar } from "@/components/PersonAvatar";

export function AdminPeopleForm({ initialPeople }: { initialPeople: Person[] }) {
  const [people, setPeople] = useState(initialPeople);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !role.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, role })
      });
      const data = (await response.json()) as { person?: Person };

      if (data.person) {
        setPeople((currentPeople) => [data.person as Person, ...currentPeople]);
        setFullName("");
        setRole("");
      }
    } finally {
      setIsSaving(false);
    }
  }

  function toggleActive(id: string) {
    const nextPerson = people.find((person) => person.id === id);
    const nextActive = !(nextPerson?.active ?? false);

    setPeople((currentPeople) =>
      currentPeople.map((person) =>
        person.id === id ? { ...person, active: !person.active } : person
      )
    );

    fetch(`/api/admin/people/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ active: nextActive })
    }).catch(() => {
      // Keep the interface responsive in mock mode.
    });
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-ink">People</h2>
        <p className="mt-1 text-sm text-zinc-500">Names and roles monitored by FiND.</p>
      </div>

      <form onSubmit={addPerson} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
          className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-nd-500 focus:bg-white"
        />
        <input
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder="Role/title"
          className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-nd-500 focus:bg-white"
        />
        <button
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          type="submit"
          disabled={isSaving}
        >
          <Plus size={16} />
          {isSaving ? "Adding" : "Add"}
        </button>
      </form>

      <div className="mt-5 divide-y divide-zinc-100">
        {people.map((person) => (
          <div key={person.id} className="flex items-center justify-between gap-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <PersonAvatar person={person} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{person.fullName}</p>
                <p className="truncate text-sm text-zinc-500">{person.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleActive(person.id)}
              className={`flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition ${
                person.active
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-zinc-50 text-zinc-500"
              }`}
            >
              <Power size={14} />
              {person.active ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
