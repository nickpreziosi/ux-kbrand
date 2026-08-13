import type { AuthBrandPanelLayer } from "@k-lab/components";

/**
 * Brand panel / hero backgrounds — paths and overlays match
 * k-lab-components `authBrandPanelPresets` (assets via brand-assets copy into
 * public/images/).
 */
export const AUTH_BG_LOGO_RIGHT = "/images/bg-logo-right.webp";
export const AUTH_BG_GRADIENT = "/images/klab-gradient.webp";

/** Black scrim opacity for logoRight / gradient presets in k-lab-components. */
export const BRAND_IMAGE_OVERLAY_OPACITY = 0.5;

/** Image + black overlay stack for home hero (`logoRight`). */
export function logoRightBrandLayers(): AuthBrandPanelLayer[] {
  return [
    {
      type: "image",
      src: AUTH_BG_LOGO_RIGHT,
      position: "center right",
      priority: "high",
      loading: "eager",
    },
    {
      type: "overlay",
      color: "#000000",
      opacity: BRAND_IMAGE_OVERLAY_OPACITY,
    },
  ];
}

/** Image + black overlay stack for auth brand panel (`gradient`). */
export function gradientBrandLayers(): AuthBrandPanelLayer[] {
  return [
    {
      type: "image",
      src: AUTH_BG_GRADIENT,
      priority: "high",
      loading: "eager",
    },
    {
      type: "overlay",
      color: "#000000",
      opacity: BRAND_IMAGE_OVERLAY_OPACITY,
    },
  ];
}
