import { authBrandPanelPresets, KLabLogo } from "@k-lab/components";
import { getAppAuthConfig } from "@/lib/auth/app-auth-config";

jest.mock("@k-lab/components", () => {
  function KLabLogo() {
    return null;
  }
  KLabLogo.displayName = "KLabLogo";
  const LIBRARY_GRADIENT = [
    { type: "image", src: "/images/klab-gradient.webp" },
    { type: "overlay", color: "#000000" },
  ];
  return {
    KLabLogo,
    authBrandPanelPresets: {
      gradient: () => LIBRARY_GRADIENT,
    },
    resolveAuthConfig: (input: Record<string, unknown>) => input,
  };
});

describe("getAppAuthConfig", () => {
  it("uses the library KLabLogo and gradient auth brand panel", () => {
    const config = getAppAuthConfig();

    expect(config.Logo).toBe(KLabLogo);
    expect(config.brandPanelLogoVariant).toBe("white");
    expect(config.brandPanelLayers).toBe(authBrandPanelPresets.gradient());
    expect(config.name).toBe("K Brand");
    expect(config.loginPath).toBe("/login");
  });
});
