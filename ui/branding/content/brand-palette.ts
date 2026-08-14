/**
 * Colour reference for the branding section, in two layers:
 *
 *  - `identity` — official K Lab palette from the brand guidelines (primary,
 *    secondary, tertiary, and additional). These are literal values; they are
 *    not design tokens.
 *  - `product` / `status` — the design tokens K Lab apps render with, defined
 *    in app/globals.css (aligned with @k-lab/components). Swatches render the
 *    live CSS variable so they stay true when a token is retuned.
 *
 * Copy for each entry lives in `branding.colors.tokens` per locale.
 */
export interface BrandColorToken {
  /** Translation key under `branding.colors.tokens`. */
  id: string;
  /** CSS custom property (without `--`) when the colour is a design token.
   *  Absent for identity colours, which render their literal value. */
  token?: string;
  /** Light-theme HSL triplet. */
  light: string;
  /** Dark-theme triplet; omitted when the token resolves to the same colour. */
  dark?: string;
}

export interface BrandColorGroup {
  id: "identity" | "product" | "status";
  tokens: BrandColorToken[];
}

export const BRAND_COLOR_GROUPS: BrandColorGroup[] = [
  {
    id: "identity",
    tokens: [
      { id: "primaryColor", light: "0 0% 19%" },
      { id: "secondaryColor", light: "218 58% 28.2%" },
      { id: "tertiaryColor", light: "199.2 100% 49.6%" },
      { id: "additionalColor1", light: "0 0% 64.7%" },
      { id: "additionalColor2", light: "196 82% 71.6%" },
      { id: "additionalColor3", light: "0 0% 0%" },
    ],
  },
  {
    id: "product",
    tokens: [
      {
        id: "accentBrand",
        token: "accent-brand",
        light: "218 58% 28%",
        dark: "199 100% 50%",
      },
      {
        id: "foreground",
        token: "foreground",
        light: "0 0% 0%",
        dark: "0 0% 100%",
      },
      {
        id: "background",
        token: "background",
        light: "0 0% 100%",
        dark: "0 0% 0%",
      },
      {
        id: "secondary",
        token: "secondary",
        light: "0 0% 94%",
        dark: "0 0% 12%",
      },
      {
        id: "accent",
        token: "accent",
        light: "0 0% 94%",
        dark: "0 0% 19%",
      },
      {
        id: "muted",
        token: "muted",
        light: "0 0% 19%",
        dark: "0 0% 65%",
      },
      {
        id: "border",
        token: "border",
        light: "0 0% 87%",
        dark: "0 0% 19%",
      },
    ],
  },
  {
    id: "status",
    tokens: [
      {
        id: "success",
        token: "success",
        light: "141.1 71.4% 45%",
        dark: "141.1 71.4% 42%",
      },
      { id: "warning", token: "warning", light: "51.08 100% 56.47%" },
      {
        id: "destructive",
        token: "destructive",
        light: "0 84.2% 56%",
        dark: "0 62.8% 50%",
      },
    ],
  },
];
