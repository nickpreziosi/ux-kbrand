/**
 * Logo variants used to pick clearspace previews. Each variant resolves to a
 * catalog asset by tag (never by id) so admins can replace the underlying file
 * without touching code.
 */
export interface LogoVariant {
  id: "primary" | "dark" | "reversed" | "logomark";
  /** Every tag must be present on the asset — `dark` alone also matches the
   *  dark logomark and its vector, so pairs disambiguate. */
  matchTags: string[];
  /** Swatch behind the preview so each lockup is shown on a valid surface. */
  surface: "light" | "dark";
}

export const LOGO_VARIANTS: LogoVariant[] = [
  { id: "primary", matchTags: ["primary", "logo"], surface: "light" },
  { id: "dark", matchTags: ["dark", "logo"], surface: "light" },
  { id: "reversed", matchTags: ["reversed", "logo"], surface: "dark" },
  { id: "logomark", matchTags: ["mark"], surface: "light" },
];

/** Do / don't entries rendered as two lists; copy keyed per locale. */
export const LOGO_RULE_KEYS = {
  dos: ["clearspace", "approvedFiles", "contrast", "scaleProportionally"],
  donts: ["recolor", "distort", "effects", "rebuild"],
} as const;
