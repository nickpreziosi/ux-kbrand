"use client";

import { PLATFORM_TOKEN_COOKIE } from "@/lib/platform-auth/constants";

export type PlatformIdTokenClaims = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

function getSharedCookieDomain(): string {
  const fromEnv = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") return ".klab.localhost";
  return ".k-lab.ai";
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function claimsFromIdToken(token: string): PlatformIdTokenClaims | null {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.sub !== "string") return null;
  return {
    uid: payload.sub,
    email: typeof payload.email === "string" ? payload.email : null,
    displayName: typeof payload.name === "string" ? payload.name : null,
  };
}

export function isIdTokenExpired(token: string, skewSeconds = 60): boolean {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  if (typeof exp !== "number") return true;
  return Date.now() / 1000 >= exp - skewSeconds;
}

/** Read shell-shared Firebase ID token (Domain=localhost / .k-lab.ai). */
export function readPlatformTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const pattern = new RegExp(`(?:^|; )${PLATFORM_TOKEN_COOKIE}=([^;]*)`);
  const match = document.cookie.match(pattern);
  if (!match?.[1]) return null;
  const token = decodeURIComponent(match[1]);
  if (!token || isIdTokenExpired(token)) return null;
  return token;
}

export function clearPlatformTokenCookie(): void {
  if (typeof document === "undefined") return;
  const domain = getSharedCookieDomain();
  document.cookie = `${PLATFORM_TOKEN_COOKIE}=; Domain=${domain}; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getPlatformIdToken(): string | null {
  return readPlatformTokenFromCookie();
}
