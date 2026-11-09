# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router, TypeScript), Tailwind CSS v4, SQLite (`node:sqlite`), Zod 4, Vitest

## Users

- **Primary visitors (Customers):** Mobile and desktop visitors looking up the current iOS and Android price rates for games and apps offered by Nuggetkub. They want instant scanability, fast search by game title, and one-tap platform filtering (`ทั้งหมด` / `iOS` / `Android`).
- **Shop Admin:** The store owner managing the game rate catalog from `/admin` on desktop or mobile (adding new games, uploading game cover/icon images directly from their device, editing iOS/Android prices, or deleting items).

## Product Purpose

Nuggetkub Rates is a dedicated, read-only public rate showcase for Nuggetkub's mobile game and app catalog, paired with a password-protected Admin CRUD dashboard. There is no checkout, cart, or ordering flow on the site; its sole purpose is to make checking iOS and Android game prices effortless, clear, and visually delightful.

## Positioning

A cute pastel-pink bento rate board featuring Nuggetkub's custom cartoon cat mascot, combining kawaii warmth with crisp, high-contrast iOS/Android price tiles inspired by clean mobile metric cards.

## Capabilities and Constraints

- **Pure Rate Viewer:** Public visitors only browse, search, and filter game price rates (`both` | `ios` | `android`). No ordering, cart, or checkout actions.
- **Strict 4-Field Game Rate Model:**
  - `name` (Game title)
  - `image` (Uploaded game icon/cover image from device)
  - `platform` (`both` | `ios` | `android`)
  - `priceIos` (Single numeric THB price for iOS, or `null` when Android-only)
  - `priceAndroid` (Single numeric THB price for Android, or `null` when iOS-only)
- **Single-Password Admin Auth:** `/admin/login` authenticates against `ADMIN_PASSWORD` and issues an HTTP-only signed session cookie.
- **Device-Only Image Upload:** Admins upload game images directly from their phone or computer (`POST /api/upload` storing validated image files under `public/uploads/games/`).

## Brand Commitments

- **Brand Name:** Nuggetkub Rates (เรทราคาเกมและแอปแท้)
- **Visual Identity:** Cute Pastel Pink palette with custom SVG cartoon cat mascots (`Nuggetkub Cat`), soft bento rate cards, and crisp Thai/English typography (`Mali`, `Prompt`, `Fredoka`).

## Product Principles

1. **Instant Price Clarity:** Every card shows iOS and Android prices in distinct, high-contrast metric tiles at a glance.
2. **Zero Clutter:** Only the fields that matter—name, image, platform, and price per OS.
3. **Kawaii Craft Without Generic Slop:** Custom cartoon cat mascot illustrations and cohesive pastel-pink tokens with accessible text contrast (≥ 4.5:1).
4. **Effortless Admin Updates:** Updating a price or uploading a new game image from a phone takes seconds.
