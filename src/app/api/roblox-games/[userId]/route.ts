import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserGames } from "@/lib/roblox";

export async function GET(_: Request, context: { params: Promise<{ userId: string }> }) {
  const paramsSchema = z.object({ userId: z.string().min(1) });
  const { userId } = paramsSchema.parse(await context.params);

  try {
    const games = await getUserGames(userId);
    return NextResponse.json({ ok: true, games });
  } catch {
    return NextResponse.json({ ok: false, error: "Roblox API error" }, { status: 502 });
  }
}


