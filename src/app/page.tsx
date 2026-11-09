import React from "react";
import { listGames } from "@/lib/db";
import type { GameRate } from "@/types/game";
import { RateBoardClient } from "@/components/storefront/RateBoardClient";

export const dynamic = "force-dynamic";

export default function HomePage() {
  let games: GameRate[] = [];
  try {
    games = listGames();
  } catch {
    games = [];
  }

  return <RateBoardClient initialGames={games} />;
}
