import { CatalogPageContent } from "./catalog-page";
import { buildPageMetadata } from "@/lib/seo";
import type { LocaleId } from "@/lib/products";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  return buildPageMetadata("catalog", locale, "/catalog");
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: LocaleId }>;
}) {
  const { locale } = await params;
  return <CatalogPageContent locale={locale} />;
}
