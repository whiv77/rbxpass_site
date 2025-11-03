import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export function verifyAdminToken(token: string | null): { ok: boolean; payload?: { role: string } } {
  if (!token) return { ok: false };
  try {
    const payload = jwt.verify(token.replace(/^Bearer\s+/i, ""), JWT_SECRET!) as { role?: string };
    if (typeof payload === "object" && payload && payload.role === "admin") {
      return { ok: true, payload: { role: payload.role } };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

export function getTokenFromHeadersOrCookies(headers: Headers): string | null {
  const auth = headers.get("authorization");
  if (auth) return auth;
  const cookie = headers.get("cookie") || "";
  const match = cookie.split(/;\s*/).find((c) => c.startsWith("admin_token="));
  if (!match) return null;
  const value = match.split("=")[1] || "";
  return value ? `Bearer ${decodeURIComponent(value)}` : null;
}

export function verifyAdminRequest(headers: Headers): boolean {
  const token = getTokenFromHeadersOrCookies(headers);
  return verifyAdminToken(token).ok;
}


