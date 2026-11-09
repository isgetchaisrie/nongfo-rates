import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createGame, listGames } from "@/lib/db";
import { validateGameInput } from "@/lib/validation";
import type { PlatformType } from "@/types/game";

export async function GET(request: Request) {
  let query: string | undefined;
  let platform: "all" | PlatformType | undefined;

  if (request) {
    const url = new URL(request.url);
    query = url.searchParams.get("q") ?? undefined;
    const rawPlatform = url.searchParams.get("platform");
    if (
      rawPlatform === "all" ||
      rawPlatform === "ios" ||
      rawPlatform === "android" ||
      rawPlatform === "both"
    ) {
      platform = rawPlatform;
    }
  }

  const games = listGames({ query, platform });
  return NextResponse.json({ games });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบแอดมิน" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const valid = validateGameInput(body);
    if (!valid.success) {
      return NextResponse.json({ error: valid.error }, { status: 400 });
    }

    const game = createGame(valid.data);
    return NextResponse.json({ game }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "รูปแบบข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    );
  }
}
