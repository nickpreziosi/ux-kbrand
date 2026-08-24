import {
  assetPresentationKind,
  presentationAllowsExpand,
  presentationImageFit,
  presentationShowsImagePreview,
} from "@/contexts/brand-assets/domain/services/asset-presentation";

describe("assetPresentationKind", () => {
  it("maps categories onto card interaction kinds", () => {
    expect(assetPresentationKind("logos")).toBe("logo");
    expect(assetPresentationKind("brand-imagery")).toBe("imagery");
    expect(assetPresentationKind("photography")).toBe("imagery");
    expect(assetPresentationKind("fonts")).toBe("font");
    expect(assetPresentationKind("iconography")).toBe("icon");
    expect(assetPresentationKind("corporate-assets")).toBe("document");
    expect(assetPresentationKind("pitch-decks")).toBe("document");
    expect(assetPresentationKind("brand-guidelines")).toBe("document");
  });

  it("only expands imagery", () => {
    expect(presentationAllowsExpand("imagery")).toBe(true);
    expect(presentationAllowsExpand("logo")).toBe(false);
    expect(presentationAllowsExpand("font")).toBe(false);
    expect(presentationAllowsExpand("document")).toBe(false);
    expect(presentationAllowsExpand("icon")).toBe(false);
  });

  it("crops only photography and brand imagery", () => {
    expect(presentationImageFit("imagery")).toBe("cover");
    expect(presentationImageFit("logo")).toBe("contain");
    expect(presentationImageFit("icon")).toBe("contain");
    expect(presentationImageFit("document")).toBe("contain");
    expect(presentationImageFit("font")).toBe("contain");
  });

  it("never uses a bitmap preview for fonts", () => {
    expect(presentationShowsImagePreview("font")).toBe(false);
    expect(presentationShowsImagePreview("logo")).toBe(true);
    expect(presentationShowsImagePreview("imagery")).toBe(true);
    expect(presentationShowsImagePreview("icon")).toBe(true);
    expect(presentationShowsImagePreview("document")).toBe(true);
  });
});
