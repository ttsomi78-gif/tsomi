"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { and, asc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { products, productImages, productVariants } from "@/db/schema";
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
  // maintained by saveColor and the payment settle. A number typed into
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

/** Re-derives products.stock as the variant sum. Call inside the transaction. */
async function syncProductStock(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  productId: string,
) {
  const rows = await tx
    .select({ stock: productVariants.stock })
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
  if (rows.length === 0) return; // no variants left — flat stock owns itself again
  await tx
    .update(products)
    .set({
      stock: rows.reduce((sum, row) => sum + row.stock, 0),
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));
}

const colorSaveSchema = z.object({
  colorName: z.string().trim().min(1).max(40),
  colorHex: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/),
  sizes: z
    .array(
      z.object({
        size: z
          .string()
          .trim()
          .max(20)
          .transform((value) => value || null),
        stock: z.coerce.number().int().min(0).max(100000),
      }),
    )
    .min(1)
    .max(20),
});

export type ColorFormState = { error?: string; saved?: boolean } | undefined;

/**
 * The one-stop per-color save: replaces every size row of ONE color and
 * updates the product total. `previousName` carries renames — its rows are
 * the ones being replaced.
 */
export async function saveColor(
  productId: string,
  previousName: string | null,
  _prevState: ColorFormState,
  formData: FormData,
): Promise<ColorFormState> {
  await requireAdminSession();

  const existing = await getProductById(productId);
  if (!existing) return { error: "Product not found" };

  let parsed: z.infer<typeof colorSaveSchema>;
  try {
    parsed = colorSaveSchema.parse(JSON.parse(String(formData.get("color") ?? "")));
  } catch {
    return { error: "Fill in the color name and at least one size row" };
  }

  // A blank size means "one size" — it only makes sense as the color's sole row.
  const blankRows = parsed.sizes.filter((row) => !row.size).length;
  if (blankRows > 0 && parsed.sizes.length > 1) {
    return { error: 'A "one size" row must be the only row of its color' };
  }
  const sizeSet = new Set(parsed.sizes.map((row) => row.size ?? ""));
  if (sizeSet.size !== parsed.sizes.length) {
    return { error: "Duplicate size in this color" };
  }

  try {
    await db.transaction(async (tx) => {
      // Replace this color's rows only — other colors are untouched.
      for (const name of new Set(
        [previousName, parsed.colorName].filter((n): n is string => !!n),
      )) {
        await tx
          .delete(productVariants)
          .where(
            and(
              eq(productVariants.productId, productId),
              eq(productVariants.colorName, name),
            ),
          );
      }

      const [maxRow] = await tx
        .select({ max: sql<number>`coalesce(max(${productVariants.sortOrder}), -1)` })
        .from(productVariants)
        .where(eq(productVariants.productId, productId));
      let order = (maxRow?.max ?? -1) + 1;

      await tx.insert(productVariants).values(
        parsed.sizes.map((row) => ({
          id: randomUUID(),
          productId,
          colorName: parsed.colorName,
          colorHex: parsed.colorHex,
          size: row.size,
          stock: row.stock,
          sortOrder: order++,
        })),
      );

      // A rename carries the color's photos along.
      if (previousName && previousName !== parsed.colorName) {
        await tx
          .update(productImages)
          .set({ colorName: parsed.colorName })
          .where(
            and(
              eq(productImages.productId, productId),
              eq(productImages.colorName, previousName),
            ),
          );
      }

      await syncProductStock(tx, productId);
    });
  } catch {
    return { error: "Could not save — try again" };
  }

  revalidatePublicPages();
  revalidatePath(`/admin/products/${productId}/edit`);
  return { saved: true };
}

/**
 * Removes a color: its size rows go, its photos stay but become "all colors"
 * so no uploaded file is ever lost by this button.
 */
export async function removeColor(productId: string, colorName: string) {
  await requireAdminSession();

  await db.transaction(async (tx) => {
    await tx
      .delete(productVariants)
      .where(
        and(
          eq(productVariants.productId, productId),
          eq(productVariants.colorName, colorName),
        ),
      );
    await tx
      .update(productImages)
      .set({ colorName: null })
      .where(
        and(
          eq(productImages.productId, productId),
          eq(productImages.colorName, colorName),
        ),
      );
    await syncProductStock(tx, productId);
  });

  revalidatePublicPages();
  revalidatePath(`/admin/products/${productId}/edit`);
}

export type ImagesFormState = { error?: string; saved?: boolean } | undefined;

const MAX_GALLERY_UPLOADS = 8;

/**
 * Adds gallery images to a product, all assigned to one color (or to "all
 * colors" when colorName is empty). Multiple files per call.
 */
export async function addProductImages(
  productId: string,
  _prevState: ImagesFormState,
  formData: FormData,
): Promise<ImagesFormState> {
  await requireAdminSession();

  const existing = await getProductById(productId);
  if (!existing) return { error: "Product not found" };

  const colorName = String(formData.get("colorName") ?? "").trim() || null;
  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) return { error: "Choose at least one image" };
  if (files.length > MAX_GALLERY_UPLOADS) {
    return { error: `At most ${MAX_GALLERY_UPLOADS} images per upload` };
  }

  const current = await db
    .select({ sortOrder: productImages.sortOrder })
    .from(productImages)
    .where(eq(productImages.productId, productId));
  let nextOrder =
    current.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;

  // Upload sequentially and remember what landed, so a failure mid-batch can
  // report cleanly while the already-inserted images simply remain.
  for (const file of files) {
    let url: string;
    try {
      url = await uploadProductImage(file);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Image upload failed",
      };
    }
    await db.insert(productImages).values({
      id: randomUUID(),
      productId,
      url,
      colorName,
      sortOrder: nextOrder++,
    });
  }

  revalidatePublicPages();
  revalidatePath(`/admin/products/${productId}/edit`);
  return { saved: true };
}

export async function deleteProductImage(productId: string, imageId: string) {
  await requireAdminSession();

  const [row] = await db
    .select()
    .from(productImages)
    .where(eq(productImages.id, imageId))
    .limit(1);
  if (!row || row.productId !== productId) return;

  await db.delete(productImages).where(eq(productImages.id, imageId));
  await deleteProductImageByUrl(row.url);

  revalidatePublicPages();
  revalidatePath(`/admin/products/${productId}/edit`);
}

/** Reassigns one gallery image to a different color (empty = all colors). */
export async function setProductImageColor(
  productId: string,
  imageId: string,
  colorName: string,
) {
  await requireAdminSession();

  await db
    .update(productImages)
    .set({ colorName: colorName.trim() || null })
    .where(eq(productImages.id, imageId));

  revalidatePublicPages();
  revalidatePath(`/admin/products/${productId}/edit`);
}

/** Swaps a gallery image with its neighbour — first image is the lead shot. */
export async function moveProductImage(
  productId: string,
  imageId: string,
  direction: "up" | "down",
) {
  await requireAdminSession();

  const rows = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.sortOrder), asc(productImages.id));

  const index = rows.findIndex((row) => row.id === imageId);
  const neighbour = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || neighbour < 0 || neighbour >= rows.length) return;

  // Renumber the whole list — repairs any duplicate sortOrders while swapping.
  const reordered = [...rows];
  [reordered[index], reordered[neighbour]] = [reordered[neighbour], reordered[index]];
  await db.transaction(async (tx) => {
    for (let i = 0; i < reordered.length; i++) {
      await tx
        .update(productImages)
        .set({ sortOrder: i })
        .where(eq(productImages.id, reordered[i].id));
    }
  });

  revalidatePublicPages();
  revalidatePath(`/admin/products/${productId}/edit`);
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
