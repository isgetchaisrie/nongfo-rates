import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIMES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function verifyMagicBytes(mime: string, buf: Buffer): boolean {
  if (mime === "image/png") {
    return (
      buf.length >= 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a
    );
  }

  if (mime === "image/jpeg") {
    return (
      buf.length >= 3 &&
      buf[0] === 0xff &&
      buf[1] === 0xd8 &&
      buf[2] === 0xff
    );
  }

  if (mime === "image/gif") {
    if (buf.length < 6) return false;
    const header = buf.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }

  if (mime === "image/webp") {
    if (buf.length < 12) return false;
    const riff = buf.subarray(0, 4).toString("ascii");
    const webp = buf.subarray(8, 12).toString("ascii");
    return riff === "RIFF" && webp === "WEBP";
  }

  if (mime === "image/svg+xml") {
    const text = buf.toString("utf8").trim();
    const lower = text.toLowerCase();
    if (!lower.includes("<svg")) {
      return false;
    }
    if (
      lower.includes("<script") ||
      lower.includes("javascript:") ||
      /on[a-z]+\s*=/i.test(lower)
    ) {
      return false;
    }
    return true;
  }

  return false;
}

export async function validateAndSaveUpload(
  file: File,
  uploadDir: string = path.join(process.cwd(), "public", "uploads", "games")
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const ext = ALLOWED_MIMES[file.type];
  if (!ext) {
    return {
      ok: false,
      error: "รองรับเฉพาะไฟล์รูปภาพ PNG, JPG, WEBP, GIF และ SVG เท่านั้น",
    };
  }

  if (file.size <= 0 || file.size > MAX_UPLOAD_SIZE_BYTES) {
    return {
      ok: false,
      error: "ขนาดไฟล์รูปภาพต้องไม่เกิน 5 MB",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!verifyMagicBytes(file.type, buffer)) {
    return {
      ok: false,
      error: "เนื้อหาไฟล์รูปภาพไม่ถูกต้องหรือไม่ปลอดภัย",
    };
  }

  fs.mkdirSync(uploadDir, { recursive: true });
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const fullPath = path.join(uploadDir, fileName);
  fs.writeFileSync(fullPath, buffer);

  return {
    ok: true,
    url: `/uploads/games/${fileName}`,
  };
}
