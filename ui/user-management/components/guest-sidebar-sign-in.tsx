"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@k-lab/components";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

/** k-lab SidebarFooter has no data-sidebar hook — match its classes, plus a test hook. */
export function findSidebarFooters(root: ParentNode = document): Element[] {
  const hooked = Array.from(root.querySelectorAll("[data-sidebar='footer']"));
  const byClass = Array.from(
    root.querySelectorAll("div.border-t.border-sidebar-border.p-5"),
  );
  return Array.from(new Set([...hooked, ...byClass]));
}

function isSidebarCollapsed(footer: Element): boolean {
  return footer.closest("[data-collapsed]")?.getAttribute("data-collapsed") === "true";
}

type SidebarFooterTarget = { el: Element; collapsed: boolean };

/** Same recipe as library AppSidebarLink (`linkButtonClass` + collapsed icon rail). */
const expandedClassName =
  "inline-flex min-w-0 w-full h-10 px-4 justify-start items-center gap-3 overflow-hidden text-sm font-medium rounded-app-radius transition-all duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground";
const collapsedClassName =
  "inline-flex items-center justify-center rounded-app-radius transition-all duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground h-10 w-10";

export function GuestSidebarSignIn({ pathname }: { pathname: string }) {
  const t = useTranslations("shell");
  const [footers, setFooters] = React.useState<SidebarFooterTarget[]>([]);

  React.useLayoutEffect(() => {
    const sync = () => {
      const next = findSidebarFooters().map((el) => ({
        el,
        collapsed: isSidebarCollapsed(el),
      }));
      setFooters((prev) => {
        if (
          prev.length === next.length &&
          prev.every((item, i) => item.el === next[i].el && item.collapsed === next[i].collapsed)
        ) {
          return prev;
        }
        return next;
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-collapsed"],
    });
    return () => observer.disconnect();
  }, []);

  if (footers.length === 0) return null;

  const href = `/login?next=${encodeURIComponent(pathname)}`;
  const label = t("signIn");

  return (
    <>
      {footers.map((footer, index) => {
        const link = footer.collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href={href} aria-label={label} className={collapsedClassName}>
                  <LogIn className="h-5 w-5" aria-hidden />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <a href={href} className={expandedClassName}>
            <LogIn className="h-5 w-5 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start">
              {label}
            </span>
          </a>
        );

        return createPortal(
          <div data-kbrand-guest-sign-in className="w-full min-w-0">
            {link}
          </div>,
          footer.el,
          `kbrand-guest-sign-in-${index}`,
        );
      })}
    </>
  );
}
