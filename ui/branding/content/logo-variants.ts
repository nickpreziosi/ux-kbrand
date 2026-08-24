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

/** Do / don't entries rendered as two lists; copy keyed per locale.
 *  Don'ts mirror the six misuse cases documented in the brand guidelines. */
export const LOGO_RULE_KEYS = {
  dos: ["clearspace", "approvedFiles", "contrast", "scaleProportionally"],
  donts: [
    "stretch",
    "rotate",
    "containers",
    "flipHorizontal",
    "flipVertical",
    "shear",
  ],
} as const;

/**
 * Approved surfaces from the Logo Backgrounds artboard: reversed lockup on
 * photography / neon fields, primary and charcoal on white.
 * Image paths are catalog files; lockups still resolve by tag.
 */
export const LOGO_BACKGROUND_EXAMPLES = [
  {
    id: "photoGradient",
    variantId: "reversed" as const,
    surface: "image" as const,
    imageSrc: "/brand-files/backgrounds/k-lab-bg-002.webp",
  },
  {
    id: "neonField",
    variantId: "reversed" as const,
    surface: "image" as const,
    imageSrc: "/brand-files/backgrounds/k-lab-bg-001.webp",
  },
  {
    id: "solidWhite",
    variantId: "primary" as const,
    surface: "light" as const,
  },
  {
    id: "greyOnWhite",
    variantId: "dark" as const,
    surface: "light" as const,
  },
] as const;

export type LogoBackgroundExample = (typeof LOGO_BACKGROUND_EXAMPLES)[number];

/**
 * Visual don'ts from the Logo Misuse artboard. Transforms are applied to the
 * approved lockup so the examples stay in sync with catalog files.
 */
export const LOGO_MISUSE_EXAMPLES = [
  { id: "stretch", className: "origin-center scale-x-150" },
  { id: "rotate", className: "origin-center -rotate-[22deg]" },
  { id: "containers", treatment: "oval" as const },
  { id: "flipHorizontal", className: "-scale-x-100" },
  { id: "flipVertical", className: "-scale-y-100" },
  { id: "shear", className: "origin-center -skew-x-[18deg]" },
] as const;

export type LogoMisuseExample = (typeof LOGO_MISUSE_EXAMPLES)[number];

/** Primary logo treatments from the guidelines: each lockup on its only
 *  approved surface. Resolved against the catalog by tag, like variants. */
export const PRIMARY_LOGO_TREATMENTS = [
  { id: "whiteOnBlack", matchTags: ["reversed", "logo"], surface: "dark" },
  { id: "greyOnWhite", matchTags: ["dark", "logo"], surface: "light" },
] as const;

export type PrimaryLogoTreatment = (typeof PRIMARY_LOGO_TREATMENTS)[number];
