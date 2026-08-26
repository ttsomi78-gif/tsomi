import { notFound } from "next/navigation";
import {
  getImagesForProduct,
  getProductById,
  getVariantsForProduct,
} from "@/db/queries";
import { tetriToGel } from "@/lib/money";
import { ProductForm } from "../../product-form";
import { VariantsEditor } from "../../variants-editor";
import { ImagesEditor } from "../../images-editor";

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
  const colorNames = [
    ...new Set(
      variants
        .map((variant) => variant.colorName)
        .filter((name): name is string => !!name),
    ),
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl uppercase tracking-wide">
        Edit product
      </h1>
      <ProductForm
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
      <VariantsEditor
        productId={row.id}
        initial={variants.map((variant) => ({
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          size: variant.size,
          stock: variant.stock,
        }))}
      />
      <ImagesEditor
        productId={row.id}
        images={images.map((image) => ({
          id: image.id,
          url: image.url,
          colorName: image.colorName,
        }))}
        colorNames={colorNames}
      />
    </div>
  );
}
