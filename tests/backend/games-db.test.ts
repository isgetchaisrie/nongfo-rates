import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validateGameInput } from "@/lib/validation";
import {
  createGame,
  deleteGame,
  getGameById,
  listGames,
  resetDbForTests,
  updateGame,
} from "@/lib/db";
import * as auth from "@/lib/auth";
import { GET as getGamesRoute, POST as postGamesRoute } from "@/app/api/games/route";
import {
  DELETE as deleteGameByIdRoute,
  PUT as putGameByIdRoute,
} from "@/app/api/games/[id]/route";

describe("validateGameInput", () => {
  it("validates a game available on both platforms", () => {
    const res = validateGameInput({
      name: "  Stardew Valley  ",
      image: " /seed/stardew.svg ",
      platform: "both",
      priceIos: 55,
      priceAndroid: 30,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toEqual({
        name: "Stardew Valley",
        image: "/seed/stardew.svg",
        platform: "both",
        priceIos: 55,
        priceAndroid: 30,
      });
    }
  });

  it("normalizes priceAndroid to null when platform is ios", () => {
    const res = validateGameInput({
      name: "Procreate Dreams",
      image: "/seed/procreate.svg",
      platform: "ios",
      priceIos: 120,
      priceAndroid: 99,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.priceIos).toBe(120);
      expect(res.data.priceAndroid).toBeNull();
    }
  });

  it("normalizes priceIos to null when platform is android", () => {
    const res = validateGameInput({
      name: "Dave the Diver Mobile",
      image: "/seed/diver.svg",
      platform: "android",
      priceIos: 50,
      priceAndroid: 45,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.priceIos).toBeNull();
      expect(res.data.priceAndroid).toBe(45);
    }
  });

  it("rejects empty name, invalid image path, or missing required platform price", () => {
    const emptyName = validateGameInput({
      name: "   ",
      image: "/seed/stardew.svg",
      platform: "both",
      priceIos: 55,
      priceAndroid: 30,
    });
    expect(emptyName.success).toBe(false);

    const badImage = validateGameInput({
      name: "Stardew",
      image: "https://evil.example.com/pic.png",
      platform: "both",
      priceIos: 55,
      priceAndroid: 30,
    });
    expect(badImage.success).toBe(false);

    const missingIosPrice = validateGameInput({
      name: "Stardew",
      image: "/seed/stardew.svg",
      platform: "both",
      priceIos: null,
      priceAndroid: 30,
    });
    expect(missingIosPrice.success).toBe(false);

    const missingAndroidPrice = validateGameInput({
      name: "Stardew",
      image: "/seed/stardew.svg",
      platform: "android",
      priceIos: null,
      priceAndroid: 0,
    });
    expect(missingAndroidPrice.success).toBe(false);
  });
});

describe("SQLite games database and seed data", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "nk-rates-db-test-"));
    process.env.DATABASE_PATH = path.join(tmpDir, "test-rates.db");
    resetDbForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("seeds the 8 curated games with existing SVG cover files on initial load", () => {
    const games = listGames();
    expect(games).toHaveLength(8);

    const names = games.map((g) => g.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "Stardew Valley",
        "Minecraft Pocket",
        "Procreate Dreams",
        "Goodnotes 6",
        "Terraria",
        "Papa's Freezeria To Go!",
        "Dave the Diver Mobile",
        "Human: Fall Flat",
      ])
    );

    for (const game of games) {
      expect(game.image.startsWith("/seed/")).toBe(true);
      const svgDiskPath = path.join(process.cwd(), "public", game.image);
      expect(fs.existsSync(svgDiskPath)).toBe(true);
      const svgContent = fs.readFileSync(svgDiskPath, "utf8");
      expect(svgContent).toContain("<svg");
    }
  });

  it("filters games by platform and case-insensitive search query", () => {
    const iosGames = listGames({ platform: "ios" });
    expect(iosGames).toHaveLength(7);
    expect(iosGames.every((g) => g.platform === "ios" || g.platform === "both")).toBe(
      true
    );

    const androidGames = listGames({ platform: "android" });
    expect(androidGames).toHaveLength(6);
    expect(
      androidGames.every((g) => g.platform === "android" || g.platform === "both")
    ).toBe(true);

    const searched = listGames({ query: "papa" });
    expect(searched).toHaveLength(1);
    expect(searched[0]?.name).toBe("Papa's Freezeria To Go!");
  });

  it("performs create, getById, update, and delete without re-seeding when all rows are deleted", () => {
    const created = createGame({
      name: "Slay the Spire",
      image: "/uploads/games/spire.png",
      platform: "both",
      priceIos: 69,
      priceAndroid: 49,
    });
    expect(created.id).toBeTruthy();
    expect(getGameById(created.id)?.name).toBe("Slay the Spire");

    const updated = updateGame(created.id, {
      name: "Slay the Spire+",
      image: "/uploads/games/spire.png",
      platform: "ios",
      priceIos: 79,
      priceAndroid: null,
    });
    expect(updated?.name).toBe("Slay the Spire+");
    expect(updated?.platform).toBe("ios");
    expect(updated?.priceAndroid).toBeNull();

    // Delete all games and ensure it stays empty (does not re-seed)
    for (const g of listGames()) {
      expect(deleteGame(g.id)).toBe(true);
    }
    expect(listGames()).toHaveLength(0);
    expect(deleteGame("non-existent-id")).toBe(false);
  });

  it("serves GET, POST, PUT, and DELETE API routes with admin auth enforcement", async () => {
    const getRes = await getGamesRoute(
      new Request("http://localhost:3000/api/games?platform=ios")
    );
    expect(getRes.status).toBe(200);
    const getBody = (await getRes.json()) as { games: unknown[] };
    expect(getBody.games).toHaveLength(7);

    // Unauthenticated POST should fail with 401
    vi.spyOn(auth, "isAdminAuthenticated").mockResolvedValue(false);
    const unauthPost = await postGamesRoute(
      new Request("http://localhost:3000/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Cytus II",
          image: "/seed/stardew.svg",
          platform: "both",
          priceIos: 29,
          priceAndroid: 19,
        }),
      })
    );
    expect(unauthPost.status).toBe(401);

    // Authenticated POST should succeed with 201
    vi.spyOn(auth, "isAdminAuthenticated").mockResolvedValue(true);
    const authPost = await postGamesRoute(
      new Request("http://localhost:3000/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Cytus II",
          image: "/seed/stardew.svg",
          platform: "both",
          priceIos: 29,
          priceAndroid: 19,
        }),
      })
    );
    expect(authPost.status).toBe(201);
    const createdPayload = (await authPost.json()) as { game: { id: string; name: string } };
    expect(createdPayload.game.name).toBe("Cytus II");

    const gameId = createdPayload.game.id;

    // Authenticated PUT
    const putRes = await putGameByIdRoute(
      new Request(`http://localhost:3000/api/games/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Cytus II Deluxe",
          image: "/seed/stardew.svg",
          platform: "ios",
          priceIos: 35,
          priceAndroid: null,
        }),
      }),
      { params: Promise.resolve({ id: gameId }) }
    );
    expect(putRes.status).toBe(200);
    const putPayload = (await putRes.json()) as { game: { name: string; priceAndroid: number | null } };
    expect(putPayload.game.name).toBe("Cytus II Deluxe");
    expect(putPayload.game.priceAndroid).toBeNull();

    // Authenticated DELETE
    const delRes = await deleteGameByIdRoute(
      new Request(`http://localhost:3000/api/games/${gameId}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: gameId }) }
    );
    expect(delRes.status).toBe(200);

    // Deleting again returns 404
    const delAgain = await deleteGameByIdRoute(
      new Request(`http://localhost:3000/api/games/${gameId}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ id: gameId }) }
    );
    expect(delAgain.status).toBe(404);
  });
});
