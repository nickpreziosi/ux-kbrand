/**
 * Colour reference for the branding section, in two layers:
 *
 *  - `identity` — the 2025 K Lab brand colours, sampled from the master logo
 *    and background artwork in brand-source/. These are literal values; they
 *    are not (yet) design tokens.
 *  - `product` / `status` — the design tokens the K Lab apps actually render
 *    with, defined in app/globals.css. Swatches render the live CSS variable,
 *    so they stay true even if a token is retuned.
 *
 * The identity blue and the product accent are deliberately listed side by
 * side: the corporate identity is blue while the product design system still
 * ships an orange accent. See docs/brand-palette-divergence.md.
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
    // Sampled from the raster masters — the HSL below round-trips to the
    // sampled hex, so the value shown on the page is the real one.
    tokens: [
      { id: "brandBlue", light: "219 57.7% 40.8%" },
      { id: "electricBlue", light: "200 100% 49.4%" },
      { id: "deepNavy", light: "214.3 91.3% 4.5%" },
      { id: "brandWhite", light: "0 0% 100%" },
    ],
  },
  {
    id: "product",
    tokens: [
      { id: "accentBrand", token: "accent-brand", light: "23 90% 54%" },
      { id: "foreground", token: "foreground", light: "0 0% 0%", dark: "0 0% 98%" },
      { id: "background", token: "background", light: "0 0% 100%", dark: "225 20% 6%" },
      { id: "secondary", token: "secondary", light: "0 0% 96%", dark: "225 20% 12%" },
      { id: "accent", token: "accent", light: "0 0% 92%", dark: "225 20% 18%" },
      { id: "muted", token: "muted", light: "0 0% 34%", dark: "225 20% 82%" },
      { id: "border", token: "border", light: "0 0% 85%", dark: "225 20% 24%" },
    ],
  },
  {
    id: "status",
    tokens: [
      { id: "success", token: "success", light: "141.1 71.4% 55%" },
      { id: "warning", token: "warning", light: "51.08 100% 56.47%" },
      { id: "destructive", token: "destructive", light: "0 80% 66%" },
    ],
  },
];
