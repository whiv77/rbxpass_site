import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const short = (searchParams.get("code") ?? "").toUpperCase();
  if (!short) {
    return NextResponse.json({ ok: false, error: "code required" }, { status: 400 });
  }
  const order = await prisma.order.findFirst({ where: { short_code: short } });
  if (!order) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order: { short_code: order.short_code, status: order.status, created_at: order.created_at } });
}


