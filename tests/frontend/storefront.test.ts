import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { GameRate } from "@/types/game";
import {
  computeCategoryCounts,
  computePlatformCounts,
  filterGames,
} from "@/components/storefront/filterGames";
import { BottomNav } from "@/components/storefront/BottomNav";
import { PaymentAccountSection } from "@/components/storefront/PaymentAccountSection";
import { ContactAdminSection } from "@/components/storefront/ContactAdminSection";

const sampleGames: GameRate[] = [
  {
    id: "stardew-valley",
    name: "Stardew Valley",
    image: "/seed/stardew.svg",
    category: "game",
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
    category: "app",
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
    category: "game",
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
    category: "app",
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

  it("filters by category ('game' vs 'app') combined with platform and search", () => {
    expect(filterGames(sampleGames, "", "all", "game").map((g) => g.id)).toEqual([
      "stardew-valley",
      "dave-the-diver",
    ]);
    expect(filterGames(sampleGames, "", "all", "app").map((g) => g.id)).toEqual([
      "procreate-dreams",
      "goodnotes-6",
    ]);
    expect(filterGames(sampleGames, "", "ios", "game").map((g) => g.id)).toEqual([
      "stardew-valley",
    ]);
    expect(filterGames(sampleGames, "", "android", "app")).toEqual([]);
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

describe("computePlatformCounts and computeCategoryCounts", () => {
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
    expect(computeCategoryCounts(sampleGames)).toEqual({
      all: 4,
      game: 2,
      app: 2,
    });
  });

  it("computes counts filtered by search query and category/platform", () => {
    expect(computePlatformCounts(sampleGames, "", "app")).toEqual({
      all: 2,
      ios: 2,
      android: 0,
      both: 0,
    });
    expect(computeCategoryCounts(sampleGames, "", "android")).toEqual({
      all: 2,
      game: 2,
      app: 0,
    });
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

describe("BottomNav, PaymentAccountSection, and ContactAdminSection", () => {
  it("renders the 4 bottom tabs without standalone table tab", () => {
    const html = renderToStaticMarkup(
      React.createElement(BottomNav, {
        activeSection: "account",
        onSelectSection: () => {},
        category: "all",
        onSelectCategory: () => {},
        gameCount: 38,
        appCount: 15,
      }),
    );

    expect(html).toContain("บัญชี");
    expect(html).toContain("หมวดเกม");
    expect(html).toContain("หมวดแอป");
    expect(html).not.toContain("ตารางเรท");
    expect(html).toContain("ติดต่อแอดมิน");
  });

  it("renders Pattida payment account details and ContactAdminSection channels", () => {
    const paymentHtml = renderToStaticMarkup(
      React.createElement(PaymentAccountSection),
    );
    expect(paymentHtml).toContain("Pattida");
    expect(paymentHtml).toContain("151-8-83098-4");
    expect(paymentHtml).toContain("096-018-0967");
    expect(paymentHtml).toContain("ยินยอมซื้อขายFb Pat Pattida");

    const contactHtml = renderToStaticMarkup(
      React.createElement(ContactAdminSection),
    );
    expect(contactHtml).toContain("Pat Pattida");
    expect(contactHtml).toContain("Thitima Nongfo");
    expect(contactHtml).toContain("@709qwuff");
  });
});
