import { GuidelinePagePager } from "@/ui/branding/components/guideline-page-pager";

export default function BrandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GuidelinePagePager />
    </>
  );
}
