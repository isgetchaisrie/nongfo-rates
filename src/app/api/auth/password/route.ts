import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  changeAdminPasswordAsync,
  isAdminAuthenticated,
  verifyAdminToken,
} from "@/lib/auth";

function hasValidCookieHeader(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));
  if (!match) return false;
  const token = match.slice(ADMIN_COOKIE_NAME.length + 1);
  return verifyAdminToken(token);
}

export async function POST(request: Request) {
  const authed =
    (await isAdminAuthenticated()) || hasValidCookieHeader(request);
  if (!authed) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบแอดมินก่อนเปลี่ยนรหัสผ่าน" },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as {
      currentPassword?: unknown;
      newPassword?: unknown;
      confirmPassword?: unknown;
    };

    const currentPassword =
      typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword =
      typeof body?.newPassword === "string" ? body.newPassword : "";
    const confirmPassword =
      typeof body?.confirmPassword === "string"
        ? body.confirmPassword
        : newPassword;

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน" },
        { status: 400 }
      );
    }

    const result = await changeAdminPasswordAsync(currentPassword, newPassword);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "เปลี่ยนรหัสผ่านแอดมินเรียบร้อยแล้ว" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "ข้อมูลเปลี่ยนรหัสผ่านไม่ถูกต้อง" },
      { status: 400 }
    );
  }
}
