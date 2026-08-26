"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "@k-lab/components";
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

export function GuestSidebarSignIn({ pathname }: { pathname: string }) {
  const t = useTranslations("shell");
  const [footers, setFooters] = React.useState<Element[]>([]);

  React.useLayoutEffect(() => {
    const sync = () => {
      const next = findSidebarFooters();
      setFooters((prev) => {
        if (
          prev.length === next.length &&
          prev.every((el, i) => el === next[i])
        ) {
          return prev;
        }
        return next;
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (footers.length === 0) return null;

  const href = `/login?next=${encodeURIComponent(pathname)}`;

  return (
    <>
      {footers.map((footer, index) =>
        createPortal(
          <div data-kbrand-guest-sign-in className="w-full">
            <Button
              variant="ghost"
              className="glass-item-overlay h-10 w-full justify-start gap-3"
              icon={<LogIn aria-hidden />}
              iconPosition="start"
              href={href}
            >
              {t("signIn")}
            </Button>
          </div>,
          footer,
          `kbrand-guest-sign-in-${index}`,
        ),
      )}
    </>
  );
}
