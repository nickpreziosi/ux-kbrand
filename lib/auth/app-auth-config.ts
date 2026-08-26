import {
  KLabLogo,
  authBrandPanelPresets,
  resolveAuthConfig,
  type AuthConfig,
} from "@k-lab/components";

export const APP_AUTH_PATHS = {
  loginPath: "/login",
  registerPath: "/login",
} as const;

export const APP_AUTH_PUBLIC_ROUTES = [
  APP_AUTH_PATHS.loginPath,
  "/auth/callback",
] as const;

const APP_AUTH_DESCRIPTION =
  "Approved brand guidelines, logos, and sales materials — one source of truth for the K Lab brand.";

/** Shared brand + path config for production auth pages (library LoginPage / etc.). */
export function getAppAuthConfig(overrides?: {
  description?: string;
  welcomeText?: string;
}): AuthConfig {
  return resolveAuthConfig({
    name: "K Brand",
    description: overrides?.description ?? APP_AUTH_DESCRIPTION,
    welcomeText:
      overrides?.welcomeText ??
      "Employee sign in — sales resources and admin tools.",
    Logo: KLabLogo,
    brandPanelLayers: authBrandPanelPresets.gradient(),
    brandPanelLogoVariant: "white",
    ...APP_AUTH_PATHS,
  });
}
