import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { CategoryType, GameRate, GameRateInput, PlatformType } from "@/types/game";

interface GameRow {
  id: string;
  name: string;
  image: string;
  category: CategoryType;
  platform: PlatformType;
  price_ios: number | null;
  price_android: number | null;
  created_at: string;
  updated_at: string;
}

const SEED_GAMES: Array<GameRateInput & { id: string }> = [
  {
    id: "minecraft",
    name: "Minecraft (มายคราฟแท้ 100%)",
    image: "/logos/minecraft.png",
    category: "game",
    platform: "both",
    priceIos: 15,
    priceAndroid: 15,
  },
  {
    id: "hitman",
    name: "Hitman: Absolution",
    image: "/logos/hitman.png",
    category: "game",
    platform: "both",
    priceIos: 100,
    priceAndroid: 65,
  },
  {
    id: "papas_new",
    name: "Papa's To Go! (ภาคใหม่: Paleteria, Cluckeria, ฯลฯ)",
    image: "/logos/papas_new.png",
    category: "game",
    platform: "both",
    priceIos: 35,
    priceAndroid: 30,
  },
  {
    id: "papas_classic",
    name: "Papa's To Go! (ภาคคลาสสิก: Freezeria, Burgeria ฯลฯ)",
    image: "/logos/papas_classic.png",
    category: "game",
    platform: "both",
    priceIos: 15,
    priceAndroid: 15,
  },
  {
    id: "gta_san_classic",
    name: "Grand Theft Auto: San Andreas (Classic)",
    image: "/logos/gta_san_classic.png",
    category: "game",
    platform: "both",
    priceIos: 65,
    priceAndroid: 30,
  },
  {
    id: "gta_3",
    name: "Grand Theft Auto III",
    image: "/logos/gta_3.png",
    category: "game",
    platform: "both",
    priceIos: 65,
    priceAndroid: 30,
  },
  {
    id: "gta_vc",
    name: "Grand Theft Auto: Vice City",
    image: "/logos/gta_vc.png",
    category: "game",
    platform: "both",
    priceIos: 65,
    priceAndroid: 30,
  },
  {
    id: "gta_sa_definitive",
    name: "GTA: San Andreas - Definitive Edition",
    image: "/logos/gta_sa_definitive.png",
    category: "game",
    platform: "both",
    priceIos: 115,
    priceAndroid: 65,
  },
  {
    id: "saints_row_3",
    name: "Saints Row: The Third Remastered",
    image: "/logos/saints_row_3.png",
    category: "game",
    platform: "ios",
    priceIos: 130,
    priceAndroid: null,
  },
  {
    id: "stardew",
    name: "Stardew Valley",
    image: "/logos/stardew.png",
    category: "game",
    platform: "both",
    priceIos: 55,
    priceAndroid: 30,
  },
  {
    id: "terraria",
    name: "Terraria",
    image: "/logos/terraria.png",
    category: "game",
    platform: "both",
    priceIos: 55,
    priceAndroid: 30,
  },
  {
    id: "human_fall_flat",
    name: "Human: Fall Flat",
    image: "/logos/human_fall_flat.png",
    category: "game",
    platform: "both",
    priceIos: 55,
    priceAndroid: 30,
  },
  {
    id: "sifu",
    name: "SIFU",
    image: "/logos/sifu.png",
    category: "game",
    platform: "ios",
    priceIos: 70,
    priceAndroid: null,
  },
  {
    id: "grid_legends",
    name: "GRID Legends: Deluxe Edition",
    image: "/logos/grid_legends.png",
    category: "game",
    platform: "ios",
    priceIos: 120,
    priceAndroid: null,
  },
  {
    id: "grid_autosport",
    name: "GRID Autosport",
    image: "/logos/grid_autosport.png",
    category: "game",
    platform: "ios",
    priceIos: 80,
    priceAndroid: null,
  },
  {
    id: "red_dead",
    name: "Red Dead Redemption",
    image: "/logos/red_dead.png",
    category: "game",
    platform: "android",
    priceIos: null,
    priceAndroid: 90,
  },
  {
    id: "dealers_life_2",
    name: "Dealer's Life 2 (Pawn Shop Tycoon)",
    image: "/logos/dealers_life_2.png",
    category: "game",
    platform: "both",
    priceIos: 65,
    priceAndroid: 30,
  },
  {
    id: "tabs",
    name: "TABS: Pocket Edition (Totally Accurate Battle Simulator)",
    image: "/logos/tabs.png",
    category: "game",
    platform: "ios",
    priceIos: 55,
    priceAndroid: null,
  },
  {
    id: "ibispaint",
    name: "ibisPaint X (ไอบิสเพนท์)",
    image: "/logos/ibispaint.png",
    category: "app",
    platform: "both",
    priceIos: 120,
    priceAndroid: 40,
  },
  {
    id: "toasties",
    name: "Toasties: grilled cheese game",
    image: "/logos/toasties.png",
    category: "game",
    platform: "ios",
    priceIos: 50,
    priceAndroid: null,
  },
  {
    id: "procreate",
    name: "Procreate (เฉพาะ iPad)",
    image: "/logos/procreate.png",
    category: "app",
    platform: "ios",
    priceIos: 120,
    priceAndroid: null,
  },
  {
    id: "santhai",
    name: "สารไทย (Santhai)",
    image: "/logos/santhai.png",
    category: "game",
    platform: "ios",
    priceIos: 65,
    priceAndroid: null,
  },
  {
    id: "naruto",
    name: "Naruto (นารูโตะ ผจญภัยโลกนินจา)",
    image: "/logos/naruto.png",
    category: "game",
    platform: "both",
    priceIos: 75,
    priceAndroid: 50,
  },
  {
    id: "shadow_fight_2",
    name: "Shadow Fight 2: Special Edition",
    image: "/logos/shadow_fight_2.png",
    category: "game",
    platform: "both",
    priceIos: 65,
    priceAndroid: 40,
  },
  {
    id: "dave_the_diver",
    name: "Dave the Diver",
    image: "/logos/dave_the_diver.png",
    category: "game",
    platform: "android",
    priceIos: null,
    priceAndroid: 45,
  },
  {
    id: "bully",
    name: "Bully: Anniversary Edition",
    image: "/logos/bully.png",
    category: "game",
    platform: "ios",
    priceIos: 75,
    priceAndroid: null,
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
    category: row.category === "app" ? "app" : "game",
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

  let db: DatabaseSync;
  let actualPath = targetPath;
  try {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    db = new DatabaseSync(targetPath);
  } catch {
    actualPath = "/tmp/nuggetkub-rates.db";
    try {
      db = new DatabaseSync(actualPath);
    } catch {
      actualPath = ":memory:";
      db = new DatabaseSync(":memory:");
    }
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'game',
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

  const columns = db
    .prepare("PRAGMA table_info(games)")
    .all() as unknown as Array<{ name: string }>;
  const hasCategoryColumn = columns.some((col) => col.name === "category");
  if (!hasCategoryColumn) {
    db.exec("ALTER TABLE games ADD COLUMN category TEXT NOT NULL DEFAULT 'game'");
    db.exec(
      "UPDATE games SET category = 'app' WHERE id IN ('seed-procreate-dreams', 'seed-goodnotes-6')"
    );
  }

  const seededRow = db
    .prepare("SELECT value FROM meta WHERE key = 'seeded'")
    .get() as { value: string } | undefined;

  if (!seededRow || seededRow.value !== "2") {
    db.exec("DELETE FROM games WHERE id LIKE 'seed-%'");
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO games (
        id, name, image, category, platform, price_ios, price_android, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const baseTimeMs = Date.now() - SEED_GAMES.length * 1000;
    SEED_GAMES.forEach((item, index) => {
      // Ordered so item 0 (Minecraft) has the newest timestamp and appears first
      const iso = new Date(
        baseTimeMs + (SEED_GAMES.length - index) * 1000
      ).toISOString();
      insertStmt.run(
        item.id,
        item.name,
        item.image,
        item.category,
        item.platform,
        item.priceIos,
        item.priceAndroid,
        iso,
        iso
      );
    });

    db.prepare(
      "INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded', '2')"
    ).run();
  }

  dbInstance = db;
  currentDbPath = targetPath;
  return db;
}

export function listGames(filter?: {
  query?: string;
  platform?: "all" | PlatformType;
  category?: "all" | CategoryType;
}): GameRate[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM games ORDER BY created_at DESC, rowid DESC")
    .all() as unknown as GameRow[];

  let games = rows.map(mapRow);

  const category = filter?.category;
  if (category === "game" || category === "app") {
    games = games.filter((g) => g.category === category);
  }

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
  const category: CategoryType = input.category === "app" ? "app" : "game";
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
      id, name, image, category, platform, price_ios, price_android, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.name.trim(),
    input.image.trim(),
    category,
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
    category,
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
  const category: CategoryType = input.category === "app" ? "app" : "game";
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
     SET name = ?, image = ?, category = ?, platform = ?, price_ios = ?, price_android = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.name.trim(),
    input.image.trim(),
    category,
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
    category,
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

export function getAdminPasswordHash(): string | null {
  try {
    const db = getDb();
    const row = db
      .prepare("SELECT value FROM meta WHERE key = 'admin_password_sha256'")
      .get() as { value: string } | undefined;
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export function setAdminPasswordHash(hashHex: string): void {
  const db = getDb();
  db.prepare(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('admin_password_sha256', ?)"
  ).run(hashHex);
}

export function clearAdminPasswordHash(): void {
  try {
    const db = getDb();
    db.prepare("DELETE FROM meta WHERE key = 'admin_password_sha256'").run();
  } catch {
    // Ignore if DB not initialized
  }
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
