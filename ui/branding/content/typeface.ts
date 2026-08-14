/**
 * Official K Lab typeface and hierarchy from the brand guidelines.
 * Names and body copy live in `branding.typography` per locale.
 */

export const TYPEFACE_NAME = "Sora";

export const TYPEFACE_CHARACTER_SET = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "!@#$^&*()_+=;'<>,./?",
] as const;

export interface TypefaceWeight {
  id: "light" | "regular" | "bold" | "extraBold";
  /** CSS font-weight matching the named cut in the guidelines. */
  weight: 300 | 400 | 700 | 800;
  className: string;
}

/** The four Sora cuts packaged with the guidelines. */
export const TYPEFACE_WEIGHTS: TypefaceWeight[] = [
  { id: "light", weight: 300, className: "font-light" },
  { id: "regular", weight: 400, className: "font-normal" },
  { id: "bold", weight: 700, className: "font-bold" },
  { id: "extraBold", weight: 800, className: "font-extrabold" },
];

export interface TypeHierarchyRole {
  id: "header" | "subHeader" | "body" | "annotations" | "button";
  typeface: "Sora" | "Arial";
  cut: "Bold" | "Regular";
  className: string;
}

export const TYPE_HIERARCHY: TypeHierarchyRole[] = [
  { id: "header", typeface: "Sora", cut: "Bold", className: "font-bold" },
  {
    id: "subHeader",
    typeface: "Sora",
    cut: "Regular",
    className: "font-normal",
  },
  {
    id: "body",
    typeface: "Arial",
    cut: "Regular",
    className: "font-normal",
  },
  {
    id: "annotations",
    typeface: "Sora",
    cut: "Regular",
    className: "font-normal",
  },
  { id: "button", typeface: "Sora", cut: "Regular", className: "font-normal" },
];

export const ARIAL_STACK = "Arial, Helvetica, sans-serif";

export const TYPOGRAPHY_TOKEN_FILE = "k-lab-typography-tokens.css";
