import { notFound } from "next/navigation";
import {
  PUBLIC_CATEGORIES,
  isAssetCategory,
} from "@/contexts/brand-assets/domain/models/asset-category.model";
import { BrandCategoryView } from "@/ui/brand-assets/views/BrandCategoryView";

export function generateStaticParams() {
  return PUBLIC_CATEGORIES.map((category) => ({ category }));
}

export default async function BrandCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isAssetCategory(category) || !PUBLIC_CATEGORIES.includes(category)) {
    notFound();
  }
  return <BrandCategoryView category={category} />;
}
