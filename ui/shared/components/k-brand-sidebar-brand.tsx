"use client";

import * as React from "react";
import Link from "next/link";
import {
  CollapsingSidebarLogo,
  SIDEBAR_LOGO_FADE_OUT_MS,
  cn,
  useAppSidebar,
} from "@k-lab/components";
import { KLabBrandLogo } from "@/ui/shared/components/k-lab-brand-logo";

/**
 * Stacked sidebar mark: icon stays visible; only the full lockup fades on
 * collapse. Uses AppLayoutClient's `brand` slot so we are not forced into the
 * customLogo crossfade path in @k-lab/components 0.11.2.
 */
export function KBrandSidebarBrand() {
  const { collapsed, homeHref } = useAppSidebar();
  const [compact, setCompact] = React.useState(collapsed);
  const isFirstRenderRef = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      setCompact(collapsed);
      return;
    }
    if (collapsed) {
      const timer = window.setTimeout(
        () => setCompact(true),
        SIDEBAR_LOGO_FADE_OUT_MS,
      );
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setCompact(false), 0);
    return () => window.clearTimeout(timer);
  }, [collapsed]);

  const mark = (
    <CollapsingSidebarLogo
      collapsed={collapsed}
      compact={compact}
      primaryLayout="stacked"
      expanded={
        <KLabBrandLogo
          variant="theme-aware"
          className="h-9 w-auto shrink-0"
          aria-hidden
        />
      }
      collapsedIcon={
        <KLabBrandLogo
          variant="icon"
          className="h-9 w-9 shrink-0"
          aria-hidden
        />
      }
      overflow="product"
    />
  );

  if (!homeHref) {
    return mark;
  }

  return (
    <Link
      href={homeHref}
      className={cn(
        "flex w-full items-center justify-start rounded-app-radius px-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        compact ? "h-14" : "h-11 rounded-app-radius bg-background py-0",
      )}
      aria-label="Home"
    >
      {mark}
    </Link>
  );
}
