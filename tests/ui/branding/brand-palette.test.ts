import { BRAND_COLOR_GROUPS } from "@/ui/branding/content/brand-palette";

describe("brand-palette tokens", () => {
  it("aligns product accent-brand with k-lab-components (blue light / cyan dark)", () => {
    const product = BRAND_COLOR_GROUPS.find((group) => group.id === "product");
    const accent = product?.tokens.find((token) => token.id === "accentBrand");
    expect(accent?.token).toBe("accent-brand");
    expect(accent?.light).toBe("218 58% 28%");
    expect(accent?.dark).toBe("199 100% 50%");
  });

  it("records dark-mode shifts for success and destructive, not warning", () => {
    const status = BRAND_COLOR_GROUPS.find((group) => group.id === "status");
    const byId = Object.fromEntries(
      (status?.tokens ?? []).map((token) => [token.id, token]),
    );

    expect(byId.success?.light).toBe("141.1 71.4% 45%");
    expect(byId.success?.dark).toBe("141.1 71.4% 42%");
    expect(byId.destructive?.light).toBe("0 84.2% 56%");
    expect(byId.destructive?.dark).toBe("0 62.8% 50%");
    expect(byId.warning?.light).toBe("51.08 100% 56.47%");
    expect(byId.warning?.dark).toBeUndefined();
  });

  it("lists the official identity palette and omits deep navy", () => {
    const identity = BRAND_COLOR_GROUPS.find((group) => group.id === "identity");
    const ids = (identity?.tokens ?? []).map((token) => token.id);
    const byId = Object.fromEntries(
      (identity?.tokens ?? []).map((token) => [token.id, token]),
    );

    expect(ids).toEqual([
      "primaryColor",
      "secondaryColor",
      "tertiaryColor",
      "additionalColor1",
      "additionalColor2",
      "additionalColor3",
    ]);
    expect(ids).not.toContain("deepNavy");
    expect(byId.primaryColor?.light).toBe("0 0% 19%");
    expect(byId.secondaryColor?.light).toBe("218 58% 28.2%");
    expect(byId.tertiaryColor?.light).toBe("199.2 100% 49.6%");
  });
});
