import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  resolveAppLocaleFromCookieValue,
  type AppLanguageCode,
} from "@/lib/app-languages";
import { readPlatformLanguageCookieFromStore } from "@/lib/platform-preferences/server-cookies";

function localeFileName(locale: AppLanguageCode): string {
  switch (locale) {
    case "es":
    case "pt":
    case "ar":
      return `${locale}.json`;
    default:
      return "en.json";
  }
}

/** Read from disk so Turbopack's JSON `import()` cache cannot hide newly added keys. */
async function loadMessages(locale: AppLanguageCode) {
  const file = path.join(process.cwd(), "public/locales", localeFileName(locale));
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = resolveAppLocaleFromCookieValue(
    readPlatformLanguageCookieFromStore(store),
  );
  const messages = await loadMessages(locale);

  return {
    locale,
    // Client NextIntlClientProvider is not rendered from a Server Component, so
    // this is also passed explicitly on the provider. UTC avoids server/browser
    // timezone mismatches that next-intl reports as ENVIRONMENT_FALLBACK.
    timeZone: "UTC",
    messages: messages as Record<string, unknown>,
  };
});
