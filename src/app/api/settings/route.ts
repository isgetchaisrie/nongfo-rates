import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStoreSettingsAsync, updateStoreSettingsAsync } from "@/lib/db";
import type { StoreSettings } from "@/types/settings";

export async function GET() {
  try {
    const settings = await getStoreSettingsAsync();
    return NextResponse.json({ settings }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถโหลดการตั้งค่าร้านได้" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบแอดมิน" },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as Partial<StoreSettings>;
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "ข้อมูลการตั้งค่าไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const updated = await updateStoreSettingsAsync(body);
    return NextResponse.json({ ok: true, settings: updated }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกการตั้งค่าร้านได้" },
      { status: 500 }
    );
  }
}
