import { notFound } from "next/navigation";
import { getProductById } from "@/db/queries";
import { tetriToGel } from "@/lib/money";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getProductById(id);
  if (!row) notFound();

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
    </div>
  );
}
