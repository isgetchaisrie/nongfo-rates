import React from "react";
import { getStoreSettingsAsync, listGamesAsync } from "@/lib/db";
import type { GameRate } from "@/types/game";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/types/settings";
import { RateBoardClient } from "@/components/storefront/RateBoardClient";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; category?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const initialSection =
    resolvedParams?.tab === "rates" ||
    resolvedParams?.tab === "contact" ||
    resolvedParams?.tab === "account"
      ? resolvedParams.tab
      : "rates";
  const initialCategory =
    resolvedParams?.category === "app" || resolvedParams?.category === "game"
      ? resolvedParams.category
      : "all";

  let games: GameRate[] = [];
  let settings: StoreSettings = DEFAULT_STORE_SETTINGS;
  try {
    const [fetchedGames, fetchedSettings] = await Promise.all([
      listGamesAsync(),
      getStoreSettingsAsync(),
    ]);
    games = fetchedGames;
    settings = fetchedSettings;
  } catch {
    // Fallback to defaults
  }

  return (
    <RateBoardClient
      initialGames={games}
      initialSettings={settings}
      initialSection={initialSection}
      initialCategory={initialCategory}
    />
  );
}
