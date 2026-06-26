import { FiNDDashboard } from "@/components/FiNDDashboard";
import { getAdminData } from "@/lib/admin-data";
import { mockPosts } from "@/lib/mock-data";

export default async function Home() {
  const { people, socialAccounts } = await getAdminData();

  return (
    <FiNDDashboard
      initialPosts={mockPosts}
      people={people}
      socialAccounts={socialAccounts}
    />
  );
}
