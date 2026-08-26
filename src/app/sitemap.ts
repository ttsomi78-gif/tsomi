import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getActiveProducts } from "@/db/queries";
import { getSiteUrl } from "@/lib/site";

// Rendered per request so SITE_URL is read from the runtime environment,
// not baked in at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Product pages are the best-converting search entries a shop has.
  let productIds: string[] = [];
  try {
    productIds = (await getActiveProducts()).map((product) => product.id);
  } catch {
    // Database briefly unreachable — serve the static pages rather than 500.
  }

  return locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      changeFrequency: "weekly" as const,
      priority: locale === "en" ? 1 : 0.8,
    },
    {
      url: `${siteUrl}/${locale}/catalog`,
      changeFrequency: "weekly" as const,
      priority: locale === "en" ? 0.9 : 0.7,
    },
    {
      url: `${siteUrl}/${locale}/history`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...(["shipping", "terms", "privacy", "contact"] as const).map((slug) => ({
      url: `${siteUrl}/${locale}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    ...productIds.map((id) => ({
      url: `${siteUrl}/${locale}/product/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]);
}
