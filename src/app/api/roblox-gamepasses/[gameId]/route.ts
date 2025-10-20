import { NextResponse } from "next/server";
import { z } from "zod";
import { getGamePasses } from "@/lib/roblox";

export async function GET(_: Request, context: { params: Promise<{ gameId: string }> }) {
  const paramsSchema = z.object({ gameId: z.string().min(1) });
  const { gameId } = paramsSchema.parse(await (context.params));

  try {
    const passes = await getGamePasses(gameId);
    return NextResponse.json({ ok: true, passes });
  } catch {
    return NextResponse.json({ ok: false, error: "Roblox API error" }, { status: 502 });
  }
}


