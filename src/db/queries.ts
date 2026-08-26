import "server-only";
import { asc, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "./client";
import {
  orderItems,
  orders,
  products,
  productVariants,
  type OrderStatus,
  type ProductRow,
  type ProductVariantRow,
} from "./schema";
import { tetriToGel } from "@/lib/money";
import {
  resolveLocalized,
  type LocaleId,
  type Product,
  type ProductVariant,
} from "@/lib/products";

function toVariant(row: ProductVariantRow): ProductVariant {
  return {
    id: row.id,
    colorName: row.colorName,
    colorHex: row.colorHex,
    size: row.size,
    stock: row.stock,
  };
}

function toProduct(
  row: ProductRow,
  locale: LocaleId = "en",
  variants: ProductVariant[] = [],
): Product {
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
    variants,
  };
}

/** All variant rows for a set of products, grouped by product id. */
async function variantsByProduct(
  productIds: string[],
): Promise<Map<string, ProductVariant[]>> {
  if (productIds.length === 0) return new Map();
  const rows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, productIds))
    .orderBy(asc(productVariants.sortOrder), asc(productVariants.id));
  const grouped = new Map<string, ProductVariant[]>();
  for (const row of rows) {
    const list = grouped.get(row.productId) ?? [];
    list.push(toVariant(row));
    grouped.set(row.productId, list);
  }
  return grouped;
}

/** Public catalog + homepage — only active products, in manual display order. */
export async function getActiveProducts(locale: LocaleId = "en"): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sortOrder), asc(products.createdAt));
  const variants = await variantsByProduct(rows.map((row) => row.id));
  return rows.map((row) => toProduct(row, locale, variants.get(row.id) ?? []));
}

/** Admin dashboard — every product, active or hidden. */
export async function getAllProductsForAdmin(): Promise<
  (Product & { isActive: boolean })[]
> {
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.createdAt));
  const variants = await variantsByProduct(rows.map((row) => row.id));
  return rows.map((row) => ({
    ...toProduct(row, "en", variants.get(row.id) ?? []),
    isActive: row.isActive,
  }));
}

/** Variant rows of one product, in display order — for the admin editor. */
export async function getVariantsForProduct(
  productId: string,
): Promise<ProductVariantRow[]> {
  return db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.sortOrder), asc(productVariants.id));
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

const ORDERS_PAGE_SIZE = 25;

/** Admin orders list — newest first, optionally narrowed to one status. */
export async function getOrdersForAdmin(
  options: { status?: OrderStatus; page?: number } = {},
) {
  const page = Math.max(1, options.page ?? 1);
  const where = options.status ? eq(orders.status, options.status) : undefined;

  const [rows, [totals]] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(ORDERS_PAGE_SIZE)
      .offset((page - 1) * ORDERS_PAGE_SIZE),
    db.select({ value: count() }).from(orders).where(where),
  ]);

  const total = totals?.value ?? 0;
  return {
    rows,
    total,
    page,
    pageSize: ORDERS_PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / ORDERS_PAGE_SIZE)),
  };
}

/**
 * Counts and takings for the admin header. Scans the table like
 * `getProductStats` does — fine at this shop's size, and worth revisiting only
 * once orders run to five figures.
 */
export async function getOrderStats() {
  const rows = await db
    .select({ status: orders.status, totalTetri: orders.totalTetri })
    .from(orders);

  const paid = rows.filter((row) => row.status === "paid");
  return {
    total: rows.length,
    paid: paid.length,
    pending: rows.filter((row) => row.status === "pending").length,
    unsuccessful: rows.filter(
      (row) => row.status === "failed" || row.status === "expired",
    ).length,
    revenueTetri: paid.reduce((sum, row) => sum + row.totalTetri, 0),
  };
}

export async function getOrderWithItems(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));
  return { order, items };
}
