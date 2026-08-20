"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  PageHeader,
  buildPageBreadcrumbItems,
  shouldHideAutoBreadcrumbTrail,
  cn,
  type PageHeaderProps,
} from "@k-lab/components";
import { useKBrandBreadcrumbConfig } from "@/ui/shared/lib/page-breadcrumbs";

/**
 * Portal PageHeader with breadcrumbs derived from the current path.
 * Shows trails from depth 1 (e.g. Home → Branding), not only depth 2+.
 */
export function KBrandPageHeader({
  breadcrumbs,
  breadcrumbConfig,
  autoBreadcrumbs: _autoBreadcrumbs,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  const pathname = usePathname();
  const defaultConfig = useKBrandBreadcrumbConfig();
  const config = breadcrumbConfig ?? defaultConfig;

  const resolvedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs !== undefined) return breadcrumbs;

    const items = buildPageBreadcrumbItems(pathname, config);
    if (shouldHideAutoBreadcrumbTrail(pathname, items, config.rootLabel)) {
      return undefined;
    }

    const segments = (pathname ?? "/").replace(/\/+$/, "").split("/").filter(Boolean);
    if (segments.length < 1) return undefined;

    return items;
  }, [breadcrumbs, pathname, config]);

  return (
    <PageHeader
      {...props}
      className={cn(actions && "@sm:items-end sm:items-end", className)}
      breadcrumbs={resolvedBreadcrumbs}
      actions={actions ? <div className="pe-4">{actions}</div> : actions}
    />
  );
}
