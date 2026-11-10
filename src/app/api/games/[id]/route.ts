import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteGameAsync, updateGameAsync } from "@/lib/db";
import { validateGameInput } from "@/lib/validation";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบแอดมิน" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const valid = validateGameInput(body);
    if (!valid.success) {
      return NextResponse.json({ error: valid.error }, { status: 400 });
    }

    const game = await updateGameAsync(id, valid.data);
    if (!game) {
      return NextResponse.json({ error: "ไม่พบรายการเกม" }, { status: 404 });
    }

    return NextResponse.json({ game }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/games/[id] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบแอดมิน" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const deleted = await deleteGameAsync(id);
  if (!deleted) {
    return NextResponse.json({ error: "ไม่พบรายการเกม" }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
