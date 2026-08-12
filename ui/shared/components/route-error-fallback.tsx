"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@k-lab/components";
import { PageHeader } from "@k-lab/components";
import { useTranslations } from "next-intl";

export interface RouteErrorFallbackProps {
  /** Error captured by the route error boundary. */
  error: Error & { digest?: string };
  /** Re-renders the route segment; provided by Next.js error boundaries. */
  reset: () => void;
  title?: string;
  subtitle?: string;
}

/**
 * Fallback UI for route-level error boundaries (app error.tsx files).
 * Mirrors the not-found page layout so failures stay inside the app shell.
 */
export const RouteErrorFallback = ({
  error,
  reset,
  title,
  subtitle,
}: RouteErrorFallbackProps) => {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");

  return (
    <div className="space-y-6">
      <PageHeader
        title={title ?? t("somethingWentWrong")}
        subtitle={subtitle ?? t("unexpectedRouteError")}
        icon={<AlertTriangle className="h-8 w-8" strokeWidth={1.75} />}
      />
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-2 justify-center sm:justify-start">
        <Button type="button" variant="accent-brand" size="lg" className="gap-2" onClick={reset}>
          <RotateCcw className="h-4 w-4 shrink-0" aria-hidden />
          {tCommon("tryAgain")}
        </Button>
        <Button variant="outline" size="lg" className="gap-2" asChild>
          <Link href="/">
            <Home className="h-4 w-4 shrink-0" aria-hidden />
            {tCommon("goHome")}
          </Link>
        </Button>
      </div>
      {error.digest && (
        <p className="text-sm text-muted-foreground">
          {t("contactSupportReference")}{" "}
          <code className="font-mono">{error.digest}</code>
        </p>
      )}
    </div>
  );
};
