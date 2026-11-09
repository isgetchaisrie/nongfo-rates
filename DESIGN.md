---
name: Nongfo Rates
description: Cute pastel-pink bento rate showcase with custom kawaii cat mascots and high-contrast iOS/Android price tiles
colors:
  bg-canvas: "#fff6f9"
  bg-surface: "#ffffff"
  bg-elevated: "#fff0f5"
  tile-ios: "#fff0f6"
  tile-ios-border: "#ffc2da"
  tile-android: "#eefbf5"
  tile-android-border: "#b8f0d6"
  pink-primary: "#e11d68"
  pink-hover: "#be1253"
  pink-soft: "#ff85b3"
  pink-blush: "#ffd6e5"
  ink-main: "#2d1622"
  ink-muted: "#6e485b"
  android-ink: "#0f5137"
  border-pastel: "#ffd6e5"
  candy-pink: "#fce4ec"
  butter-cream: "#fffde7"
  cocoa-brown: "#9e8877"
  cocoa-deep: "#5c4338"
  cocoa-ink: "#4a352c"
  cocoa-muted: "#6d5246"
  pastel-blue: "#e8f0fe"
  mint-blue: "#e0f2f1"
  accent-pink: "#f8bbd0"
  soft-accent: "#f8c8dc"
  sakura-border: "#f48fb1"
  berry-deep: "#b81452"
  rose-icon: "#d81b60"
  rose-focus: "#f06292"
  cream-input: "#fffdf9"
typography:
  display:
    fontFamily: "Mali, Prompt, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Mali, Prompt, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Prompt, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Prompt, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Fredoka, Prompt, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
  pill: "9999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.pink-primary}"
    textColor: "{colors.bg-surface}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.pink-hover}"
  card-rate:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.ink-main}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: Nongfo Rates

## Overview

**Creative North Star: "The Strawberry Calico Arcade Counter"**

Nongfo Rates pairs the welcoming warmth of a pastel-pink stationery & game boutique with the crisp, zero-ambiguity data clarity of a mobile rate board. Visitors arrive for one job—checking iOS and Android game prices in seconds—and are greeted by **Nongfo Cat**, an original strawberry-calico cartoon mascot rendered in crisp vector line art.

Every surface is tinted from the strawberry-milk and cocoa-plum family rather than generic cool grays. Information density stays intentionally focused: every game card presents only the game cover, platform badge, title, and side-by-side iOS/Android THB price tiles.

**Key Characteristics:**
- **Tinted Pastel Surfaces:** Strawberry Milk canvas (`#fff6f9`) with crisp white bento cards (`#ffffff`) and blush borders (`#ffd6e5`).
- **Accessible Cocoa Typography:** Deep Cocoa Plum ink (`#2d1622`, >11:1 contrast) and Muted Berry Cocoa (`#6e485b`, >5.5:1 contrast) guarantee effortless reading on pastel backgrounds.
- **Dual-OS Metric Tiles:** Immediate visual distinction between iOS (`#fff0f6` rose blush tile) and Android (`#eefbf5` mint cream tile with `#0f5137` forest ink).
- **Authored SVG Mascot Craft:** Custom kawaii cat illustrations (`hero`, `empty`, `admin`, `badge`) and paw-sparkle SVG accents with zero emoji substitutes.

## Colors

The palette balances soft strawberry-milk surfaces against high-contrast berry rose interactive accents and deep cocoa ink so kawaii warmth never compromises WCAG AA/AAA legibility.

### Primary
- **Berry Rose** (`#e11d68` / `--pink-primary`): Primary interactive actions, active platform filter pills, and iOS price emphasis. Achieves ≥ 4.5:1 contrast with crisp white text (`#ffffff`) and > 5.2:1 against Strawberry Milk surfaces.
- **Deep Berry Hover** (`#be1253` / `--pink-hover`): Hover and active pressed state for primary buttons and links.

### Secondary
- **Sakura Ribbon** (`#ff85b3` / `--pink-soft`): Mascot cheeks, headphone accents, custom scrollbar thumbs, and card hover borders.
- **Strawberry Blush** (`#ffd6e5` / `--pink-blush` / `--border-pastel`): Card borders, divider lines, text selection highlight, and calico ear patches.

### Tertiary
- **iOS Rose Tile** (`#fff0f6` / `--tile-ios`) with **Rose Tile Border** (`#ffc2da` / `--tile-ios-border`): Dedicated container surface for iOS THB rate tiles.
- **Android Mint Tile** (`#eefbf5` / `--tile-android`) with **Mint Tile Border** (`#b8f0d6` / `--tile-android-border`) and **Mint Forest Ink** (`#0f5137` / `--android-ink`): Dedicated container surface and high-contrast text (>8.5:1) for Android THB rate tiles.

### Neutral
- **Strawberry Milk Canvas** (`#fff6f9` / `--bg-canvas`): Root page background with a subtle radial polka dot texture (`.bg-pastel-canvas`).
- **Pure Cream Card** (`#ffffff` / `--bg-surface`): Primary surface for bento rate cards, search bar, and modals.
- **Elevated Blossom** (`#fff0f5` / `--bg-elevated`): Secondary elevated container and scrollbar track.
- **Deep Cocoa Plum** (`#2d1622` / `--ink-main`): Primary body and heading ink (>11:1 contrast on `#fff6f9` and `#ffffff`).
- **Muted Berry Cocoa** (`#6e485b` / `--ink-muted`): Secondary labels, platform metadata, and helper copy (>5.5:1 contrast on `#fff6f9`, ≥ 4.5:1 on `#fff0f6`).

### Named Rules
**The Tinted-Ink Rule.** Never place cool gray text (`#6b7280`, `#9ca3af`) on pastel pink surfaces. All primary and secondary text must use Deep Cocoa Plum (`#2d1622`) or Muted Berry Cocoa (`#6e485b`) to maintain warm harmony and ≥ 4.5:1 contrast.

**The Dual-Tile Clarity Rule.** Every game card reserves left and right metric tiles for `iOS` (`#fff0f6`) and `Android` (`#eefbf5`) so visitors can compare OS prices by spatial position alone.

## Typography

**Display Font:** `Mali` (Thai/Latin rounded handwritten kawaii display face, weights 500/600/700)
**Body Font:** `Prompt` (Crisp geometric Thai/Latin loopless sans-serif for instant scanability, weights 400/500/600)
**Label/Numeral Font:** `Fredoka` paired with `Prompt` (`font-variant-numeric: tabular-nums` for aligned THB prices)

**Character:** `Mali` brings friendly, approachable shop-mascot charm to hero titles and section headings, while `Prompt` and `Fredoka` keep game titles, search inputs, and THB numerals razor-sharp on mobile screens.

### Hierarchy
- **Display** (`700`, `clamp(1.75rem, 3.5vw, 2.5rem)`, line-height `1.2`): Hero banner headline (`Nongfo Rates`).
- **Headline** (`700`, `1.375rem–1.5rem`, line-height `1.3`): Section headers, modal titles, and empty-state headings.
- **Title** (`600`, `1.0625rem–1.125rem`, line-height `1.35`): Game title on each `ProductRateCard`.
- **Body** (`400–500`, `0.9375rem–1rem`, line-height `1.6`, max measure `65ch`): Search input, helper bubble tips, and admin table cells.
- **Price Numeral** (`700`, `1.125rem–1.35rem`, `font-variant-numeric: tabular-nums`): THB rate values (`฿55`, `฿30`) inside OS metric tiles.

### Named Rules
**The Tabular Price Rule.** All THB price numbers use `.tabular-nums` (`font-variant-numeric: tabular-nums`) so digits align cleanly across cards and admin tables.

## Layout

- **Container:** Centered `max-w-6xl` (`1152px`) container with `16px` (`px-4`) mobile padding and `24px–32px` (`sm:px-6 lg:px-8`) desktop padding.
- **Bento Rate Grid:** Responsive CSS Grid adapting from 1 column on narrow phones (`grid-cols-1`) to 2 columns on large phones/tablets (`sm:grid-cols-2`), 3 columns on laptops (`lg:grid-cols-3`), and 4 columns on wide screens (`xl:grid-cols-4`) with `16px–20px` (`gap-4 sm:gap-5`) spacing.
- **Filter & Search Bar:** Sticky-friendly horizontal control bar pairing real-time search on the left with the 3-state platform pill switcher (`ทั้งหมด`, `iOS`, `Android`) on the right.

## Elevation & Depth

Surfaces rely on warm berry-tinted ambient shadows combined with 1px pastel borders (`#ffd6e5`). Hard neobrutalist block shadows (`4px 4px 0`) and zero-offset neon glows are strictly prohibited.

### Shadow Vocabulary
- **Resting Bento Card** (`--shadow-card: 0 10px 28px -8px rgba(190, 18, 83, 0.10), 0 2px 6px -1px rgba(45, 22, 34, 0.04)`): Applied to rate cards, hero banner, and floating mascot bubble.
- **Hovered Bento Card** (`--shadow-card-hover: 0 18px 36px -10px rgba(190, 18, 83, 0.16), 0 4px 10px -2px rgba(45, 22, 34, 0.06)`): Paired with `-3px` vertical lift on hover using `--ease-out-expo`.

### Named Rules
**The Soft Rose Shadow Rule.** Shadows must always carry a vertical offset and soft blur tinted with berry/cocoa (`rgba(190, 18, 83, ...)`), never pure black or hard 0-blur offsets.

## Shapes

- **Cards & Hero Containers:** Generous `24px` (`rounded-3xl`) outer corners with `1px solid #ffd6e5` borders.
- **Game Cover Artwork & Inner Metric Tiles:** Nested `16px` (`rounded-2xl`) corners so inner radii nest concentrically inside the `24px` card shell.
- **Filter Switcher & Badges:** Full pill geometry (`9999px` / `rounded-full`).

## Components

### Buttons & Platform Pills
- **Shape:** Full pill (`rounded-full`, `9999px`).
- **Primary / Active Pill:** Berry Rose background (`#e11d68`), crisp white text (`#ffffff`), `font-weight: 600`.
- **Hover / Focus:** Transitions to Deep Berry (`#be1253`) on hover; `:focus-visible` renders a `2px solid #e11d68` ring with `2px` offset.
- **Inactive Pill:** White/blush surface (`#fff0f6`) with Deep Cocoa text (`#2d1622`) and `#ffc2da` border.

### Bento Rate Card (`ProductRateCard`)
- **Corner Style:** `24px` (`rounded-3xl`) outer shell, `16px` (`rounded-2xl`) square game cover frame (`aspect-square`) and OS price tiles.
- **Background:** Pure white (`#ffffff`) card with `1px solid #ffd6e5` border.
- **Anatomy:**
  1. Top square game icon/cover with subtle platform badge (`iOS & Android`, `เฉพาะ iOS`, `เฉพาะ Android`).
  2. Game title in Deep Cocoa (`#2d1622`, `Prompt` 600).
  3. Two-column OS price metric grid: left `iOS` tile (`#fff0f6` background, `#ffc2da` border, `#e11d68` price) and right `Android` tile (`#eefbf5` background, `#b8f0d6` border, `#0f5137` price), showing `—` when an OS is unsupported.

### Inputs & Search Bar
- **Style:** Pill or `16px` rounded field (`#ffffff`) with `1.5px solid #ffc2da` border and Deep Cocoa text (`#2d1622`).
- **Focus:** `2px solid #e11d68` focus ring and soft blush border transition.

### Signature Component: `CatMascot` & `CatFloatingWidget`
- **Variants:**
  - `hero`: Strawberry-calico cat wearing pastel pink headphones and holding a handheld game console, animated with a gentle vertical float (`@keyframes mascotFloat`, `4.2s`, disabled under `prefers-reduced-motion: reduce`).
  - `empty`: Curious cat peeking over a pastel cushion with a magnifying glass when a search returns no matching games.
  - `admin`: Studious cat wearing round berry glasses and a bow tie holding a rate clipboard on `/admin/login` and `/admin`.
  - `badge`: Compact cat face emblem used in the top brand header and floating helper trigger.
- **Floating Helper (`CatFloatingWidget`):** Fixed bottom-right (`fixed bottom-5 right-5 z-40`) interactive helper that cycles through friendly Thai rate-checking tips on click and can be collapsed or reopened accessibly.

## Do's and Don'ts

### Do:
- **Do** use `--ink-main` (`#2d1622`) and `--ink-muted` (`#6e485b`) for all typography on pastel backgrounds to preserve ≥ 4.5:1 contrast.
- **Do** render all icons, paw prints (`PawSparkle`), and mascots (`CatMascot`) as crisp authored SVGs.
- **Do** apply `.tabular-nums` (`font-variant-numeric: tabular-nums`) to every THB price figure.
- **Do** respect `@media (prefers-reduced-motion: reduce)` by disabling `mascotFloat` and hover transforms when requested by the OS.

### Don't:
- **Don't** use gradient text (`background-clip: text`) anywhere in headings, badges, or prices.
- **Don't** use hard offset neobrutalist shadows (`box-shadow: 4px 4px 0`) or thick colored `border-left` callout bars (> 1px).
- **Don't** use emoji characters as UI icons or decorative substitutes for SVG artwork.
- **Don't** add checkout buttons, shopping carts, or extra fields beyond the 4-field rate model (`name`, `image`, `platform`, `priceIos`/`priceAndroid`).
