import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { listGamesAsync } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const games = await listGamesAsync();
  return <AdminDashboardClient initialGames={games} />;
}
