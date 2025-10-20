import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeadersOrCookies, verifyAdminToken } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = getTokenFromHeadersOrCookies(request.headers);
  if (!verifyAdminToken(auth).ok) return new NextResponse("Unauthorized", { status: 401 });

  const orders = await prisma.order.findMany({ orderBy: { created_at: "desc" }, take: 1000 });
  const header = ["id","short_code","code","nickname","user_id","gamepass_id","gamepass_url","status","created_at","updated_at"]; 
  const rows = orders.map((o) => [o.id,o.short_code,o.code,o.nickname,o.user_id,o.gamepass_id,o.gamepass_url,o.status,o.created_at.toISOString(),o.updated_at.toISOString()]);
  const csv = [header, ...rows].map((r) => r.map((v) => typeof v === "string" && v.includes(",") ? `"${v.replace(/"/g,'""')}"` : String(v)).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=orders.csv",
    },
  });
}


