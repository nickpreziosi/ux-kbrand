"use client";

import type { AbstractIntlMessages } from "next-intl";
import { AppProviders as KLabAppProviders, Toaster } from "@k-lab/components";
import { AuthProvider } from "@/ui/user-management/auth/auth-provider";
import { AppIntlProvider } from "@/app/providers/app-intl-provider";
import { ThemePreferenceSync } from "@/ui/shared/providers/theme-preference-sync";
import type { PlatformTheme } from "@/lib/platform-preferences/constants";

/**
 * Root provider stack — same slot pattern as k-lab-components:
 * Theme + DocumentDirection via library AppProviders; auth/intl as slots.
 */
export function AppProviders({
  locale,
  messages,
  initialTheme,
  children,
}: {
  locale: string;
  messages: AbstractIntlMessages;
  initialTheme: PlatformTheme;
  children: React.ReactNode;
}) {
  return (
    <KLabAppProviders
      theme={{
        initialTheme,
        defaultTheme: "system",
        storageKey: "k-lab-components-theme",
      }}
      auth={AuthProvider}
      intl={AppIntlProvider}
      intlProps={{ locale, messages }}
    >
      <ThemePreferenceSync />
      {children}
      <Toaster />
    </KLabAppProviders>
  );
}
