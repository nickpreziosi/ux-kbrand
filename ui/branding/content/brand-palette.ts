/**
 * Official K Lab colour and gradient reference from the brand guidelines.
 * Values follow the HEX (and matching RGB / CMYK) on those pages; HSL is
 * derived so every swatch can copy all four encodings.
 *
 * Copy for names and group titles lives in `branding.colors` per locale.
 */

export type BrandColorFormat = "hex" | "rgb" | "cmyk" | "hsl";

export interface BrandColor {
  id: string;
  hex: string;
  rgb: string;
  cmyk: string;
  hsl: string;
}

export interface BrandColorGroup {
  id: "primaryPalette" | "secondaryColors" | "neutrals";
  colors: BrandColor[];
}

export interface BrandGradient {
  id: "primaryGradient" | "secondaryGradient" | "tertiaryGradient";
  /** CSS linear-gradient using the palette stops. */
  css: string;
  usage: "darkMode" | "lightMode" | "lightOnly";
}

export const BRAND_COLOR_FORMATS: readonly BrandColorFormat[] = [
  "hex",
  "rgb",
  "cmyk",
  "hsl",
];

export const BRAND_COLOR_GROUPS: BrandColorGroup[] = [
  {
    id: "primaryPalette",
    colors: [
      {
        id: "primary",
        hex: "#303030",
        rgb: "48, 48, 48",
        cmyk: "0, 0, 0, 81",
        hsl: "0, 0%, 19%",
      },
      {
        id: "secondary",
        hex: "#1E3D72",
        rgb: "30, 61, 114",
        cmyk: "100, 85, 28, 14",
        hsl: "218, 58%, 28%",
      },
      {
        id: "tertiary",
        hex: "#00ACFD",
        rgb: "0, 172, 253",
        cmyk: "67, 20, 0, 0",
        hsl: "199, 100%, 50%",
      },
    ],
  },
  {
    id: "secondaryColors",
    colors: [
      {
        id: "additional1",
        hex: "#A5A5A5",
        rgb: "165, 165, 165",
        cmyk: "0, 0, 0, 35",
        hsl: "0, 0%, 65%",
      },
      {
        id: "additional2",
        hex: "#7BD2F2",
        rgb: "123, 210, 242",
        cmyk: "46, 0, 2, 0",
        hsl: "196, 82%, 72%",
      },
      {
        id: "additional3",
        hex: "#000000",
        rgb: "0, 0, 0",
        cmyk: "0, 0, 0, 100",
        hsl: "0, 0%, 0%",
      },
    ],
  },
  {
    id: "neutrals",
    colors: [
      {
        id: "white",
        hex: "#FFFFFF",
        rgb: "255, 255, 255",
        cmyk: "1, 2, 2, 0",
        hsl: "0, 0%, 100%",
      },
      {
        id: "grey1",
        hex: "#EFEFEF",
        rgb: "239, 239, 239",
        cmyk: "0, 0, 0, 6",
        hsl: "0, 0%, 94%",
      },
      {
        id: "grey2",
        hex: "#DDDDDD",
        rgb: "221, 221, 221",
        cmyk: "0, 0, 0, 13",
        hsl: "0, 0%, 87%",
      },
      {
        id: "black",
        hex: "#000000",
        rgb: "0, 0, 0",
        cmyk: "75, 68, 67, 90",
        hsl: "0, 0%, 0%",
      },
    ],
  },
];

export const BRAND_GRADIENTS: BrandGradient[] = [
  {
    id: "primaryGradient",
    css: "linear-gradient(180deg, #000000 0%, #1E3D72 100%)",
    usage: "darkMode",
  },
  {
    id: "secondaryGradient",
    css: "linear-gradient(180deg, #FFFFFF 0%, #1E3D72 100%)",
    usage: "lightMode",
  },
  {
    id: "tertiaryGradient",
    css: "linear-gradient(180deg, #FFFFFF 0%, #7BD2F2 100%)",
    usage: "lightOnly",
  },
];

/** Paste-ready encoding: HEX as `#…`, RGB/HSL as CSS functions, CMYK as print channels. */
export function colorValue(color: BrandColor, format: BrandColorFormat): string {
  switch (format) {
    case "hex":
      return color.hex;
    case "rgb":
      return `rgb(${color.rgb})`;
    case "cmyk": {
      const [cyan, magenta, yellow, black] = color.cmyk.split(",").map((part) => part.trim());
      return `C: ${cyan}, M: ${magenta}, Y: ${yellow}, K: ${black}`;
    }
    case "hsl":
      return `hsl(${color.hsl})`;
  }
}
