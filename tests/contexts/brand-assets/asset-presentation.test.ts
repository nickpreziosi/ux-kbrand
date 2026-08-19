import {
  assetPresentationKind,
  presentationAllowsExpand,
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
  });

  it("only expands imagery", () => {
    expect(presentationAllowsExpand("imagery")).toBe(true);
    expect(presentationAllowsExpand("logo")).toBe(false);
    expect(presentationAllowsExpand("font")).toBe(false);
    expect(presentationAllowsExpand("document")).toBe(false);
    expect(presentationAllowsExpand("icon")).toBe(false);
  });
});
