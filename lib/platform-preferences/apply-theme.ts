import type { PlatformTheme } from "@/lib/platform-preferences/constants";

export function resolvePlatformTheme(theme: PlatformTheme): "light" | "dark" {
  if (theme === "system") {
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

/** Apply platform theme to `<html class="dark">` (matches `@k-lab/components` ThemeProvider). */
export function applyPlatformThemeToDocument(
  theme: PlatformTheme,
  options?: { disableTransitions?: boolean },
): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const { disableTransitions = false } = options ?? {};

  if (disableTransitions) {
    root.classList.add("no-transitions");
  }

  const resolved = resolvePlatformTheme(theme);
  root.classList.toggle("dark", resolved === "dark");

  if (disableTransitions) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("no-transitions");
      });
    });
  }
}
