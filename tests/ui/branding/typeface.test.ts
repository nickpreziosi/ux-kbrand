import {
  TYPE_HIERARCHY,
  TYPEFACE_NAME,
  TYPEFACE_WEIGHTS,
} from "@/ui/branding/content/typeface";

describe("brand typeface", () => {
  it("uses Sora as the brand typeface", () => {
    expect(TYPEFACE_NAME).toBe("Sora");
  });

  it("lists only the guideline cuts: Light, Regular, Bold, ExtraBold", () => {
    expect(TYPEFACE_WEIGHTS.map((cut) => cut.id)).toEqual([
      "light",
      "regular",
      "bold",
      "extraBold",
    ]);
    expect(TYPEFACE_WEIGHTS.map((cut) => cut.weight)).toEqual([
      300, 400, 700, 800,
    ]);
  });

  it("follows the guideline type hierarchy", () => {
    expect(
      TYPE_HIERARCHY.map((role) => [role.id, role.typeface, role.cut]),
    ).toEqual([
      ["header", "Sora", "Bold"],
      ["subHeader", "Sora", "Regular"],
      ["body", "Arial", "Regular"],
      ["annotations", "Sora", "Regular"],
      ["button", "Sora", "Regular"],
    ]);
  });
});
