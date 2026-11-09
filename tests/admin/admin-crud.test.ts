import { describe, expect, it } from "vitest";
import { buildGamePayload } from "@/components/admin/adminValidation";

describe("buildGamePayload (Admin Game Form Validation)", () => {
  it("builds valid payload for 'both' platform with positive integer prices and default game category", () => {
    const res = buildGamePayload({
      name: "  Stardew Valley  ",
      image: "/uploads/games/stardew.png",
      platform: "both",
      priceIosInput: "55",
      priceAndroidInput: "30",
    });

    expect(res).toEqual({
      ok: true,
      data: {
        name: "Stardew Valley",
        image: "/uploads/games/stardew.png",
        category: "game",
        platform: "both",
        priceIos: 55,
        priceAndroid: 30,
      },
    });
  });

  it("normalizes priceAndroid to null when platform is 'ios' and preserves category 'app'", () => {
    const res = buildGamePayload({
      name: "Procreate Dreams",
      image: "/uploads/games/procreate.webp",
      category: "app",
      platform: "ios",
      priceIosInput: "120",
      priceAndroidInput: "999",
    });

    expect(res).toEqual({
      ok: true,
      data: {
        name: "Procreate Dreams",
        image: "/uploads/games/procreate.webp",
        category: "app",
        platform: "ios",
        priceIos: 120,
        priceAndroid: null,
      },
    });
  });

  it("normalizes priceIos to null when platform is 'android'", () => {
    const res = buildGamePayload({
      name: "Dave the Diver Mobile",
      image: "/uploads/games/dave.png",
      category: "game",
      platform: "android",
      priceIosInput: "50",
      priceAndroidInput: "45",
    });

    expect(res).toEqual({
      ok: true,
      data: {
        name: "Dave the Diver Mobile",
        image: "/uploads/games/dave.png",
        category: "game",
        platform: "android",
        priceIos: null,
        priceAndroid: 45,
      },
    });
  });

  it("rejects empty or whitespace-only game name", () => {
    const res = buildGamePayload({
      name: "   ",
      image: "/uploads/games/test.png",
      platform: "both",
      priceIosInput: "50",
      priceAndroidInput: "30",
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toContain("ชื่อเกม");
    }
  });

  it("rejects missing or non-uploaded image path", () => {
    const emptyRes = buildGamePayload({
      name: "Terraria",
      image: "",
      platform: "both",
      priceIosInput: "55",
      priceAndroidInput: "30",
    });
    expect(emptyRes.ok).toBe(false);

    const externalUrlRes = buildGamePayload({
      name: "Terraria",
      image: "https://example.com/terraria.png",
      platform: "both",
      priceIosInput: "55",
      priceAndroidInput: "30",
    });
    expect(externalUrlRes.ok).toBe(false);
  });

  it("rejects missing, zero, negative, or non-integer required prices", () => {
    const missingIos = buildGamePayload({
      name: "Goodnotes 6",
      image: "/uploads/games/goodnotes.png",
      platform: "ios",
      priceIosInput: "",
      priceAndroidInput: "",
    });
    expect(missingIos.ok).toBe(false);

    const zeroAndroid = buildGamePayload({
      name: "Dave the Diver",
      image: "/uploads/games/dave.png",
      platform: "android",
      priceIosInput: "",
      priceAndroidInput: "0",
    });
    expect(zeroAndroid.ok).toBe(false);

    const decimalBoth = buildGamePayload({
      name: "Minecraft",
      image: "/uploads/games/mc.png",
      platform: "both",
      priceIosInput: "25.5",
      priceAndroidInput: "20",
    });
    expect(decimalBoth.ok).toBe(false);
  });
});
