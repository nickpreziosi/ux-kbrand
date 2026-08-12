"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself,
 * so it must render its own <html>/<body> and cannot rely on app providers.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="max-w-[480px] text-base text-muted-foreground">
            An unexpected error occurred while loading the application. Please try again.
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground">
              Reference: <code className="font-mono">{error.digest}</code>
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-2 rounded-md bg-accent-brand px-6 py-2.5 text-sm font-medium text-black hover:opacity-90"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
