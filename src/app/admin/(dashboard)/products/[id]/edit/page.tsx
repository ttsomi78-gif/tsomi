import { notFound } from "next/navigation";
import {
  getImagesForProduct,
  getProductById,
  getVariantsForProduct,
} from "@/db/queries";
import { tetriToGel } from "@/lib/money";
import { ProductForm } from "../../product-form";
import { ColorsEditor } from "../../colors-editor";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getProductById(id);
  if (!row) notFound();
  const [variants, images] = await Promise.all([
    getVariantsForProduct(id),
    getImagesForProduct(id),
  ]);

  // Group the flat variant rows into one block per color for the editor.
  const colorOrder: string[] = [];
  const byColor = new Map<
    string,
    { colorHex: string; sizes: { size: string | null; stock: number }[] }
  >();
  for (const variant of variants) {
    const name = variant.colorName ?? "";
    if (!byColor.has(name)) {
      colorOrder.push(name);
      byColor.set(name, { colorHex: variant.colorHex ?? "#27211a", sizes: [] });
    }
    byColor.get(name)!.sizes.push({ size: variant.size, stock: variant.stock });
  }

  const colors = colorOrder
    .filter((name) => name !== "")
    .map((name) => ({
      colorName: name,
      colorHex: byColor.get(name)!.colorHex,
      sizes: byColor.get(name)!.sizes,
      images: images
        .filter((image) => image.colorName === name)
        .map((image) => ({
          id: image.id,
          url: image.url,
          colorName: image.colorName,
        })),
      draft: false,
    }));

  const sharedImages = images
    .filter((image) => image.colorName === null)
    .map((image) => ({ id: image.id, url: image.url, colorName: image.colorName }));

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl uppercase tracking-wide">
        Edit product
      </h1>
      <ProductForm
        stockManagedByColors={variants.length > 0}
        product={{
          id: row.id,
          nameEn: row.nameEn,
          nameRu: row.nameRu,
          nameKa: row.nameKa,
          nameJa: row.nameJa,
          price: tetriToGel(row.priceTetri),
          category: row.category,
          image: row.imageUrl,
          hoverImage: row.hoverImageUrl ?? undefined,
          altEn: row.altEn,
          altRu: row.altRu,
          altKa: row.altKa,
          altJa: row.altJa,
          tagEn: row.tagEn,
          tagRu: row.tagRu,
          tagKa: row.tagKa,
          tagJa: row.tagJa,
          stock: row.stock,
        }}
      />
      <ColorsEditor productId={row.id} colors={colors} sharedImages={sharedImages} />
    </div>
  );
}
