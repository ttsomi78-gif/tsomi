import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getSiteUrl } from "@/lib/site";

// Rendered per request so SITE_URL is read from the runtime environment,
// not baked in at build time.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
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
    ...(["shipping", "terms", "privacy", "contact"] as const).map((slug) => ({
      url: `${siteUrl}/${locale}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ]);
}
