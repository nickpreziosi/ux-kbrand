import {
  PLATFORM_LANGUAGE_COOKIE,
  PLATFORM_LANGUAGE_STORAGE_KEY,
} from "@/lib/platform-preferences/constants";
import { setPlatformPreferenceCookie, readPlatformPreferenceCookie } from "@/lib/platform-preferences/shared-cookies";

/** Platform-wide language set — must match shell / sibling apps for cookie sync. */
export const APP_LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
] as const;

export type AppLanguageCode = (typeof APP_LANGUAGE_OPTIONS)[number]["code"];

const VALID_LANG = new Set<string>(APP_LANGUAGE_OPTIONS.map((l) => l.code));

export function getDirForAppLanguage(language: string): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr";
}

export function resolveAppLocaleFromCookieValue(value: string | undefined): AppLanguageCode {
  if (value && VALID_LANG.has(value)) {
    return value as AppLanguageCode;
  }
  return "en";
}

function readAppLanguageCookie(): AppLanguageCode | null {
  const decoded = readPlatformPreferenceCookie(PLATFORM_LANGUAGE_COOKIE);
  if (!decoded || !VALID_LANG.has(decoded)) return null;
  return decoded as AppLanguageCode;
}

export function getStoredAppLanguage(): AppLanguageCode {
  if (typeof window === "undefined") return "en";

  const fromCookie = readAppLanguageCookie();
  if (fromCookie) {
    try {
      window.localStorage.setItem(PLATFORM_LANGUAGE_STORAGE_KEY, fromCookie);
    } catch {
      // ignore
    }
    return fromCookie;
  }

  const stored = window.localStorage.getItem(PLATFORM_LANGUAGE_STORAGE_KEY);
  if (stored && VALID_LANG.has(stored)) {
    return stored as AppLanguageCode;
  }

  const nav = window.navigator.language?.slice(0, 2).toLowerCase() ?? "";
  return VALID_LANG.has(nav) ? (nav as AppLanguageCode) : "en";
}

export function persistAppLanguage(language: AppLanguageCode): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const nextDir = getDirForAppLanguage(language);

  window.localStorage.setItem(PLATFORM_LANGUAGE_STORAGE_KEY, language);
  setPlatformPreferenceCookie(PLATFORM_LANGUAGE_COOKIE, language);

  try {
    root.lang = language;
    root.setAttribute("dir", nextDir);
  } catch {
    // ignore
  }
}
