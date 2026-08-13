"use client";

import * as React from "react";
import { BrandLogo, type BrandLogoProps } from "@k-lab/components";

/**
 * New K Lab lockups from public/logos (aligned with k-lab-components).
 * Use BrandLogo for theme-aware chrome; use KLabBrandLogoMark for auth Logo slots.
 */
export const KLAB_BRAND_LOGO_SRC = {
  full: {
    dark: "/logos/klab-logo-full-dark.svg",
    light: "/logos/klab-logo-full-white.svg",
    white: "/logos/klab-logo-full-white.svg",
    blue: "/logos/klab-logo-full-blue.svg",
  },
  icon: {
    dark: "/logos/klab-logo-icon.svg",
    light: "/logos/klab-logo-icon-white.svg",
    white: "/logos/klab-logo-icon-white.svg",
  },
} as const;

export type KLabBrandLogoMarkVariant =
  | "icon"
  | "dark"
  | "light"
  | "black"
  | "white"
  | "blue";

export interface KLabBrandLogoMarkProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  variant?: KLabBrandLogoMarkVariant;
  alt?: string;
}

function resolveSrc(variant: KLabBrandLogoMarkVariant): string {
  switch (variant) {
    case "icon":
      return KLAB_BRAND_LOGO_SRC.icon.dark;
    case "blue":
      return KLAB_BRAND_LOGO_SRC.full.blue;
    case "white":
    case "light":
      return KLAB_BRAND_LOGO_SRC.full.white;
    case "dark":
    case "black":
    default:
      return KLAB_BRAND_LOGO_SRC.full.dark;
  }
}

/** Drop-in Logo for auth pages (matches KLabLogo variant API). */
export const KLabBrandLogoMark = React.forwardRef<
  HTMLImageElement,
  KLabBrandLogoMarkProps
>(({ variant = "dark", alt, className, ...props }, ref) => {
  const ariaHidden = props["aria-hidden"];
  const ariaLabel = props["aria-label"];

  return (
    // eslint-disable-next-line @next/next/no-img-element -- brand SVG mark; mirrors @k-lab/components KLabLogo
    <img
      ref={ref}
      src={resolveSrc(variant)}
      alt={ariaHidden ? "" : (alt ?? "")}
      aria-hidden={ariaHidden}
      aria-label={
        ariaHidden
          ? undefined
          : (alt ?? (typeof ariaLabel === "string" ? ariaLabel : undefined))
      }
      className={className}
      decoding="async"
      {...props}
    />
  );
});
KLabBrandLogoMark.displayName = "KLabBrandLogoMark";

/** Theme-aware BrandLogo wrapper for sidebar / chrome. */
export function KLabBrandLogo(
  props: Omit<BrandLogoProps, "src" | "Logo" | "logos">,
) {
  return <BrandLogo src={KLAB_BRAND_LOGO_SRC} {...props} />;
}
