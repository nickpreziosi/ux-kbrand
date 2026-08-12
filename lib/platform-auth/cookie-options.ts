import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { PLATFORM_SESSION_MAX_AGE } from "@/lib/platform-auth/constants";

export function getCookieDomain(): string | undefined {
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
  if (domain) return domain;
  if (process.env.NODE_ENV === "development") return ".klab.localhost";
  return undefined;
}

export function childSessionCookieOptions(maxAge: number): Partial<ResponseCookie> {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    secure,
  };
}

export function setChildSessionCookie(
  res: { cookies: { set: (name: string, value: string, options: Partial<ResponseCookie>) => void } },
  cookieName: string,
): void {
  res.cookies.set(cookieName, "1", childSessionCookieOptions(PLATFORM_SESSION_MAX_AGE));
}

export function clearChildSessionCookie(
  res: { cookies: { set: (name: string, value: string, options: Partial<ResponseCookie>) => void } },
  cookieName: string,
): void {
  res.cookies.set(cookieName, "", childSessionCookieOptions(0));
}

export function clearPlatformPresenceCookie(
  res: { cookies: { set: (name: string, value: string, options: Partial<ResponseCookie>) => void } },
  cookieName: string,
): void {
  const secure = process.env.NODE_ENV === "production";
  const domain = getCookieDomain();
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure,
    ...(domain ? { domain } : {}),
  });
}
