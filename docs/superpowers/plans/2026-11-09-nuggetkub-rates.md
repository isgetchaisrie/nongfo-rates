# Nuggetkub Rates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:dispatching-parallel-agents to implement this plan across the 4 Orca Git Worktrees. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the production-grade Nuggetkub Rates web app (Public Pastel Pink Game Rate Viewer + Single-Password Admin CRUD with Device Image Upload) using 4 parallel agents in isolated Git worktrees.

**Architecture:** Next.js 16 App Router with SQLite (`node:sqlite`), strict Zod validation, signed HTTP-only cookie auth (`node:crypto`), custom SVG Cat Mascot design system, and disjoint file ownership per agent worktree (`wt-backend`, `wt-design`, `wt-frontend`, `wt-admin`).

**Tech Stack:** Next.js 16.4.5, React 19, TypeScript 5, Tailwind CSS v4, SQLite (`node:sqlite`), Zod 4, Vitest 4

**Spec:** `docs/superpowers/specs/2026-11-09-nuggetkub-rates-design.md`

## Global Constraints

- Pure rate viewer on public storefront (`/`): zero ordering, cart, or checkout actions.
- Only 4 user-facing data fields per game: `name`, `image` (device file upload), `platform` (`both` | `ios` | `android`), and single price per supported OS (`priceIos`, `priceAndroid`).
- Text contrast ≥ 4.5:1 on all pastel pink surfaces (`#2d1622` main ink, `#6e485b` muted ink, `#e11d68` primary accent).
- No generic AI slop patterns: no gradient text, no eyebrow kickers above headings, no hard 4px neobrutalist offset shadows, no emoji-as-icons in core UI chrome.
- Isolated SQLite database per test/worktree via `DATABASE_PATH`.

## Review Focus

- Platform-price mismatch: submitting `platform: "ios"` with a non-null `priceAndroid` (or missing `priceIos`) must normalize the unused platform price to `null` and reject missing required platform prices with `400`.
- Unauthorized admin mutations: calling `POST /api/games`, `PUT /api/games/[id]`, `DELETE /api/games/[id]`, or `POST /api/upload` without a valid signed `nk_admin_session` cookie must return `401`.
- Brute-force admin login: exceeding 5 failed password attempts within 10 minutes from the same IP must return `429`.
- Malicious file upload: uploading a non-image file or a file exceeding 5 MB to `POST /api/upload` must return `400`.
- Search & filter edge cases: searching with leading/trailing spaces or mixed case, or filtering by `ios` / `android` when a game has `platform: "both"`, must include `both` games in both `ios` and `android` filter tabs.

---

### Task 1 (Agent 3 — `wt-backend`): SQLite Database, Validation, Auth, Games API & Upload API

**Files:**
- Create: `src/lib/validation.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/auth.ts`
- Create: `src/app/api/games/route.ts`
- Create: `src/app/api/games/[id]/route.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/me/route.ts`
- Create: `src/app/api/upload/route.ts`
- Create: `public/seed/*.svg` (8 cute SVG game icons)
- Test: `tests/backend/games-db.test.ts`
- Test: `tests/backend/auth-and-upload.test.ts`

**Interfaces:**
- Consumes: `GameRate`, `GameRateInput`, `PlatformType` from `src/types/game.ts`
- Produces:
  - `validateGameInput(input: unknown): { success: true; data: GameRateInput } | { success: false; error: string }` in `src/lib/validation.ts`
  - `listGames(filter?: { query?: string; platform?: "all" | PlatformType }): GameRate[]` in `src/lib/db.ts`
  - `getGameById(id: string): GameRate | null` in `src/lib/db.ts`
  - `createGame(input: GameRateInput): GameRate` in `src/lib/db.ts`
  - `updateGame(id: string, input: GameRateInput): GameRate | null` in `src/lib/db.ts`
  - `deleteGame(id: string): boolean` in `src/lib/db.ts`
  - `createAdminToken(): string`, `verifyAdminToken(token: string | undefined): boolean`, `isAdminAuthenticated(): Promise<boolean>` in `src/lib/auth.ts`

- [ ] **Step 1: Write failing tests in `tests/backend/games-db.test.ts` and `tests/backend/auth-and-upload.test.ts`**
- [ ] **Step 2: Run `npx vitest run tests/backend` to verify RED state**
- [ ] **Step 3: Implement `src/lib/validation.ts`, `src/lib/db.ts`, `src/lib/auth.ts`, seed SVGs, and API routes**
- [ ] **Step 4: Run `npx vitest run tests/backend` to verify GREEN state**
- [ ] **Step 5: Commit on `feat/backend-db`**

---

### Task 2 (Agent 4 — `wt-design`): Pastel Pink Design System, Typography & Cat Mascot Components

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/mascot/CatMascot.tsx`
- Create: `src/components/mascot/CatFloatingWidget.tsx`
- Create: `DESIGN.md`
- Test: `tests/design/mascot-and-tokens.test.ts`

**Interfaces:**
- Produces:
  - `CatMascot({ variant, className, label }: { variant?: "hero" | "empty" | "admin" | "badge"; className?: string; label?: string })` in `src/components/mascot/CatMascot.tsx`
  - `CatFloatingWidget()` in `src/components/mascot/CatFloatingWidget.tsx`
  - CSS design tokens in `src/app/globals.css` and documented design system in `DESIGN.md`

- [ ] **Step 1: Write failing tests in `tests/design/mascot-and-tokens.test.ts`**
- [ ] **Step 2: Run `npx vitest run tests/design` to verify RED state**
- [ ] **Step 3: Implement `src/app/globals.css`, `CatMascot.tsx`, `CatFloatingWidget.tsx`, and `DESIGN.md`**
- [ ] **Step 4: Run `npx vitest run tests/design` to verify GREEN state**
- [ ] **Step 5: Commit on `feat/design-mascot`**

---

### Task 3 (Agent 1 — `wt-frontend`): Public Rate Showcase, Search Bar, Platform Switcher & Product Rate Cards

**Files:**
- Create: `src/components/storefront/filterGames.ts`
- Create: `src/components/storefront/SearchBar.tsx`
- Create: `src/components/storefront/PlatformSwitcher.tsx`
- Create: `src/components/storefront/ProductRateCard.tsx`
- Create: `src/components/storefront/RateBoardClient.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/frontend/storefront.test.ts`

**Interfaces:**
- Consumes: `GameRate`, `PlatformType` from `src/types/game.ts`, `listGames()` from `src/lib/db.ts`, `CatMascot` & `CatFloatingWidget` from `src/components/mascot/*`
- Produces:
  - `filterGames(games: GameRate[], query: string, platform: "all" | PlatformType): GameRate[]` in `src/components/storefront/filterGames.ts`
  - `ProductRateCard({ game }: { game: GameRate })`
  - `PlatformSwitcher({ value, onChange, counts }: { value: "all" | PlatformType; onChange: (p: "all" | PlatformType) => void; counts: Record<"all" | PlatformType, number> })`
  - `SearchBar({ value, onChange, onClear }: { value: string; onChange: (q: string) => void; onClear: () => void })`
  - `RateBoardClient({ initialGames }: { initialGames: GameRate[] })`

- [ ] **Step 1: Write failing tests in `tests/frontend/storefront.test.ts`**
- [ ] **Step 2: Run `npx vitest run tests/frontend` to verify RED state**
- [ ] **Step 3: Implement `filterGames.ts`, `SearchBar.tsx`, `PlatformSwitcher.tsx`, `ProductRateCard.tsx`, `RateBoardClient.tsx`, and `src/app/page.tsx`**
- [ ] **Step 4: Run `npx vitest run tests/frontend` to verify GREEN state**
- [ ] **Step 5: Commit on `feat/frontend-ui`**

---

### Task 4 (Agent 2 — `wt-admin`): Admin Login & Admin CRUD Dashboard with Device Image Upload

**Files:**
- Create: `src/components/admin/adminValidation.ts`
- Create: `src/components/admin/GameFormModal.tsx`
- Create: `src/components/admin/AdminDashboardClient.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx`
- Test: `tests/admin/admin-crud.test.ts`

**Interfaces:**
- Consumes: `GameRate`, `GameRateInput`, `PlatformType` from `src/types/game.ts`, `/api/auth/*`, `/api/games/*`, `/api/upload`, `CatMascot` from `src/components/mascot/CatMascot.tsx`
- Produces:
  - `buildGamePayload(form: { name: string; image: string; platform: PlatformType; priceIosInput: string; priceAndroidInput: string }): { ok: true; data: GameRateInput } | { ok: false; error: string }` in `src/components/admin/adminValidation.ts`
  - `/admin/login` page and `/admin` CRUD dashboard

- [ ] **Step 1: Write failing tests in `tests/admin/admin-crud.test.ts`**
- [ ] **Step 2: Run `npx vitest run tests/admin` to verify RED state**
- [ ] **Step 3: Implement `adminValidation.ts`, `GameFormModal.tsx`, `AdminDashboardClient.tsx`, `/admin/login/page.tsx`, and `/admin/page.tsx`**
- [ ] **Step 4: Run `npx vitest run tests/admin` to verify GREEN state**
- [ ] **Step 5: Commit on `feat/admin-crud`**
