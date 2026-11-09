import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStoreSettingsAsync, listGamesAsync } from "@/lib/db";
import { DEFAULT_STORE_SETTINGS } from "@/types/settings";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const [games, settings] = await Promise.all([
    listGamesAsync().catch(() => []),
    getStoreSettingsAsync().catch(() => DEFAULT_STORE_SETTINGS),
  ]);

  return (
    <AdminDashboardClient
      initialGames={games}
      initialSettings={settings}
    />
  );
}
