"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { products, productVariants } from "@/db/schema";
import { getProductById } from "@/db/queries";
import { requireAdminSession } from "@/lib/session";
import { uploadProductImage, deleteProductImageByUrl } from "@/lib/storage";
import { gelToTetri } from "@/lib/money";
import { slugify } from "@/lib/slug";
import { locales } from "@/lib/products";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const productSchema = z.object({
  nameEn: z.string().trim().min(1, "English name is required"),
  nameRu: optionalText,
  nameKa: optionalText,
  nameJa: optionalText,
  category: z.enum(["tees", "bags"]),
  price: z.coerce.number().positive("Price must be greater than 0"),
  altEn: z.string().trim().min(1, "English alt text is required"),
  altRu: optionalText,
  altKa: optionalText,
  altJa: optionalText,
  tagEn: optionalText,
  tagRu: optionalText,
  tagKa: optionalText,
  tagJa: optionalText,
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock can't be negative"),
});

export type ProductFormState = { error?: string } | undefined;

function revalidatePublicPages() {
  // The public pages live under /[locale], so "/" and "/catalog" alone
  // would never match — every locale has to be revalidated explicitly.
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/catalog`);
  }
  revalidatePath("/admin/products");
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function fileOrNull(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdminSession();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const imageFile = fileOrNull(formData.get("image"));
  if (!imageFile) return { error: "A product photo is required" };
  const hoverFile = fileOrNull(formData.get("hoverImage"));

  const {
    nameEn, nameRu, nameKa, nameJa,
    category, price,
    altEn, altRu, altKa, altJa,
    tagEn, tagRu, tagKa, tagJa,
    stock,
  } = parsed.data;
  const id = slugify(nameEn);
  if (!id) return { error: "Name must contain at least one letter or number" };

  const imageUrl = await uploadProductImage(imageFile);
  const hoverImageUrl = hoverFile ? await uploadProductImage(hoverFile) : null;

  try {
    await db.insert(products).values({
      id,
      nameEn, nameRu: nameRu ?? null, nameKa: nameKa ?? null, nameJa: nameJa ?? null,
      category,
      priceTetri: gelToTetri(price),
      imageUrl,
      hoverImageUrl,
      altEn, altRu: altRu ?? null, altKa: altKa ?? null, altJa: altJa ?? null,
      tagEn: tagEn ?? null, tagRu: tagRu ?? null, tagKa: tagKa ?? null, tagJa: tagJa ?? null,
      stock,
    });
  } catch (error) {
    await deleteProductImageByUrl(imageUrl);
    await deleteProductImageByUrl(hoverImageUrl);
    if (isUniqueViolation(error)) {
      return { error: `A product with a matching name/id ("${id}") already exists` };
    }
    throw error;
  }

  revalidatePublicPages();
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdminSession();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await getProductById(id);
  if (!existing) return { error: "Product not found" };

  const imageFile = fileOrNull(formData.get("image"));
  const hoverFile = fileOrNull(formData.get("hoverImage"));

  const imageUrl = imageFile ? await uploadProductImage(imageFile) : existing.imageUrl;
  const hoverImageUrl = hoverFile
    ? await uploadProductImage(hoverFile)
    : existing.hoverImageUrl;

  const {
    nameEn, nameRu, nameKa, nameJa,
    category, price,
    altEn, altRu, altKa, altJa,
    tagEn, tagRu, tagKa, tagJa,
    stock,
  } = parsed.data;

  // Once variants exist they own the stock — products.stock is their sum,
  // maintained by saveVariants and the payment settle. A number typed into
  // the plain form field must not silently overwrite it.
  const variantRows = await db
    .select({ id: productVariants.id })
    .from(productVariants)
    .where(eq(productVariants.productId, id))
    .limit(1);
  const hasVariants = variantRows.length > 0;

  await db
    .update(products)
    .set({
      nameEn, nameRu: nameRu ?? null, nameKa: nameKa ?? null, nameJa: nameJa ?? null,
      category,
      priceTetri: gelToTetri(price),
      imageUrl,
      hoverImageUrl,
      altEn, altRu: altRu ?? null, altKa: altKa ?? null, altJa: altJa ?? null,
      tagEn: tagEn ?? null, tagRu: tagRu ?? null, tagKa: tagKa ?? null, tagJa: tagJa ?? null,
      ...(hasVariants ? {} : { stock }),
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  if (imageFile) await deleteProductImageByUrl(existing.imageUrl);
  if (hoverFile) await deleteProductImageByUrl(existing.hoverImageUrl);

  revalidatePublicPages();
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdminSession();

  const existing = await getProductById(id);
  await db.delete(products).where(eq(products.id, id));

  if (existing) {
    await deleteProductImageByUrl(existing.imageUrl);
    await deleteProductImageByUrl(existing.hoverImageUrl);
  }

  revalidatePublicPages();
}

const variantRowSchema = z.object({
  colorName: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => value || null),
  colorHex: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .or(z.literal(""))
    .transform((value) => value || null),
  size: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((value) => value || null),
  stock: z.coerce.number().int().min(0).max(100000),
});

const variantsSchema = z.array(variantRowSchema).max(60);

export type VariantsFormState = { error?: string; saved?: boolean } | undefined;

/**
 * Replaces a product's variant grid wholesale and re-derives the product's
 * total stock from it. Replace-all keeps the admin's mental model simple —
 * what's on screen after save IS the grid, nothing lingers.
 *
 * Existing order_items keep their color/size snapshot; their variant_id goes
 * null via ON DELETE SET NULL, which only disables re-decrementing stock for
 * an already-settled order — nothing customer-visible.
 */
export async function saveVariants(
  productId: string,
  _prevState: VariantsFormState,
  formData: FormData,
): Promise<VariantsFormState> {
  await requireAdminSession();

  const existing = await getProductById(productId);
  if (!existing) return { error: "Product not found" };

  let rows: z.infer<typeof variantsSchema>;
  try {
    rows = variantsSchema.parse(JSON.parse(String(formData.get("variants") ?? "[]")));
  } catch {
    return { error: "Invalid variant data" };
  }

  // A row with neither color nor size is only meaningful alone (one-size,
  // one-color product) — and then variants add nothing over flat stock.
  if (rows.length > 0 && rows.some((row) => !row.colorName && !row.size)) {
    return { error: "Every variant needs a color, a size, or both" };
  }

  const combos = new Set(
    rows.map((row) => `${row.colorName ?? ""}::${row.size ?? ""}`),
  );
  if (combos.size !== rows.length) {
    return { error: "Duplicate color/size combination" };
  }

  await db.transaction(async (tx) => {
    await tx.delete(productVariants).where(eq(productVariants.productId, productId));
    if (rows.length > 0) {
      await tx.insert(productVariants).values(
        rows.map((row, index) => ({
          id: randomUUID(),
          productId,
          colorName: row.colorName,
          colorHex: row.colorHex,
          size: row.size,
          stock: row.stock,
          sortOrder: index,
        })),
      );
      // products.stock stays the variant total so every existing sold-out
      // check and catalog badge keeps working.
      const total = rows.reduce((sum, row) => sum + row.stock, 0);
      await tx
        .update(products)
        .set({ stock: total, updatedAt: new Date() })
        .where(eq(products.id, productId));
    }
  });

  revalidatePublicPages();
  return { saved: true };
}

export async function toggleActive(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const currentlyActive = formData.get("isActive") === "true";
  if (!id) return;

  await db
    .update(products)
    .set({ isActive: !currentlyActive, updatedAt: new Date() })
    .where(eq(products.id, id));

  revalidatePublicPages();
}
