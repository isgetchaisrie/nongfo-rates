import { z } from "zod";
import type { GameRateInput, PlatformType } from "@/types/game";

const priceSchema = z
  .number({ message: "ราคาต้องเป็นตัวเลขจำนวนเต็มบวก" })
  .int("ราคาต้องเป็นจำนวนเต็ม")
  .min(1, "ราคาต้องมากกว่า 0 บาท")
  .max(100000, "ราคาต้องไม่เกิน 100,000 บาท");

const rawInputSchema = z.object({
  name: z
    .string({ message: "กรุณาระบุชื่อเกมหรือแอป" })
    .trim()
    .min(1, "กรุณาระบุชื่อเกมหรือแอป")
    .max(120, "ชื่อเกมต้องไม่เกิน 120 ตัวอักษร"),
  image: z
    .string({ message: "กรุณาอัปโหลดรูปภาพหน้าปก" })
    .trim()
    .min(1, "กรุณาอัปโหลดรูปภาพหน้าปก")
    .refine((val) => val.startsWith("/") && !val.startsWith("//"), {
      message: "พาธรูปภาพไม่ถูกต้อง กรุณาอัปโหลดรูปภาพจากเครื่อง",
    }),
  platform: z.enum(["both", "ios", "android"], {
    message: "กรุณาเลือกระบบปฏิบัติการ (ทั้งคู่, iOS หรือ Android)",
  }),
  priceIos: z.union([z.number(), z.null(), z.undefined()]).optional(),
  priceAndroid: z.union([z.number(), z.null(), z.undefined()]).optional(),
});

export function validateGameInput(
  input: unknown
): { success: true; data: GameRateInput } | { success: false; error: string } {
  const parsed = rawInputSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? "ข้อมูลไม่ถูกต้อง",
    };
  }

  const { name, image, platform, priceIos, priceAndroid } = parsed.data;
  const typedPlatform: PlatformType = platform;

  let finalIos: number | null = null;
  let finalAndroid: number | null = null;

  if (typedPlatform === "both" || typedPlatform === "ios") {
    const iosCheck = priceSchema.safeParse(priceIos);
    if (!iosCheck.success) {
      return {
        success: false,
        error: "กรุณาระบุราคา iOS ที่ถูกต้อง (1 - 100,000 บาท)",
      };
    }
    finalIos = iosCheck.data;
  }

  if (typedPlatform === "both" || typedPlatform === "android") {
    const androidCheck = priceSchema.safeParse(priceAndroid);
    if (!androidCheck.success) {
      return {
        success: false,
        error: "กรุณาระบุราคา Android ที่ถูกต้อง (1 - 100,000 บาท)",
      };
    }
    finalAndroid = androidCheck.data;
  }

  return {
    success: true,
    data: {
      name,
      image,
      platform: typedPlatform,
      priceIos: finalIos,
      priceAndroid: finalAndroid,
    },
  };
}
