import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ADMIN_COOKIE_NAME,
  checkLoginRateLimit,
  clearLoginFailures,
  createAdminToken,
  recordLoginFailure,
  resetLoginRateLimitsForTests,
  verifyAdminPassword,
  verifyAdminToken,
} from "@/lib/auth";
import { POST as loginRoute } from "@/app/api/auth/login/route";
import { POST as logoutRoute } from "@/app/api/auth/logout/route";
import { validateAndSaveUpload } from "@/lib/upload";

describe("Admin auth and rate limiting", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "test-secret-password";
    process.env.SESSION_SECRET = "test-hmac-secret-key-2026";
    resetLoginRateLimitsForTests();
  });

  it("verifies admin password using constant-time comparison", () => {
    expect(verifyAdminPassword("test-secret-password")).toBe(true);
    expect(verifyAdminPassword("wrong-password")).toBe(false);
    expect(verifyAdminPassword("")).toBe(false);
  });

  it("creates and verifies signed admin session tokens with 7-day expiry", () => {
    const now = 1_700_000_000_000;
    const token = createAdminToken(now);
    expect(verifyAdminToken(token, now + 1000)).toBe(true);

    // Expired after 7 days + 1 second
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    expect(verifyAdminToken(token, now + sevenDaysMs + 1000)).toBe(false);

    // Tampered token fails
    expect(verifyAdminToken(`${token}tamper`, now)).toBe(false);
    expect(verifyAdminToken(undefined, now)).toBe(false);
  });

  it("enforces login rate limit of 5 failures per 10 minutes per IP", () => {
    const ip = "203.0.113.10";
    for (let i = 0; i < 5; i++) {
      expect(checkLoginRateLimit(ip).allowed).toBe(true);
      recordLoginFailure(ip);
    }

    const blocked = checkLoginRateLimit(ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);

    clearLoginFailures(ip);
    expect(checkLoginRateLimit(ip).allowed).toBe(true);
  });

  it("handles POST /api/auth/login and POST /api/auth/logout cookies", async () => {
    const badRes = await loginRoute(
      new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "198.51.100.7",
        },
        body: JSON.stringify({ password: "wrong" }),
      })
    );
    expect(badRes.status).toBe(401);

    const okRes = await loginRoute(
      new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "198.51.100.7",
        },
        body: JSON.stringify({ password: "test-secret-password" }),
      })
    );
    expect(okRes.status).toBe(200);
    const setCookie = okRes.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(`${ADMIN_COOKIE_NAME}=`);
    expect(setCookie).toContain("HttpOnly");

    const logoutRes = await logoutRoute();
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.headers.get("set-cookie") ?? "").toContain(
      `${ADMIN_COOKIE_NAME}=`
    );
  });
});

describe("Image upload validation and saving", () => {
  let tmpUploadDir: string;

  beforeEach(() => {
    tmpUploadDir = fs.mkdtempSync(path.join(os.tmpdir(), "nk-upload-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpUploadDir, { recursive: true, force: true });
  });

  it("saves valid PNG and SVG files after verifying magic bytes", async () => {
    // Valid 1x1 PNG magic header
    const pngBytes = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    const pngFile = new File([pngBytes], "cover.png", { type: "image/png" });
    const pngResult = await validateAndSaveUpload(pngFile, tmpUploadDir);
    expect(pngResult.ok).toBe(true);
    if (pngResult.ok) {
      expect(pngResult.url).toMatch(/^\/uploads\/games\/[a-f0-9-]+\.png$/);
      const savedFileName = path.basename(pngResult.url);
      expect(fs.existsSync(path.join(tmpUploadDir, savedFileName))).toBe(true);
    }

    // Valid safe SVG
    const svgFile = new File(
      ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>'],
      "icon.svg",
      { type: "image/svg+xml" }
    );
    const svgResult = await validateAndSaveUpload(svgFile, tmpUploadDir);
    expect(svgResult.ok).toBe(true);
  });

  it("rejects spoofed magic bytes, unsafe SVG scripts, and oversized files", async () => {
    const spoofedPng = new File(["not a real png file"], "fake.png", {
      type: "image/png",
    });
    const spoofRes = await validateAndSaveUpload(spoofedPng, tmpUploadDir);
    expect(spoofRes.ok).toBe(false);

    const xssSvg = new File(
      ['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'],
      "evil.svg",
      { type: "image/svg+xml" }
    );
    const xssRes = await validateAndSaveUpload(xssSvg, tmpUploadDir);
    expect(xssRes.ok).toBe(false);

    const oversized = new Uint8Array(5 * 1024 * 1024 + 10);
    oversized.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    const bigFile = new File([oversized], "huge.png", { type: "image/png" });
    const bigRes = await validateAndSaveUpload(bigFile, tmpUploadDir);
    expect(bigRes.ok).toBe(false);
  });
});
