import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExpenseDashboard from "@/components/ExpenseDashboard";

export const metadata = {
  title: "Expenses | Tracker.",
};

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", height: "calc(100vh - 150px)" }}>
      <ExpenseDashboard />
    </div>
  );
}
