import { BRAND_COLOR_GROUPS } from "@/ui/branding/content/brand-palette";

describe("brand-palette tokens", () => {
  it("aligns product accent-brand with k-lab-components (blue light / cyan dark)", () => {
    const product = BRAND_COLOR_GROUPS.find((group) => group.id === "product");
    const accent = product?.tokens.find((token) => token.id === "accentBrand");
    expect(accent?.token).toBe("accent-brand");
    expect(accent?.light).toBe("218 58% 28%");
    expect(accent?.dark).toBe("199 100% 50%");
  });
});
