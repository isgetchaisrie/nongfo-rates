import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { validateAndSaveUpload } from "@/lib/upload";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบแอดมิน" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const entry = formData.get("file");
    if (!(entry instanceof File)) {
      return NextResponse.json(
        { error: "กรุณาเลือกไฟล์รูปภาพที่ต้องการอัปโหลด" },
        { status: 400 }
      );
    }

    const result = await validateAndSaveUpload(entry);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ url: result.url }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถอัปโหลดรูปภาพได้" },
      { status: 400 }
    );
  }
}
