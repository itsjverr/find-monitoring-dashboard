"use client";

import { useState } from "react";
import { AdminBulkImportForm } from "@/components/AdminBulkImportForm";
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
  const [accounts, setAccounts] = useState(initialAccounts);

  function addPerson(person: Person) {
    setPeople((currentPeople) =>
      currentPeople.some((entry) => entry.id === person.id)
        ? currentPeople
        : [person, ...currentPeople]
    );
  }

  function addAccount(account: SocialAccount) {
    setAccounts((currentAccounts) =>
      currentAccounts.some((entry) => entry.id === account.id)
        ? currentAccounts
        : [account, ...currentAccounts]
    );
  }

  function updatePersonActive(personId: string, active: boolean) {
    setPeople((currentPeople) =>
      currentPeople.map((person) =>
        person.id === personId ? { ...person, active } : person
      )
    );
  }

  return (
    <div className="space-y-5">
      <AdminBulkImportForm
        people={people}
        onPersonImported={addPerson}
        onAccountImported={addAccount}
      />
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <AdminPeopleForm
          initialPeople={people}
          onPersonAdded={addPerson}
          onPersonActiveChange={updatePersonActive}
        />
        <AdminSocialAccountsForm
          people={people}
          initialAccounts={accounts}
          onAccountAdded={addAccount}
          onAccountActiveChange={(accountId, active) => {
            setAccounts((currentAccounts) =>
              currentAccounts.map((account) =>
                account.id === accountId ? { ...account, active } : account
              )
            );
          }}
        />
      </div>
    </div>
  );
}
