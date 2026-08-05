import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "./client";
import { products, type ProductRow } from "./schema";
import { tetriToGel } from "@/lib/money";
import { resolveLocalized, type LocaleId, type Product } from "@/lib/products";

function toProduct(row: ProductRow, locale: LocaleId = "en"): Product {
  const tag = resolveLocalized(
    { en: row.tagEn, ru: row.tagRu, ka: row.tagKa, ja: row.tagJa },
    locale,
  );
  return {
    id: row.id,
    name: resolveLocalized(
      { en: row.nameEn, ru: row.nameRu, ka: row.nameKa, ja: row.nameJa },
      locale,
    ),
    georgian: row.nameKa?.trim() || row.nameEn,
    price: tetriToGel(row.priceTetri),
    category: row.category,
    image: row.imageUrl,
    hoverImage: row.hoverImageUrl ?? undefined,
    alt: resolveLocalized(
      { en: row.altEn, ru: row.altRu, ka: row.altKa, ja: row.altJa },
      locale,
    ),
    tag: tag || undefined,
    stock: row.stock,
  };
}

/** Public catalog + homepage — only active products, in manual display order. */
export async function getActiveProducts(locale: LocaleId = "en"): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sortOrder), asc(products.createdAt));
  return rows.map((row) => toProduct(row, locale));
}

/** Admin dashboard — every product, active or hidden. */
export async function getAllProductsForAdmin(): Promise<
  (Product & { isActive: boolean })[]
> {
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.createdAt));
  return rows.map((row) => ({ ...toProduct(row), isActive: row.isActive }));
}

/** Admin sidebar + dashboard — cheap counts, no image/copy columns fetched. */
export async function getProductStats() {
  const rows = await db
    .select({ category: products.category, isActive: products.isActive })
    .from(products);

  return {
    total: rows.length,
    active: rows.filter((r) => r.isActive).length,
    hidden: rows.filter((r) => !r.isActive).length,
    tees: rows.filter((r) => r.category === "tees").length,
    bags: rows.filter((r) => r.category === "bags").length,
  };
}

export async function getProductById(id: string): Promise<ProductRow | null> {
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return row ?? null;
}
