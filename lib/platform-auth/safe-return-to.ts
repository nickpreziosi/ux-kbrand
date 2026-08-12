import {
  PLATFORM_LOGOUT_PENDING_COOKIE,
  PLATFORM_LOGOUT_PENDING_MAX_AGE,
  PLATFORM_PRESENCE_COOKIE,
  PLATFORM_RETURN_TO_COOKIE,
  PLATFORM_TOKEN_COOKIE,
} from "@/lib/platform-auth/constants";
import { getCookieDomain } from "@/lib/platform-auth/cookie-options";
import { getChildOrigin, getShellOrigin } from "@/lib/platform-auth/deployment-profile";

function getAllowedOrigins(): Set<string> {
  return new Set([getShellOrigin(), getChildOrigin()]);
}

/** Avoid open redirects: child-internal paths or allowlisted origins. */
export function safeReturnTo(raw: string | null | undefined, fallback = "/"): string {
  if (!raw?.trim()) return fallback;

  const value = raw.trim();

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  try {
    const url = new URL(value);
    if (getAllowedOrigins().has(url.origin)) {
      return url.toString();
    }
  } catch {
    // not a valid URL
  }

  return fallback;
}

export function shellLoginUrl(): string {
  return new URL("/login", getShellOrigin()).toString();
}

/** Send the user to shell login (the only login entry point). */
export function redirectToShellLogin(): void {
  window.location.replace(shellLoginUrl());
}

/** Clear shared platform cookies and signal shell to end its session (child logout). */
export function clearAllPlatformCookies(): void {
  if (typeof document === "undefined") return;
  const domain = getCookieDomain();
  const domainAttr = domain ? `Domain=${domain}; ` : "";
  for (const name of [PLATFORM_RETURN_TO_COOKIE, PLATFORM_TOKEN_COOKIE, PLATFORM_PRESENCE_COOKIE]) {
    document.cookie = `${name}=; ${domainAttr}Path=/; Max-Age=0; SameSite=Lax`;
  }
  document.cookie = `${PLATFORM_LOGOUT_PENDING_COOKIE}=1; ${domainAttr}Path=/; Max-Age=${PLATFORM_LOGOUT_PENDING_MAX_AGE}; SameSite=Lax`;
}
