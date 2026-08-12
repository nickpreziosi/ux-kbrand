import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  resolveAppLocaleFromCookieValue,
  type AppLanguageCode,
} from "@/lib/app-languages";
import { readPlatformLanguageCookieFromStore } from "@/lib/platform-preferences/server-cookies";

async function loadMessages(locale: AppLanguageCode) {
  switch (locale) {
    case "es":
      return (await import("../public/locales/es.json")).default;
    case "pt":
      return (await import("../public/locales/pt.json")).default;
    case "ar":
      return (await import("../public/locales/ar.json")).default;
    default:
      return (await import("../public/locales/en.json")).default;
  }
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = resolveAppLocaleFromCookieValue(
    readPlatformLanguageCookieFromStore(store),
  );
  const messages = await loadMessages(locale);

  return {
    locale,
    messages: messages as Record<string, unknown>,
  };
});
