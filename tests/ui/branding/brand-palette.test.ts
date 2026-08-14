import {
  BRAND_COLOR_GROUPS,
  BRAND_GRADIENTS,
  colorValue,
} from "@/ui/branding/content/brand-palette";

describe("brand palette", () => {
  it("lists only guideline groups: primary, secondary, and neutrals", () => {
    expect(BRAND_COLOR_GROUPS.map((group) => group.id)).toEqual([
      "primaryPalette",
      "secondaryColors",
      "neutrals",
    ]);
  });

  it("uses the official primary palette hex values", () => {
    const primary = BRAND_COLOR_GROUPS[0].colors;
    expect(primary.map((color) => color.id)).toEqual([
      "primary",
      "secondary",
      "tertiary",
    ]);
    expect(primary[0].hex).toBe("#303030");
    expect(primary[1].hex).toBe("#1E3D72");
    expect(primary[2].hex).toBe("#00ACFD");
  });

  it("includes neutrals from the guidelines", () => {
    const neutrals = BRAND_COLOR_GROUPS.find((group) => group.id === "neutrals");
    expect(neutrals?.colors.map((color) => color.id)).toEqual([
      "white",
      "grey1",
      "grey2",
      "black",
    ]);
    expect(neutrals?.colors.map((color) => color.hex)).toEqual([
      "#FFFFFF",
      "#EFEFEF",
      "#DDDDDD",
      "#000000",
    ]);
  });

  it("exposes primary, secondary, and tertiary gradients", () => {
    expect(BRAND_GRADIENTS.map((gradient) => gradient.id)).toEqual([
      "primaryGradient",
      "secondaryGradient",
      "tertiaryGradient",
    ]);
    expect(BRAND_GRADIENTS[0].usage).toBe("darkMode");
    expect(BRAND_GRADIENTS[1].usage).toBe("lightMode");
    expect(BRAND_GRADIENTS[2].usage).toBe("lightOnly");
  });

  it("copies color encodings in paste-ready function form", () => {
    const primary = BRAND_COLOR_GROUPS[0].colors[0];
    expect(colorValue(primary, "hex")).toBe("#303030");
    expect(colorValue(primary, "rgb")).toBe("rgb(48, 48, 48)");
    expect(colorValue(primary, "cmyk")).toBe("C: 0, M: 0, Y: 0, K: 81");
    expect(colorValue(primary, "hsl")).toBe("hsl(0, 0%, 19%)");
  });
});
