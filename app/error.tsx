"use client";

import { useEffect } from "react";
import { RouteErrorFallback } from "@/ui/shared/components/route-error-fallback";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary:", error);
  }, [error]);

  return <RouteErrorFallback error={error} reset={reset} />;
}
