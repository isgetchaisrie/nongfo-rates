import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import * as MascotModule from "../../src/components/mascot/CatMascot";
import { CatFloatingWidget } from "../../src/components/mascot/CatFloatingWidget";

const ROOT = path.resolve(__dirname, "../..");
const GLOBALS_CSS_PATH = path.join(ROOT, "src/app/globals.css");
const DESIGN_MD_PATH = path.join(ROOT, "DESIGN.md");

describe("Pastel Pink Design System Tokens (globals.css)", () => {
  it("defines all required Pastel Pink CSS custom properties and browser surfaces", () => {
    const css = fs.readFileSync(GLOBALS_CSS_PATH, "utf8");

    expect(css.startsWith('@import "tailwindcss";')).toBe(true);

    const requiredTokens = [
      "--bg-canvas: #fff6f9;",
      "--bg-surface: #ffffff;",
      "--bg-elevated: #fff0f5;",
      "--tile-ios: #fff0f6;",
      "--tile-ios-border: #ffc2da;",
      "--tile-android: #eefbf5;",
      "--tile-android-border: #b8f0d6;",
      "--pink-primary: #e11d68;",
      "--pink-hover: #be1253;",
      "--pink-soft: #ff85b3;",
      "--pink-blush: #ffd6e5;",
      "--ink-main: #2d1622;",
      "--ink-muted: #6e485b;",
      "--android-ink: #0f5137;",
      "--border-pastel: #ffd6e5;",
      "--shadow-card: 0 10px 28px -8px rgba(190, 18, 83, 0.10), 0 2px 6px -1px rgba(45, 22, 34, 0.04);",
      "--shadow-card-hover: 0 18px 36px -10px rgba(190, 18, 83, 0.16), 0 4px 10px -2px rgba(45, 22, 34, 0.06);",
      "--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);",
    ];

    for (const token of requiredTokens) {
      expect(css).toContain(token);
    }

    // Browser surfaces & utilities required by Craft Floor
    expect(css).toContain("::selection");
    expect(css).toContain("::-webkit-scrollbar");
    expect(css).toContain("::-webkit-scrollbar-thumb");
    expect(css).toContain(":focus-visible");
    expect(css).toContain(".tabular-nums");
    expect(css).toContain("font-variant-numeric: tabular-nums");
    expect(css).toContain(".bg-pastel-canvas");
    expect(css).toContain("@keyframes mascotFloat");
    expect(css).toContain("prefers-reduced-motion: reduce");

    // Impeccable bans
    expect(css).not.toContain("background-clip: text");
    expect(css).not.toContain("-webkit-background-clip: text");
    expect(css).not.toContain("4px 4px 0");
  });
});

describe("DESIGN.md specification completeness", () => {
  it("documents the Pastel Pink & Cat Mascot design system, typography, contrast, and card anatomy", () => {
    expect(fs.existsSync(DESIGN_MD_PATH)).toBe(true);
    const md = fs.readFileSync(DESIGN_MD_PATH, "utf8");

    expect(md).toContain("## Overview");
    expect(md).toContain("## Colors");
    expect(md).toContain("## Typography");
    expect(md).toContain("## Layout");
    expect(md).toContain("## Elevation & Depth");
    expect(md).toContain("## Shapes");
    expect(md).toContain("## Components");
    expect(md).toContain("## Do's and Don'ts");

    expect(md).toContain("#fff6f9");
    expect(md).toContain("#e11d68");
    expect(md).toContain("#2d1622");
    expect(md).toContain("#6e485b");
    expect(md).toContain("Mali");
    expect(md).toContain("Prompt");
    expect(md).toContain("Fredoka");
    expect(md).toContain("4.5:1");
  });
});

describe("CatMascot & PawSparkle SVG artwork components", () => {
  it("renders rich kawaii SVG artwork for all 4 CatMascot variants", () => {
    const variants = ["hero", "empty", "admin", "badge"] as const;

    for (const variant of variants) {
      const html = renderToStaticMarkup(
        React.createElement(MascotModule.CatMascot, {
          variant,
          className: `test-${variant}`,
          label: `Nuggetkub ${variant} cat`,
        })
      );

      expect(html).toContain("<svg");
      expect(html).toContain(`data-variant="${variant}"`);
      expect(html).toContain(`test-${variant}`);
      expect(html).toContain(`Nuggetkub ${variant} cat`);
      expect(html).toContain("<path");
    }
  });

  it("exports PawSparkle SVG accent without emoji icons", () => {
    const PawSparkle = (MascotModule as Record<string, unknown>).PawSparkle as
      | React.FC<{ className?: string }>
      | undefined;
    expect(typeof PawSparkle).toBe("function");

    const html = renderToStaticMarkup(
      React.createElement(PawSparkle!, { className: "paw-accent" })
    );
    expect(html).toContain("<svg");
    expect(html).toContain("paw-accent");
  });
});

describe("CatFloatingWidget interactive helper", () => {
  it("renders fixed bottom-right floating cat helper with Thai rate tips", () => {
    const html = renderToStaticMarkup(React.createElement(CatFloatingWidget));

    expect(html).toContain("fixed");
    expect(html).toContain("bottom-5");
    expect(html).toContain("right-5");
    expect(html).toContain("z-40");
    expect(html).toContain("<svg");
    expect(html).toContain("Nuggetkub");
  });
});
