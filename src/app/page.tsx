import React from "react";
import { getStoreSettingsAsync, listGamesAsync } from "@/lib/db";
import type { GameRate } from "@/types/game";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/types/settings";
import { RateBoardClient } from "@/components/storefront/RateBoardClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
    <RateBoardClient initialGames={games} initialSettings={settings} />
  );
}
