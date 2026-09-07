import Link from "next/link";
import { getOrderStats, getProductStats } from "@/db/queries";
import { formatGel, tetriToGel } from "@/lib/money";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-[13px] font-medium text-gray-500">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold tracking-tight ${accent}`}>
        {value}
      </p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [stats, orderStats] = await Promise.all([
    getProductStats(),
    getOrderStats(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your TSOMI shop.</p>

      <h2 className="mt-8 text-[13px] font-semibold text-gray-500">Sales</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Collected"
          value={`${formatGel(tetriToGel(orderStats.revenueTetri))} ₾`}
          accent="text-emerald-600"
        />
        <StatCard label="Paid orders" value={orderStats.paid} accent="text-gray-900" />
        <StatCard label="Pending" value={orderStats.pending} accent="text-amber-600" />
        <StatCard
          label="Unsuccessful"
          value={orderStats.unsuccessful}
          accent="text-gray-400"
        />
      </div>

      <h2 className="mt-8 text-[13px] font-semibold text-gray-500">Catalog</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total products" value={stats.total} accent="text-gray-900" />
        <StatCard label="Active" value={stats.active} accent="text-emerald-600" />
        <StatCard label="Hidden" value={stats.hidden} accent="text-gray-400" />
        <StatCard label="Tees" value={stats.tees} accent="text-gray-900" />
        <StatCard label="Bags" value={stats.bags} accent="text-amber-600" />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold">Manage your catalog</p>
            <p className="text-sm text-gray-500">
              Add, edit, hide, or delete products from the storefront.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="ml-auto rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Go to products
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold">Fulfil orders</p>
            <p className="text-sm text-gray-500">
              Review payments, addresses, and what needs shipping.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="ml-auto rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Go to orders
          </Link>
        </div>
      </div>
    </div>
  );
}
