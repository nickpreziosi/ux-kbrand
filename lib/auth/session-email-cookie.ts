import type { NextRequest } from "next/server";
import { childSessionCookieOptions } from "@/lib/platform-auth/cookie-options";
import { PRESENCE_COOKIE_MAX_AGE } from "@/lib/auth/presence-cookie";

/**
 * httpOnly companion to the presence cookie: identifies the signed-in user so
 * the mock HTTP backend can resolve their portal role server-side. Prototype
 * trust model — in isolated mode the login flow posts the email after a real
 * Firebase sign-in; production replaces this with verified custom claims.
 */
export const SESSION_EMAIL_COOKIE = "KBrandSessionEmail";

type CookieResponse = {
  cookies: {
    set: (
      name: string,
      value: string,
      options: ReturnType<typeof childSessionCookieOptions>,
    ) => void;
  };
};

export function setSessionEmailCookie(res: CookieResponse, email: string): void {
  res.cookies.set(
    SESSION_EMAIL_COOKIE,
    encodeURIComponent(email),
    childSessionCookieOptions(PRESENCE_COOKIE_MAX_AGE),
  );
}

export function clearSessionEmailCookie(res: CookieResponse): void {
  res.cookies.set(SESSION_EMAIL_COOKIE, "", childSessionCookieOptions(0));
}

export function readSessionEmail(request: NextRequest): string | null {
  const raw = request.cookies.get(SESSION_EMAIL_COOKIE)?.value;
  if (!raw) return null;
  try {
    const email = decodeURIComponent(raw).trim();
    return email || null;
  } catch {
    return null;
  }
}
