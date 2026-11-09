import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { listGames } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const games = listGames();
  return <AdminDashboardClient initialGames={games} />;
}
