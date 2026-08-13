import {
  gradientBrandLayers,
  logoRightBrandLayers,
} from "@/lib/brand/auth-brand-layers";

describe("auth brand layers", () => {
  it("logoRight matches k-lab-components logoRight: image + black overlay", () => {
    const layers = logoRightBrandLayers();
    expect(layers).toHaveLength(2);
    expect(layers[0]).toMatchObject({
      type: "image",
      src: "/images/bg-logo-right.webp",
      position: "center right",
    });
    expect(layers[1]).toMatchObject({
      type: "overlay",
      color: "#000000",
      opacity: 0.5,
    });
  });

  it("gradient matches k-lab-components gradient: image + black overlay", () => {
    const layers = gradientBrandLayers();
    expect(layers).toHaveLength(2);
    expect(layers[0]).toMatchObject({
      type: "image",
      src: "/images/klab-gradient.webp",
    });
    expect(layers[1]).toMatchObject({
      type: "overlay",
      color: "#000000",
      opacity: 0.5,
    });
  });
});
