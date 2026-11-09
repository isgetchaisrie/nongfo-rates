import type { GameRateInput, PlatformType } from "@/types/game";

export interface AdminGameFormState {
  name: string;
  image: string;
  platform: PlatformType;
  priceIosInput: string;
  priceAndroidInput: string;
}

function parsePositiveInt(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^[1-9]\d*$/.test(trimmed)) {
    return null;
  }
  const value = Number.parseInt(trimmed, 10);
  if (!Number.isSafeInteger(value) || value <= 0) {
    return null;
  }
  return value;
}

export function buildGamePayload(
  form: AdminGameFormState,
): { ok: true; data: GameRateInput } | { ok: false; error: string } {
  const name = form.name.trim();
  if (!name) {
    return { ok: false, error: "กรุณากรอกชื่อเกม" };
  }
  if (name.length > 120) {
    return { ok: false, error: "ชื่อเกมต้องมีความยาวไม่เกิน 120 ตัวอักษร" };
  }

  const image = form.image.trim();
  if (!image || !image.startsWith("/")) {
    return { ok: false, error: "กรุณาอัปโหลดรูปภาพปกเกมจากเครื่อง" };
  }

  let priceIos: number | null = null;
  let priceAndroid: number | null = null;

  if (form.platform === "both" || form.platform === "ios") {
    priceIos = parsePositiveInt(form.priceIosInput);
    if (priceIos === null) {
      return { ok: false, error: "กรุณากรอกราคา iOS เป็นตัวเลขจำนวนเต็มบวก" };
    }
  }

  if (form.platform === "both" || form.platform === "android") {
    priceAndroid = parsePositiveInt(form.priceAndroidInput);
    if (priceAndroid === null) {
      return { ok: false, error: "กรุณากรอกราคา Android เป็นตัวเลขจำนวนเต็มบวก" };
    }
  }

  return {
    ok: true,
    data: {
      name,
      image,
      platform: form.platform,
      priceIos,
      priceAndroid,
    },
  };
}
