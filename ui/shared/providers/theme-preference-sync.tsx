"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@k-lab/components";
import { isPublicPath } from "@/lib/auth/public-routes";
import {
  applyPlatformThemeToDocument,
  resolvePlatformTheme,
} from "@/lib/platform-preferences/apply-theme";
import {
  isValidPlatformTheme,
  persistPlatformTheme,
} from "@/lib/platform-preferences/shared-cookies";

/** Writes user theme changes to the shared platform cookie + localStorage cache. */
export function ThemePreferenceSync() {
  const { theme, mounted } = useTheme();
  const pathname = usePathname();
  const skipInitialPersist = React.useRef(true);

  // PageThemeSetter locks auth pages to light; after login, ThemeProvider state can
  // disagree with the DOM until the user reloads. Reconcile on app routes only.
  React.useLayoutEffect(() => {
    if (!mounted || !isValidPlatformTheme(theme)) return;

    const path = pathname ?? "/";
    if (isPublicPath(path)) return;

    const root = document.documentElement;
    const resolved = resolvePlatformTheme(theme);
    const domIsDark = root.classList.contains("dark");
    if ((resolved === "dark") === domIsDark && !root.hasAttribute("data-page-theme-active")) {
      return;
    }

    // PageThemeSetter clears data-page-theme-active in useEffect (after layout), so
    // clear it here when entering the shell and apply the stored preference instantly.
    root.removeAttribute("data-page-theme-active");
    root.removeAttribute("data-page-theme");
    applyPlatformThemeToDocument(theme, { disableTransitions: true });
  }, [theme, mounted, pathname]);

  React.useEffect(() => {
    if (!isValidPlatformTheme(theme)) return;
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false;
      return;
    }
    persistPlatformTheme(theme);
  }, [theme]);

  return null;
}
