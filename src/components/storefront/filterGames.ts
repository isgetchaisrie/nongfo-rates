import type { CategoryType, GameRate, PlatformType } from "@/types/game";

export type FilterPlatform = "all" | PlatformType;
export type FilterCategory = "all" | CategoryType;

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

function matchesCategory(game: GameRate, category: FilterCategory): boolean {
  if (category === "all") return true;
  return game.category === category;
}

export function filterGames(
  games: GameRate[],
  query: string,
  platform: FilterPlatform,
  category: FilterCategory = "all",
): GameRate[] {
  const normalizedQuery = query.trim().toLowerCase();
  return games.filter(
    (game) =>
      matchesQuery(game, normalizedQuery) &&
      matchesPlatform(game, platform) &&
      matchesCategory(game, category),
  );
}

export function computePlatformCounts(
  games: GameRate[],
  query = "",
  category: FilterCategory = "all",
): Record<FilterPlatform, number> {
  const normalizedQuery = query.trim().toLowerCase();
  const matched = games.filter(
    (game) =>
      matchesQuery(game, normalizedQuery) && matchesCategory(game, category),
  );

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

export function computeCategoryCounts(
  games: GameRate[],
  query = "",
  platform: FilterPlatform = "all",
): Record<FilterCategory, number> {
  const normalizedQuery = query.trim().toLowerCase();
  const matched = games.filter(
    (game) =>
      matchesQuery(game, normalizedQuery) && matchesPlatform(game, platform),
  );

  let gameCount = 0;
  let appCount = 0;

  for (const item of matched) {
    if (item.category === "app") {
      appCount += 1;
    } else {
      gameCount += 1;
    }
  }

  return {
    all: matched.length,
    game: gameCount,
    app: appCount,
  };
}
