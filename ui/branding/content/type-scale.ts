/**
 * Type scale specimen — mirrors the tokens published in the downloadable
 * `k-lab-typography-tokens.css` asset. Names/usage copy lives in
 * `branding.typography.scale` per locale.
 */
export interface TypeScaleEntry {
  id: string;
  /** Tailwind classes reproducing the token for the live specimen. */
  className: string;
  size: string;
  weight: number;
  lineHeight: string;
}

export const TYPE_SCALE: TypeScaleEntry[] = [
  {
    id: "display",
    className: "text-5xl font-bold leading-[1.1] tracking-tight",
    size: "3rem",
    weight: 700,
    lineHeight: "1.1",
  },
  {
    id: "h1",
    className: "text-4xl font-bold leading-[1.2] tracking-tight",
    size: "2.25rem",
    weight: 700,
    lineHeight: "1.2",
  },
  {
    id: "h2",
    className: "text-3xl font-semibold leading-[1.25]",
    size: "1.75rem",
    weight: 600,
    lineHeight: "1.25",
  },
  {
    id: "h3",
    className: "text-xl font-semibold leading-[1.3]",
    size: "1.375rem",
    weight: 600,
    lineHeight: "1.3",
  },
  {
    id: "bodyLarge",
    className: "text-lg font-normal leading-relaxed",
    size: "1.125rem",
    weight: 400,
    lineHeight: "1.6",
  },
  {
    id: "body",
    className: "text-base font-normal leading-relaxed",
    size: "1rem",
    weight: 400,
    lineHeight: "1.6",
  },
  {
    id: "caption",
    className: "text-sm font-medium leading-snug",
    size: "0.8125rem",
    weight: 500,
    lineHeight: "1.4",
  },
  {
    id: "overline",
    className: "text-xs font-semibold uppercase leading-snug tracking-[0.08em]",
    size: "0.6875rem",
    weight: 600,
    lineHeight: "1.3",
  },
];

export const FONT_WEIGHTS = [
  { weight: 300, className: "font-light" },
  { weight: 400, className: "font-normal" },
  { weight: 500, className: "font-medium" },
  { weight: 600, className: "font-semibold" },
  { weight: 700, className: "font-bold" },
] as const;
