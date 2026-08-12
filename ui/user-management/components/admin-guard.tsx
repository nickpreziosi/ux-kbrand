"use client";

import * as React from "react";
import {
  Button,
  Empty,
  EmptyAction,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Skeleton,
} from "@k-lab/components";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePortalRole } from "@/ui/user-management/hooks/use-portal-role";

/**
 * Client-side role gate for /admin views (UI gating only — the middleware
 * already requires a session; server enforcement arrives with Firebase rules).
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  const { isAdmin, loading } = usePortalRole();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Empty>
        <EmptyIcon>
          <ShieldAlert aria-hidden />
        </EmptyIcon>
        <EmptyTitle>{t("unauthorized.title")}</EmptyTitle>
        <EmptyDescription>{t("unauthorized.description")}</EmptyDescription>
        <EmptyAction>
          <Button variant="outline" href="/">
            {t("unauthorized.backHome")}
          </Button>
        </EmptyAction>
      </Empty>
    );
  }

  return <>{children}</>;
}
