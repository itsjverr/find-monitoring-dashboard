import { FiNDDashboard } from "@/components/FiNDDashboard";
import { mockPosts, people, socialAccounts } from "@/lib/mock-data";

export default function Home() {
  return (
    <FiNDDashboard
      initialPosts={mockPosts}
      people={people}
      socialAccounts={socialAccounts}
    />
  );
}
