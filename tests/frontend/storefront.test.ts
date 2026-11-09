import { describe, expect, it } from "vitest";
import type { GameRate } from "@/types/game";
import {
  computePlatformCounts,
  filterGames,
} from "@/components/storefront/filterGames";

const sampleGames: GameRate[] = [
  {
    id: "stardew-valley",
    name: "Stardew Valley",
    image: "/seed/stardew.svg",
    platform: "both",
    priceIos: 55,
    priceAndroid: 30,
    createdAt: "2026-11-09T00:00:00.000Z",
    updatedAt: "2026-11-09T00:00:00.000Z",
  },
  {
    id: "procreate-dreams",
    name: "Procreate Dreams",
    image: "/seed/procreate.svg",
    platform: "ios",
    priceIos: 120,
    priceAndroid: null,
    createdAt: "2026-11-09T00:00:00.000Z",
    updatedAt: "2026-11-09T00:00:00.000Z",
  },
  {
    id: "dave-the-diver",
    name: "Dave the Diver Mobile",
    image: "/seed/dave.svg",
    platform: "android",
    priceIos: null,
    priceAndroid: 45,
    createdAt: "2026-11-09T00:00:00.000Z",
    updatedAt: "2026-11-09T00:00:00.000Z",
  },
  {
    id: "goodnotes-6",
    name: "Goodnotes 6",
    image: "/seed/goodnotes.svg",
    platform: "ios",
    priceIos: 99,
    priceAndroid: null,
    createdAt: "2026-11-09T00:00:00.000Z",
    updatedAt: "2026-11-09T00:00:00.000Z",
  },
];

describe("filterGames", () => {
  it("returns all games when query is empty and platform is all", () => {
    const result = filterGames(sampleGames, "", "all");
    expect(result).toHaveLength(4);
    expect(result.map((g) => g.id)).toEqual([
      "stardew-valley",
      "procreate-dreams",
      "dave-the-diver",
      "goodnotes-6",
    ]);
  });

  it("includes both-platform games when filtering by ios or android", () => {
    const iosGames = filterGames(sampleGames, "", "ios");
    expect(iosGames.map((g) => g.id)).toEqual([
      "stardew-valley",
      "procreate-dreams",
      "goodnotes-6",
    ]);

    const androidGames = filterGames(sampleGames, "", "android");
    expect(androidGames.map((g) => g.id)).toEqual([
      "stardew-valley",
      "dave-the-diver",
    ]);
  });

  it("matches game names case-insensitively and trims whitespace", () => {
    const result = filterGames(sampleGames, "   sTaRdEw  ", "all");
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("stardew-valley");
  });

  it("combines search query with platform filter", () => {
    expect(filterGames(sampleGames, "procreate", "ios")).toHaveLength(1);
    expect(filterGames(sampleGames, "procreate", "android")).toHaveLength(0);
    expect(filterGames(sampleGames, "stardew", "ios")).toHaveLength(1);
    expect(filterGames(sampleGames, "stardew", "android")).toHaveLength(1);
  });

  it("returns empty array when no game matches query", () => {
    expect(filterGames(sampleGames, "nonexistent-game", "all")).toEqual([]);
  });
});

describe("computePlatformCounts", () => {
  it("computes counts across all games when query is omitted or empty", () => {
    expect(computePlatformCounts(sampleGames)).toEqual({
      all: 4,
      ios: 3,
      android: 2,
      both: 1,
    });
    expect(computePlatformCounts(sampleGames, "   ")).toEqual({
      all: 4,
      ios: 3,
      android: 2,
      both: 1,
    });
  });

  it("computes counts filtered by search query", () => {
    expect(computePlatformCounts(sampleGames, "procreate")).toEqual({
      all: 1,
      ios: 1,
      android: 0,
      both: 0,
    });
    expect(computePlatformCounts(sampleGames, "stardew")).toEqual({
      all: 1,
      ios: 1,
      android: 1,
      both: 1,
    });
    expect(computePlatformCounts(sampleGames, "dave")).toEqual({
      all: 1,
      ios: 0,
      android: 1,
      both: 0,
    });
  });
});
