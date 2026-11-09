import crypto from "node:crypto";
import { cookies } from "next/headers";
import {
  clearAdminPasswordHash,
  getAdminPasswordHash,
  getAdminPasswordHashAsync,
  setAdminPasswordHash,
  setAdminPasswordHashAsync,
} from "./db";

export const ADMIN_COOKIE_NAME = "nk_admin_session";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

// shortcut: in-memory rate limit map per process, move to Redis when running multi-instance
const loginFailures = new Map<string, number[]>();

function getSessionSecret(): string {
  return (
    process.env.SESSION_SECRET || "nuggetkub-rates-default-dev-secret-key-2026"
  );
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "nuggetkub-admin-2026";
}

function signPayload(payloadBase64Url: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadBase64Url)
    .digest("base64url");
}

export function verifyAdminPassword(password: string): boolean {
  if (!password) {
    return false;
  }
  const customHashHex = getAdminPasswordHash();
  const expectedDigest =
    customHashHex && /^[a-f0-9]{64}$/i.test(customHashHex)
      ? Buffer.from(customHashHex, "hex")
      : crypto
          .createHash("sha256")
          .update(getAdminPassword(), "utf8")
          .digest();
  const candidateDigest = crypto
    .createHash("sha256")
    .update(password, "utf8")
    .digest();
  return crypto.timingSafeEqual(expectedDigest, candidateDigest);
}

export function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): { ok: true } | { ok: false; error: string } {
  if (!verifyAdminPassword(currentPassword)) {
    return { ok: false, error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
  }
  const trimmed = newPassword.trim();
  if (trimmed.length < 6) {
    return { ok: false, error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" };
  }
  if (trimmed.length > 128) {
    return { ok: false, error: "รหัสผ่านใหม่ยาวเกินไป (สูงสุด 128 ตัวอักษร)" };
  }
  const hashHex = crypto
    .createHash("sha256")
    .update(trimmed, "utf8")
    .digest("hex");
  setAdminPasswordHash(hashHex);
  return { ok: true };
}

export async function verifyAdminPasswordAsync(
  password: string
): Promise<boolean> {
  if (!password) {
    return false;
  }
  const customHashHex = await getAdminPasswordHashAsync();
  const expectedDigest =
    customHashHex && /^[a-f0-9]{64}$/i.test(customHashHex)
      ? Buffer.from(customHashHex, "hex")
      : crypto
          .createHash("sha256")
          .update(getAdminPassword(), "utf8")
          .digest();
  const candidateDigest = crypto
    .createHash("sha256")
    .update(password, "utf8")
    .digest();
  return crypto.timingSafeEqual(expectedDigest, candidateDigest);
}

export async function changeAdminPasswordAsync(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await verifyAdminPasswordAsync(currentPassword))) {
    return { ok: false, error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
  }
  const trimmed = newPassword.trim();
  if (trimmed.length < 6) {
    return { ok: false, error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" };
  }
  if (trimmed.length > 128) {
    return { ok: false, error: "รหัสผ่านใหม่ยาวเกินไป (สูงสุด 128 ตัวอักษร)" };
  }
  const hashHex = crypto
    .createHash("sha256")
    .update(trimmed, "utf8")
    .digest("hex");
  await setAdminPasswordHashAsync(hashHex);
  return { ok: true };
}

export function createAdminToken(nowMs: number = Date.now()): string {
  const payload = JSON.stringify({
    role: "admin",
    iat: nowMs,
    exp: nowMs + SESSION_DURATION_MS,
  });
  const payloadBase64Url = Buffer.from(payload, "utf8").toString("base64url");
  const signatureBase64Url = signPayload(payloadBase64Url);
  return `${payloadBase64Url}.${signatureBase64Url}`;
}

export function verifyAdminToken(
  token: string | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }
  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }
  const [payloadBase64Url, signatureBase64Url] = parts;
  if (!payloadBase64Url || !signatureBase64Url) {
    return false;
  }

  const expectedSignature = signPayload(payloadBase64Url);
  const sigBuf = Buffer.from(signatureBase64Url, "utf8");
  const expBuf = Buffer.from(expectedSignature, "utf8");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payloadBase64Url, "base64url").toString("utf8")
    ) as { role?: string; exp?: number };
    if (decoded.role !== "admin" || typeof decoded.exp !== "number") {
      return false;
    }
    return decoded.exp > nowMs;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifyAdminToken(token);
  } catch {
    return false;
  }
}

export function checkLoginRateLimit(
  ip: string,
  nowMs: number = Date.now()
): { allowed: boolean; retryAfterSec?: number } {
  const timestamps = (loginFailures.get(ip) ?? []).filter(
    (t) => nowMs - t < RATE_LIMIT_WINDOW_MS
  );
  loginFailures.set(ip, timestamps);

  if (timestamps.length >= MAX_LOGIN_ATTEMPTS) {
    const oldest = timestamps[0] ?? nowMs;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - nowMs) / 1000)
    );
    return { allowed: false, retryAfterSec };
  }

  return { allowed: true };
}

export function recordLoginFailure(ip: string, nowMs: number = Date.now()): void {
  const timestamps = (loginFailures.get(ip) ?? []).filter(
    (t) => nowMs - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(nowMs);
  loginFailures.set(ip, timestamps);
}

export function clearLoginFailures(ip: string): void {
  loginFailures.delete(ip);
}

export function resetLoginRateLimitsForTests(): void {
  loginFailures.clear();
  clearAdminPasswordHash();
}
