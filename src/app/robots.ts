import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

// Rendered per request so SITE_URL is read from the runtime environment,
// not baked in at build time.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Checkout and order-status pages are per-customer; indexing them would
      // be useless at best and a privacy leak at worst.
      disallow: ["/admin", "/api/", "/*/checkout", "/*/order/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
