import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { KBrandLayoutClient } from "./kbrand-layout-client";
import { AppProviders } from "./providers";
import { getDirForAppLanguage } from "@/lib/app-languages";
import { createDocInitScript } from "@k-lab/components/server";
import { PLATFORM_SIDEBAR_COLLAPSED_COOKIE } from "@/lib/platform-preferences/constants";
import { readPlatformThemeCookieFromStore } from "@/lib/platform-preferences/server-cookies";
import { resolvePlatformSidebarCollapsedFromCookie } from "@/lib/platform-preferences/shared-cookies";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("shell.metadata");
  return {
    title: t("title"),
    description: t("description"),
    // Follows the browser/OS color scheme, not the in-app theme.
    icons: {
      icon: [
        {
          url: "/ico/favicon-grey.ico",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/ico/favicon-white.ico",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
  };
}

const documentInit = createDocInitScript({
  applyLocale: false,
  authPathPrefixes: ["/login"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dir = getDirForAppLanguage(locale);
  const messages = await getMessages();
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get(PLATFORM_SIDEBAR_COLLAPSED_COOKIE);
  const initialSidebarCollapsed = resolvePlatformSidebarCollapsedFromCookie(
    sidebarCookie?.value,
  );
  const initialTheme = readPlatformThemeCookieFromStore(cookieStore);

  return (
    <html lang={locale} dir={dir} className={sora.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: documentInit }} />
      </head>
      <body>
        <AppProviders locale={locale} messages={messages} initialTheme={initialTheme}>
          <KBrandLayoutClient initialSidebarCollapsed={initialSidebarCollapsed}>
            {children}
          </KBrandLayoutClient>
        </AppProviders>
      </body>
    </html>
  );
}
