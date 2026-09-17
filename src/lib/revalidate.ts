import "server-only";
import { revalidatePath } from "next/cache";
import { categoryIds, locales } from "@/lib/products";

/**
 * Drops every cached storefront page that shows catalog data: home carousel,
 * catalog, the per-category catalogs and every product page. Called after an
 * admin edits the catalog and after a payment moves stock — without the
 * product pages in this list, a sold-out size stayed clickable (and
 * `schema.org/InStock`) for up to an hour after the last unit sold.
 *
 * Public pages live under /[locale], so "/" and "/catalog" alone would never
 * match — every locale is named explicitly. The dynamic routes are
 * invalidated by pattern, which covers every id in every locale at once.
 */
export function revalidateStorefront() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/catalog`);
    for (const category of categoryIds) {
      revalidatePath(`/${locale}/catalog/${category}`);
    }
  }
  revalidatePath("/[locale]/product/[id]", "page");
}
