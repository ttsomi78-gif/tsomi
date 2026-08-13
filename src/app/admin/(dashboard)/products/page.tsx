import Link from "next/link";
import Image from "next/image";
import { formatGel } from "@/lib/money";
import { getAllProductsForAdmin } from "@/db/queries";
import { toggleActive } from "./actions";
import { DeleteButton } from "./delete-button";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();
  const activeCount = products.filter((p) => p.isActive).length;
  const hiddenCount = products.length - activeCount;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl uppercase tracking-wide">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-yolk px-5 py-2 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold"
        >
          + New product
        </Link>
      </div>

      <p className="mb-8 text-sm text-ink/60">
        {products.length} {products.length === 1 ? "product" : "products"} ·{" "}
        <span className="text-green">{activeCount} active</span> ·{" "}
        <span className="text-ink/50">{hiddenCount} hidden</span>
      </p>

      {products.length === 0 ? (
        <p className="text-ink/60">No products yet — create the first one.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-tan/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-blush text-xs uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-tan/60">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-sand">
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className="px-4 py-3 capitalize text-ink/70">
                    {product.category}
                  </td>
                  <td className="px-4 py-3">{formatGel(product.price)} ₾</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.stock === 0
                          ? "font-semibold text-brick"
                          : product.stock <= 5
                            ? "font-semibold text-gold"
                            : "text-ink/70"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={product.id} />
                      <input
                        type="hidden"
                        name="isActive"
                        value={String(product.isActive)}
                      />
                      <button
                        type="submit"
                        className={`rounded-full border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors ${
                          product.isActive
                            ? "border-green text-green hover:bg-green hover:text-cream"
                            : "border-tan/60 text-ink/50 hover:border-ink hover:text-ink"
                        }`}
                      >
                        {product.isActive ? "Active" : "Hidden"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-semibold underline decoration-2 underline-offset-4 hover:text-terracotta"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
