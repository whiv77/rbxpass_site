import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByUsername, getUserAvatar } from "@/lib/roblox";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? "";

  const schema = z.string().min(1);
  const parsed = schema.safeParse(username);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "username required" }, { status: 400 });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Пользователь не существует" }, { status: 404 });
    }
    const avatar = await getUserAvatar(user.id).catch(() => null);
    return NextResponse.json({ ok: true, user: { ...user, avatar } });
  } catch {
    return NextResponse.json({ ok: false, error: "Roblox API error" }, { status: 502 });
  }
}


