# Nuggetkub Rates — Design Specification

**Date:** 2026-11-09  
**Project Root:** `/Users/getchaisrie_/Projects/nuggetkub-rates`  
**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, SQLite (`node:sqlite`), Zod 4, Vitest

---

## 1. Intent & Why

Create **Nuggetkub Rates**, a production-grade web application dedicated exclusively to displaying mobile game and app price rates for iOS and Android in a cute pastel-pink aesthetic with custom cartoon cat mascots, accompanied by a secure single-password Admin CRUD dashboard.

### Goals
- Instant scanability of iOS and Android game prices via clean bento rate cards.
- Real-time client search by game name and instant platform filtering (`ทั้งหมด` / `iOS` / `Android`).
- Distinct Pastel Pink visual identity with custom SVG cartoon cat mascots (`Nuggetkub Cat`) and accessible typography.
- Simple, secure Admin Dashboard (`/admin` & `/admin/login`) with single-password login (`ADMIN_PASSWORD`), rate table management, and direct device image upload.
- Parallel implementation across 4 isolated Git Worktrees orchestrated via Orca, verified with TDD (Superpowers) and visual/a11y checks (Impeccable).

### Non-Goals & Anti-Goals
- **No ordering, cart, checkout, or payment flows** on the public site.
- **No extra fields** on rate cards (no special price field, no notes field, no external URL paste for images).
- **No multi-role admin system, announcement settings, or JSON import/export.**
- **No generic AI template anti-patterns** (no gradient text, no eyebrow kickers above headings, no low-contrast gray-on-pink text).

---

## 2. Data Model & Validation Rules

### SQLite Table: `games`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT PRIMARY KEY` | UUID / slug | Unique identifier |
| `name` | `TEXT NOT NULL` | 1–120 chars | Game or app display title |
| `image` | `TEXT NOT NULL` | Non-empty path | Uploaded image path (`/uploads/games/...` or `/seed/...`) |
| `platform` | `TEXT NOT NULL` | `'both' \| 'ios' \| 'android'` | Supported OS platform |
| `price_ios` | `INTEGER NULL` | `> 0` when `platform` is `both` or `ios`, else `NULL` | iOS price in THB |
| `price_android` | `INTEGER NULL` | `> 0` when `platform` is `both` or `android`, else `NULL` | Android price in THB |
| `created_at` | `TEXT NOT NULL` | ISO 8601 | Creation timestamp |
| `updated_at` | `TEXT NOT NULL` | ISO 8601 | Last update timestamp |

### Seed Data
On first initialization (when `games` table is empty), seed 8 curated sample games with cute pastel SVG cover icons stored in `public/seed/`:
1. **Stardew Valley** (`both`, iOS ฿55, Android ฿30)
2. **Minecraft Pocket** (`both`, iOS ฿25, Android ฿20)
3. **Procreate Dreams** (`ios`, iOS ฿120, Android `null`)
4. **Goodnotes 6** (`ios`, iOS ฿99, Android `null`)
5. **Terraria** (`both`, iOS ฿55, Android ฿30)
6. **Papa's Freezeria To Go!** (`both`, iOS ฿25, Android ฿20)
7. **Dave the Diver Mobile** (`android`, iOS `null`, Android ฿45)
8. **Human: Fall Flat** (`both`, iOS ฿55, Android ฿30)

---

## 3. Architecture & API Contract

### Backend APIs (Agent 3)
- `GET /api/games`: Returns `{ games: GameRate[] }` sorted by `createdAt DESC`. Supports optional `?q=` and `?platform=all|ios|android`.
- `POST /api/games` *(Admin only)*: Validates `GameRateInput` with Zod, normalizes platform prices (`ios` forces `priceAndroid = null`, `android` forces `priceIos = null`), inserts into SQLite, returns `201 { game: GameRate }`.
- `PUT /api/games/[id]` *(Admin only)*: Validates `GameRateInput`, updates row in SQLite, returns `200 { game: GameRate }` or `404`.
- `DELETE /api/games/[id]` *(Admin only)*: Deletes row from SQLite, returns `200 { ok: true }` or `404`.
- `POST /api/auth/login`: Accepts `{ password: string }`, checks rate limit (max 5 failed attempts per 10 minutes per IP), compares with `process.env.ADMIN_PASSWORD` using constant-time comparison, sets HTTP-only signed session cookie (`nk_admin_session`), returns `200 { ok: true }` or `401`/`429`.
- `POST /api/auth/logout`: Clears `nk_admin_session` cookie, returns `200 { ok: true }`.
- `GET /api/auth/me`: Returns `{ authenticated: boolean }`.
- `POST /api/upload` *(Admin only)*: Accepts `multipart/form-data` with field `file` (PNG, JPEG, WEBP, GIF, SVG up to 5 MB), verifies magic bytes / MIME, writes to `public/uploads/games/<uuid>.<ext>`, returns `201 { url: "/uploads/games/<uuid>.<ext>" }`.

### Design System & Mascot (Agent 4)
- **Pastel Pink Tokens (`src/app/globals.css`):**
  - Surface canvas: `--bg-canvas: #fff6f9` (Soft Strawberry Milk)
  - Card surface: `--bg-card: #ffffff` with warm pink border `--border-pastel: #ffd6e5`
  - Elevated / Bento tile surfaces: `--tile-ios: #fff0f6`, `--tile-android: #eefbf5`
  - Primary accent: `--pink-primary: #e11d68` (High-contrast Berry Pink for buttons/active pills)
  - Secondary accent: `--pink-soft: #ff85b3`
  - Text hierarchy: `--ink-main: #2d1622` (Deep Cocoa Plum, contrast > 11:1), `--ink-muted: #6e485b` (contrast > 5.5:1)
- **Cat Mascot Components (`src/components/mascot/CatMascot.tsx`):**
  - `CatMascot` with variants: `hero` (holding a game controller / rate board), `empty` (curious sleepy cat looking for games), `admin` (cat wearing glasses with clipboard), `badge` (mini cat face icon).
  - `PawDivider` and `CatFloatingHelper` (subtle interactive purr/wave bubble on the public page).

### Public Rate Showcase (Agent 1)
- Route: `src/app/page.tsx` + `src/components/storefront/RateBoardClient.tsx` + `src/components/storefront/ProductRateCard.tsx` + `src/components/storefront/PlatformSwitcher.tsx` + `src/components/storefront/SearchBar.tsx`.
- Displays Hero Banner with `CatMascot variant="hero"`, live game counter pill, real-time Search Bar, Platform Switcher (`ทั้งหมด`, `iOS`, `Android`), and responsive 1/2/3/4-column Bento Grid of `ProductRateCard`s.
- Each `ProductRateCard` displays:
  - Square rounded game cover image (`aspect-square` / crisp framing)
  - Platform badge (`iOS & Android`, `เฉพาะ iOS`, `เฉพาะ Android`)
  - Game title (`name`)
  - Dedicated two-column price metric tiles (`iOS` price in THB and `Android` price in THB, or `—` when not available on that OS).

### Admin CRUD Dashboard (Agent 2)
- Routes: `src/app/admin/login/page.tsx` and `src/app/admin/page.tsx` + `src/components/admin/AdminDashboardClient.tsx` + `src/components/admin/GameFormModal.tsx`.
- Single password login form with cute `CatMascot variant="admin"`.
- Protected `/admin` table showing thumbnail, game name, platform badge, iOS price, Android price, and Edit / Delete buttons.
- Add / Edit modal with:
  - Game Name input
  - Platform selector (`both` | `ios` | `android`) dynamically enabling/requiring `priceIos` and/or `priceAndroid`
  - Device file upload input (`<input type="file" accept="image/*" />`) that uploads via `POST /api/upload` and displays an instant image preview.

---

## 4. Parallel Worktree Allocation (Orca)

| Agent | Worktree Name | Branch | Owned Files |
|---|---|---|---|
| **Agent 3 — Backend & DB** | `wt-backend` | `feat/backend-db` | `src/lib/**`, `src/app/api/**`, `public/seed/**`, `tests/backend/**` |
| **Agent 4 — Design & Mascot** | `wt-design` | `feat/design-mascot` | `src/app/globals.css`, `src/components/mascot/**`, `DESIGN.md`, `tests/design/**` |
| **Agent 1 — Frontend** | `wt-frontend` | `feat/frontend-ui` | `src/app/page.tsx`, `src/components/storefront/**`, `tests/frontend/**` |
| **Agent 2 — Admin CRUD** | `wt-admin` | `feat/admin-crud` | `src/app/admin/**`, `src/components/admin/**`, `tests/admin/**` |

Each worktree owns a completely disjoint set of file paths, allowing all 4 agents to develop and run tests concurrently without merge conflicts!
