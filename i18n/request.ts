import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  resolveAppLocaleFromCookieValue,
  type AppLanguageCode,
} from "@/lib/app-languages";
import { readPlatformLanguageCookieFromStore } from "@/lib/platform-preferences/server-cookies";
import ar from "@/public/locales/ar.json";
import en from "@/public/locales/en.json";
import es from "@/public/locales/es.json";
import pt from "@/public/locales/pt.json";

const MESSAGES: Record<AppLanguageCode, Record<string, unknown>> = {
  ar,
  en,
  es,
  pt,
};

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = resolveAppLocaleFromCookieValue(
    readPlatformLanguageCookieFromStore(store),
  );

  return {
    locale,
    // Client NextIntlClientProvider is not rendered from a Server Component, so
    // this is also passed explicitly on the provider. UTC avoids server/browser
    // timezone mismatches that next-intl reports as ENVIRONMENT_FALLBACK.
    timeZone: "UTC",
    messages: MESSAGES[locale],
  };
});
