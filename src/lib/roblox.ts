import { setTimeout as delay } from "node:timers/promises";

const USERS_API = "https://users.roblox.com";
const GAMES_API = "https://games.roblox.com";
const THUMBNAILS_API = "https://thumbnails.roblox.com";

export async function findUserByUsername(username: string) {
  const url = `${USERS_API}/v1/users/search?keyword=${encodeURIComponent(username)}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Roblox users API error: ${res.status}`);
  }
  const data = (await res.json()) as { data?: Array<{ id: number; name: string; displayName?: string }> };
  const user = data?.data?.find((u) => u.name.toLowerCase() === username.toLowerCase());
  return user ?? null;
}

export async function getUserGames(userId: string) {
  const url = `${GAMES_API}/v2/users/${encodeURIComponent(userId)}/games?accessFilter=Public`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Roblox games API error: ${res.status}`);
  }
  const data = (await res.json()) as { data?: Array<{ id: number; name: string }> };
  return data?.data ?? [];
}

export async function getGamePasses(gameId: string) {
  const url = `${GAMES_API}/v1/games/${encodeURIComponent(gameId)}/game-passes`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Roblox gamepasses API error: ${res.status}`);
  }
  const data = (await res.json()) as { data?: Array<{ id: number; name: string; price?: number }> };
  return data?.data ?? [];
}

export function buildGamePassUrl(gamePassId: string | number): string {
  return `https://www.roblox.com/game-pass/${gamePassId}`;
}

export async function politeDelay(ms = 200) {
  await delay(ms);
}

export async function getUserAvatar(userId: number): Promise<string | null> {
  const url = `${THUMBNAILS_API}/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  const data = (await res.json()) as { data?: Array<{ imageUrl?: string }> };
  return data?.data?.[0]?.imageUrl ?? null;
}


