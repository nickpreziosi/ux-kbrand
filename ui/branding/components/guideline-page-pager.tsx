"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@k-lab/components";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMessages, useTranslations } from "next-intl";
import {
  GUIDELINE_PAGES,
  guidelinePageIndex,
} from "@/ui/branding/content/guideline-pages";

/**
 * Docs-style Previous / Next for branding section pages.
 * Hidden on Overview and Brand guidelines (ends of the reading order).
 */
export function GuidelinePagePager() {
  const pathname = usePathname() ?? "/";
  const allMessages = useMessages();
  const t = useTranslations("branding");
  const pagerCopy = (allMessages as { branding?: { pager?: { previous?: string; next?: string } } })
    .branding?.pager;
  const previousLabel = pagerCopy?.previous ?? "Previous";
  const nextLabel = pagerCopy?.next ?? "Next";
  const index = guidelinePageIndex(pathname);

  if (index <= 0 || index >= GUIDELINE_PAGES.length - 1) {
    return null;
  }

  const previous = GUIDELINE_PAGES[index - 1];
  const next = GUIDELINE_PAGES[index + 1];
  if (!previous || !next) return null;

  return (
    <nav className="mt-8 flex items-stretch justify-between gap-4 border-t pt-6">
      <Button href={previous.href} variant="outline" className="h-auto max-w-[50%] justify-start py-3">
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        <span className="flex min-w-0 flex-col items-start text-start">
          <span className="text-xs font-medium text-muted-foreground">{previousLabel}</span>
          <span className="truncate font-semibold">{t(previous.titleKey)}</span>
        </span>
      </Button>
      <Button
        href={next.href}
        variant="accent-brand"
        className="h-auto max-w-[50%] justify-end py-3"
      >
        <span className="flex min-w-0 flex-col items-end text-end">
          <span className="text-xs font-medium opacity-80">{nextLabel}</span>
          <span className="truncate font-semibold">{t(next.titleKey)}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
      </Button>
    </nav>
  );
}
