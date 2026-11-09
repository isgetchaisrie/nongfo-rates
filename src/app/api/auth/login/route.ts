import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  checkLoginRateLimit,
  clearLoginFailures,
  createAdminToken,
  recordLoginFailure,
  verifyAdminPasswordAsync,
} from "@/lib/auth";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "local";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `ลองผิดเกินจำนวนครั้งที่กำหนด กรุณารอสักครู่ (${rateLimit.retryAfterSec} วินาที)`,
      },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as { password?: unknown };
    const password = typeof body?.password === "string" ? body.password : "";

    if (!(await verifyAdminPasswordAsync(password))) {
      recordLoginFailure(ip);
      return NextResponse.json(
        { error: "รหัสผ่านแอดมินไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    clearLoginFailures(ip);
    const token = createAdminToken();
    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง" },
      { status: 400 }
    );
  }
}
