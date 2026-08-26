import * as React from "react";

const KLAB_LOGO_SRC = {
  icon: "/logos/k-lab/klab_logomark_dark.svg",
  blue: "/logos/k-lab/klab_full_logo_blue.svg",
  white: "/logos/k-lab/klab_full_logo_light.svg",
  light: "/logos/k-lab/klab_full_logo_light.svg",
  dark: "/logos/k-lab/klab_full_logo_dark.svg",
  black: "/logos/k-lab/klab_full_logo_dark.svg",
} as const;

export function StubKLabLogo({
  variant = "dark",
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  variant?: keyof typeof KLAB_LOGO_SRC;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={KLAB_LOGO_SRC[variant]}
      alt={alt ?? ""}
      className={className}
      data-variant={variant}
      {...props}
    />
  );
}

export function StubProductLogo({
  product,
  variant = "theme-aware",
  size,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  product: string;
  variant?: string;
  size?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/k-lab/klab_full_logo_dark.svg"
      alt={product}
      className={className}
      data-testid="product-logo"
      data-product={product}
      data-variant={variant}
      data-size={size}
      {...props}
    />
  );
}

function StubProductWordmark(
  folder: string,
  defaultAlt: string,
): React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { variant?: string }
> {
  function Logo({
    variant = "dark",
    alt,
    className,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { variant?: string }) {
    const light = variant === "white" || variant === "light";
    const file = light
      ? `klab_sub_brands_${folder.replace(/-/g, "")}_light.svg`
      : `klab_sub_brands_${folder.replace(/-/g, "")}_dark.svg`;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/logos/${folder}/${file}`}
        alt={alt ?? defaultAlt}
        className={className}
        data-variant={variant}
        {...props}
      />
    );
  }
  Logo.displayName = `Stub${defaultAlt.replace(/\s/g, "")}Logo`;
  return Logo;
}

export const StubKRailsLogo = StubProductWordmark("k-rails", "K Rails");
export const StubKTalkLogo = StubProductWordmark("k-talk", "K Talk");
export const StubKRiskLogo = StubProductWordmark("k-risk", "K Risk");
export const StubKLeadsLogo = StubProductWordmark("k-leads", "K Leads");
