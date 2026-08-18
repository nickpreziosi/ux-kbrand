import { shouldShowGuestChrome } from "@/lib/auth/guest-chrome";

describe("shouldShowGuestChrome", () => {
  it("is true for a settled public visitor with no Microsoft user", () => {
    expect(
      shouldShowGuestChrome({
        authLoading: false,
        user: null,
        viewerRole: "public",
      }),
    ).toBe(true);
  });

  it("is false while auth is restoring, when a Microsoft user exists, or when the viewer is not public", () => {
    expect(
      shouldShowGuestChrome({
        authLoading: true,
        user: null,
        viewerRole: "public",
      }),
    ).toBe(false);
    expect(
      shouldShowGuestChrome({
        authLoading: false,
        user: { uid: "u1" },
        viewerRole: "public",
      }),
    ).toBe(false);
    expect(
      shouldShowGuestChrome({
        authLoading: false,
        user: null,
        viewerRole: "employee",
      }),
    ).toBe(false);
  });
});
