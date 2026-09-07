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
        <h1 className="text-xl font-semibold tracking-tight">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          Add product
        </Link>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        {products.length} {products.length === 1 ? "product" : "products"} ·{" "}
        <span className="text-emerald-600">{activeCount} active</span> ·{" "}
        <span className="text-gray-400">{hiddenCount} hidden</span>
      </p>

      {products.length === 0 ? (
        <p className="text-sm text-gray-500">No products yet — create the first one.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
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
                <tr key={product.id} className="border-t border-gray-100 transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-4 py-3">{formatGel(product.price)} ₾</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.stock === 0
                          ? "font-medium text-red-600"
                          : product.stock <= 5
                            ? "font-medium text-amber-600"
                            : "text-gray-600"
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
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
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
