"use client";

import * as React from "react";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { getDirForLanguage } from "@k-lab/components";
import {
  PLATFORM_LANGUAGE_COOKIE,
  PLATFORM_LANGUAGE_STORAGE_KEY,
} from "@/lib/platform-preferences/constants";
import { setPlatformPreferenceCookie } from "@/lib/platform-preferences/shared-cookies";
import type { AppLanguageCode } from "@/lib/app-languages";

type AppIntlContextValue = {
  locale: string;
  changeLocale: (code: string) => Promise<void>;
};

const AppIntlContext = React.createContext<AppIntlContextValue | null>(null);

/** Must match `i18n/request.ts`. Inherited only if NextIntlClientProvider is a Server Component. */
const INTL_TIME_ZONE = "UTC";

type LocaleOverride = {
  locale: string;
  messages: AbstractIntlMessages;
};

async function loadLocaleMessages(code: string): Promise<AbstractIntlMessages> {
  switch (code as AppLanguageCode) {
    case "es":
      return (await import("@/public/locales/es.json")).default as AbstractIntlMessages;
    case "pt":
      return (await import("@/public/locales/pt.json")).default as AbstractIntlMessages;
    case "ar":
      return (await import("@/public/locales/ar.json")).default as AbstractIntlMessages;
    default:
      return (await import("@/public/locales/en.json")).default as AbstractIntlMessages;
  }
}

function syncDocumentLocale(locale: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = getDirForLanguage(locale);
}

/**
 * Client wrapper for {@link NextIntlClientProvider} so it can be passed as
 * `AppProviders`'s `intl` slot — same pattern as k-lab-components.
 */
export function AppIntlProvider({
  children,
  locale: serverLocale,
  messages: serverMessages,
}: {
  children: React.ReactNode;
  locale?: string;
  messages?: AbstractIntlMessages;
}) {
  const [override, setOverride] = React.useState<LocaleOverride | null>(null);

  // Prefer live server props so Fast Refresh / RSC updates are not stuck in
  // useState from the first paint (that snapshot was missing newly added keys).
  const locale = override?.locale ?? serverLocale ?? "en";
  const messages = override?.messages ?? serverMessages ?? {};

  React.useEffect(() => {
    if (override && serverLocale && override.locale === serverLocale) {
      setOverride(null);
    }
  }, [override, serverLocale]);

  const changeLocale = React.useCallback(async (code: string) => {
    setPlatformPreferenceCookie(PLATFORM_LANGUAGE_COOKIE, code);
    try {
      window.localStorage.setItem(PLATFORM_LANGUAGE_STORAGE_KEY, code);
    } catch {
      // ignore
    }
    const nextMessages = await loadLocaleMessages(code);
    setOverride({ locale: code, messages: nextMessages });
    syncDocumentLocale(code);
  }, []);

  const value = React.useMemo(
    (): AppIntlContextValue => ({ locale, changeLocale }),
    [locale, changeLocale],
  );

  return (
    <AppIntlContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={INTL_TIME_ZONE}>
        {children}
      </NextIntlClientProvider>
    </AppIntlContext.Provider>
  );
}

/** Change app locale + messages in place (writes `klab-language` cookie). */
export function useAppLocaleChange(): AppIntlContextValue {
  const ctx = React.useContext(AppIntlContext);
  if (!ctx) {
    throw new Error("useAppLocaleChange must be used within AppIntlProvider");
  }
  return ctx;
}
