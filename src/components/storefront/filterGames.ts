import type { GameRate, PlatformType } from "@/types/game";

export type FilterPlatform = "all" | PlatformType;

function matchesQuery(game: GameRate, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  return game.name.toLowerCase().includes(normalizedQuery);
}

function matchesPlatform(game: GameRate, platform: FilterPlatform): boolean {
  if (platform === "all") return true;
  if (platform === "ios") {
    return game.platform === "ios" || game.platform === "both";
  }
  if (platform === "android") {
    return game.platform === "android" || game.platform === "both";
  }
  return game.platform === platform;
}

export function filterGames(
  games: GameRate[],
  query: string,
  platform: FilterPlatform,
): GameRate[] {
  const normalizedQuery = query.trim().toLowerCase();
  return games.filter(
    (game) =>
      matchesQuery(game, normalizedQuery) && matchesPlatform(game, platform),
  );
}

export function computePlatformCounts(
  games: GameRate[],
  query = "",
): Record<FilterPlatform, number> {
  const normalizedQuery = query.trim().toLowerCase();
  const matched = games.filter((game) => matchesQuery(game, normalizedQuery));

  let ios = 0;
  let android = 0;
  let both = 0;

  for (const game of matched) {
    if (game.platform === "both") {
      both += 1;
      ios += 1;
      android += 1;
    } else if (game.platform === "ios") {
      ios += 1;
    } else if (game.platform === "android") {
      android += 1;
    }
  }

  return {
    all: matched.length,
    ios,
    android,
    both,
  };
}
