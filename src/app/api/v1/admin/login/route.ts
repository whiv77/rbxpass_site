import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({} as Record<string, unknown>));
  const password = json?.password as string | undefined;
  if (!password) return new NextResponse("Bad Request", { status: 400 });
  if (password !== ADMIN_PASSWORD) return new NextResponse("Unauthorized", { status: 401 });

  const token = jwt.sign({ role: "admin" }, JWT_SECRET!, { expiresIn: "7d" });
  const res = NextResponse.json({ ok: true, token });
  res.headers.set("Set-Cookie", `admin_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`);
  return res;
}


