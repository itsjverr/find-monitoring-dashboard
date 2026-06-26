"use client";

import { useState } from "react";
import { AdminPeopleForm } from "@/components/AdminPeopleForm";
import { AdminSocialAccountsForm } from "@/components/AdminSocialAccountsForm";
import { Person, SocialAccount } from "@/lib/types";

export function AdminWorkspace({
  initialPeople,
  initialAccounts
}: {
  initialPeople: Person[];
  initialAccounts: SocialAccount[];
}) {
  const [people, setPeople] = useState(initialPeople);

  function addPerson(person: Person) {
    setPeople((currentPeople) => [person, ...currentPeople]);
  }

  function updatePersonActive(personId: string, active: boolean) {
    setPeople((currentPeople) =>
      currentPeople.map((person) =>
        person.id === personId ? { ...person, active } : person
      )
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <AdminPeopleForm
        initialPeople={people}
        onPersonAdded={addPerson}
        onPersonActiveChange={updatePersonActive}
      />
      <AdminSocialAccountsForm people={people} initialAccounts={initialAccounts} />
    </div>
  );
}
