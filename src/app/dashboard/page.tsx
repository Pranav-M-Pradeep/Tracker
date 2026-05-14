import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TabDashboard from "@/components/TabDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Tracker.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <TabDashboard userName={session.user?.name || ""} />;
}
