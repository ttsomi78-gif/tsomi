"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { getProductById } from "@/db/queries";
import { requireAdminSession } from "@/lib/session";
import { uploadProductImage, deleteProductImageByUrl } from "@/lib/storage";
import { gelToTetri } from "@/lib/money";
import { slugify } from "@/lib/slug";

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
  revalidatePath("/");
  revalidatePath("/catalog");
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
      stock,
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
