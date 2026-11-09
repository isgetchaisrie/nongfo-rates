import React from "react";
import { listGamesAsync } from "@/lib/db";
import type { GameRate } from "@/types/game";
import { RateBoardClient } from "@/components/storefront/RateBoardClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let games: GameRate[] = [];
  try {
    games = await listGamesAsync();
  } catch {
    games = [];
  }

  return <RateBoardClient initialGames={games} />;
}
