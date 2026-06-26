import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPeopleForm } from "@/components/AdminPeopleForm";
import { AdminSocialAccountsForm } from "@/components/AdminSocialAccountsForm";
import { getAdminData } from "@/lib/admin-data";

export default async function AdminPage() {
  const { people, socialAccounts } = await getAdminData();

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            >
              <ArrowLeft size={16} />
              Feed
            </Link>
            <h1 className="text-3xl font-semibold tracking-normal text-ink">
              Fi<span className="text-nd-600">ND</span> admin
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage people, roles, and public social accounts.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <AdminPeopleForm initialPeople={people} />
          <AdminSocialAccountsForm people={people} initialAccounts={socialAccounts} />
        </div>
      </div>
    </main>
  );
}
