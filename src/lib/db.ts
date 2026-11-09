import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { GameRate, GameRateInput, PlatformType } from "@/types/game";

interface GameRow {
  id: string;
  name: string;
  image: string;
  platform: PlatformType;
  price_ios: number | null;
  price_android: number | null;
  created_at: string;
  updated_at: string;
}

const SEED_GAMES: Array<GameRateInput & { id: string }> = [
  {
    id: "seed-stardew-valley",
    name: "Stardew Valley",
    image: "/seed/stardew.svg",
    platform: "both",
    priceIos: 55,
    priceAndroid: 30,
  },
  {
    id: "seed-minecraft-pocket",
    name: "Minecraft Pocket",
    image: "/seed/minecraft.svg",
    platform: "both",
    priceIos: 25,
    priceAndroid: 20,
  },
  {
    id: "seed-procreate-dreams",
    name: "Procreate Dreams",
    image: "/seed/procreate.svg",
    platform: "ios",
    priceIos: 120,
    priceAndroid: null,
  },
  {
    id: "seed-goodnotes-6",
    name: "Goodnotes 6",
    image: "/seed/goodnotes.svg",
    platform: "ios",
    priceIos: 99,
    priceAndroid: null,
  },
  {
    id: "seed-terraria",
    name: "Terraria",
    image: "/seed/terraria.svg",
    platform: "both",
    priceIos: 55,
    priceAndroid: 30,
  },
  {
    id: "seed-papas-freezeria",
    name: "Papa's Freezeria To Go!",
    image: "/seed/papas.svg",
    platform: "both",
    priceIos: 25,
    priceAndroid: 20,
  },
  {
    id: "seed-dave-the-diver",
    name: "Dave the Diver Mobile",
    image: "/seed/diver.svg",
    platform: "android",
    priceIos: null,
    priceAndroid: 45,
  },
  {
    id: "seed-human-fall-flat",
    name: "Human: Fall Flat",
    image: "/seed/human.svg",
    platform: "both",
    priceIos: 55,
    priceAndroid: 30,
  },
];

let dbInstance: DatabaseSync | null = null;
let currentDbPath: string | null = null;

function resolveDbPath(): string {
  return process.env.DATABASE_PATH || "./data/nuggetkub-rates.db";
}

function mapRow(row: GameRow): GameRate {
  return {
    id: row.id,
    name: row.name,
    image: row.image,
    platform: row.platform,
    priceIos: row.price_ios,
    priceAndroid: row.price_android,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getDb(): DatabaseSync {
  const targetPath = resolveDbPath();
  if (dbInstance && currentDbPath === targetPath) {
    return dbInstance;
  }

  if (dbInstance) {
    try {
      dbInstance.close();
    } catch {
      // Ignore already-closed database errors
    }
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const db = new DatabaseSync(targetPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      platform TEXT NOT NULL,
      price_ios INTEGER,
      price_android INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const seededRow = db
    .prepare("SELECT value FROM meta WHERE key = 'seeded'")
    .get() as { value: string } | undefined;

  if (!seededRow) {
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO games (
        id, name, image, platform, price_ios, price_android, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const baseTimeMs = Date.now() - SEED_GAMES.length * 1000;
    SEED_GAMES.forEach((item, index) => {
      const iso = new Date(baseTimeMs + index * 1000).toISOString();
      insertStmt.run(
        item.id,
        item.name,
        item.image,
        item.platform,
        item.priceIos,
        item.priceAndroid,
        iso,
        iso
      );
    });

    db.prepare(
      "INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded', '1')"
    ).run();
  }

  dbInstance = db;
  currentDbPath = targetPath;
  return db;
}

export function listGames(filter?: {
  query?: string;
  platform?: "all" | PlatformType;
}): GameRate[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM games ORDER BY created_at DESC, rowid DESC")
    .all() as unknown as GameRow[];

  let games = rows.map(mapRow);

  const platform = filter?.platform;
  if (platform === "ios") {
    games = games.filter((g) => g.platform === "ios" || g.platform === "both");
  } else if (platform === "android") {
    games = games.filter(
      (g) => g.platform === "android" || g.platform === "both"
    );
  } else if (platform === "both") {
    games = games.filter((g) => g.platform === "both");
  }

  const query = filter?.query?.trim().toLowerCase();
  if (query) {
    games = games.filter((g) => g.name.toLowerCase().includes(query));
  }

  return games;
}

export function getGameById(id: string): GameRate | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM games WHERE id = ?")
    .get(id) as unknown as GameRow | undefined;
  return row ? mapRow(row) : null;
}

export function createGame(input: GameRateInput): GameRate {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const priceIos =
    input.platform === "both" || input.platform === "ios"
      ? input.priceIos
      : null;
  const priceAndroid =
    input.platform === "both" || input.platform === "android"
      ? input.priceAndroid
      : null;

  db.prepare(
    `INSERT INTO games (
      id, name, image, platform, price_ios, price_android, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.name.trim(),
    input.image.trim(),
    input.platform,
    priceIos,
    priceAndroid,
    now,
    now
  );

  return {
    id,
    name: input.name.trim(),
    image: input.image.trim(),
    platform: input.platform,
    priceIos,
    priceAndroid,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateGame(id: string, input: GameRateInput): GameRate | null {
  const db = getDb();
  const existing = getGameById(id);
  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();
  const priceIos =
    input.platform === "both" || input.platform === "ios"
      ? input.priceIos
      : null;
  const priceAndroid =
    input.platform === "both" || input.platform === "android"
      ? input.priceAndroid
      : null;

  db.prepare(
    `UPDATE games
     SET name = ?, image = ?, platform = ?, price_ios = ?, price_android = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.name.trim(),
    input.image.trim(),
    input.platform,
    priceIos,
    priceAndroid,
    now,
    id
  );

  return {
    id,
    name: input.name.trim(),
    image: input.image.trim(),
    platform: input.platform,
    priceIos,
    priceAndroid,
    createdAt: existing.createdAt,
    updatedAt: now,
  };
}

export function deleteGame(id: string): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM games WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function resetDbForTests(): void {
  if (dbInstance) {
    try {
      dbInstance.close();
    } catch {
      // Ignore close error
    }
    dbInstance = null;
    currentDbPath = null;
  }
  const targetPath = resolveDbPath();
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { force: true });
  }
  getDb();
}
