import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPageContent } from "../catalog-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildPageMetadata } from "@/lib/seo";
import { isCategoryId, type LocaleId } from "@/lib/products";

export const revalidate = 3600;

/**
 * `/[locale]/catalog/accessories` etc. — a linkable, indexable entry into one
 * category. Same page as the catalog with that pill preselected.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isCategoryId(category)) return { title: "Not found" };

  const dict = await getDictionary(locale);
  const base = buildPageMetadata("catalog", locale, `/catalog/${category}`);
  const title = dict.catalog.categories[category];
  return {
    ...base,
    title,
    openGraph: { ...base.openGraph, title },
  };
}

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ locale: LocaleId; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isCategoryId(category)) notFound();
  return <CatalogPageContent locale={locale} category={category} />;
}
