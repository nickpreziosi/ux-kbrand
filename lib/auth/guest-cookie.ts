import { PLATFORM_SESSION_MAX_AGE } from "@/lib/platform-auth/constants";

/** Landing-prompt cookie: visitor chose Guest. Not a security boundary. */
export const GUEST_COOKIE_NAME = "KBrandGuest";
export const GUEST_COOKIE_VALUE = "1";
export const GUEST_COOKIE_MAX_AGE = PLATFORM_SESSION_MAX_AGE;

export function hasGuestCookie(cookieHeader: string | undefined | null): boolean {
  if (!cookieHeader) return false;
  const prefix = `${GUEST_COOKIE_NAME}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix) && trimmed.slice(prefix.length) === GUEST_COOKIE_VALUE) {
      return true;
    }
  }
  return false;
}

export function setGuestCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${GUEST_COOKIE_NAME}=${GUEST_COOKIE_VALUE}; Path=/; Max-Age=${GUEST_COOKIE_MAX_AGE}; SameSite=Lax`;
}
