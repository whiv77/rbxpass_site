import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple rate limiting using IP + path key with in-memory Map (dev-only)
const windows = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 10_000;
const LIMIT = 30;

export function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const key = `${ip}:${new URL(req.url).pathname}`;
  const now = Date.now();
  const entry = windows.get(key);
  if (!entry || now - entry.ts > WINDOW_MS) {
    windows.set(key, { count: 1, ts: now });
  } else {
    entry.count += 1;
    if (entry.count > LIMIT) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};


