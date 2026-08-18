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
    <div className="rounded-2xl border border-tan/60 bg-white/50 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
        {label}
      </p>
      <p className={`mt-2 font-display text-4xl ${accent}`}>{value}</p>
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
      <h1 className="font-display text-3xl uppercase tracking-wide">
        Dashboard
      </h1>
      <p className="mt-1 text-ink/60">Overview of your TSOMI shop.</p>

      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-ink/45">
        Sales
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Collected"
          value={`${formatGel(tetriToGel(orderStats.revenueTetri))} ₾`}
          accent="text-green"
        />
        <StatCard label="Paid orders" value={orderStats.paid} accent="text-ink" />
        <StatCard label="Pending" value={orderStats.pending} accent="text-gold" />
        <StatCard
          label="Unsuccessful"
          value={orderStats.unsuccessful}
          accent="text-ink/40"
        />
      </div>

      <h2 className="mt-10 text-xs font-bold uppercase tracking-widest text-ink/45">
        Catalog
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total products" value={stats.total} accent="text-ink" />
        <StatCard label="Active" value={stats.active} accent="text-green" />
        <StatCard label="Hidden" value={stats.hidden} accent="text-ink/40" />
        <StatCard label="Tees" value={stats.tees} accent="text-terracotta" />
        <StatCard label="Bags" value={stats.bags} accent="text-gold" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-tan/60 bg-white/50 p-6">
          <div>
            <p className="font-semibold">Manage your catalog</p>
            <p className="text-sm text-ink/60">
              Add, edit, hide, or delete products from the storefront.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="ml-auto rounded-full bg-yolk px-5 py-2 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold"
          >
            Go to products
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-tan/60 bg-white/50 p-6">
          <div>
            <p className="font-semibold">Fulfil orders</p>
            <p className="text-sm text-ink/60">
              Review payments, addresses, and what needs shipping.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="ml-auto rounded-full bg-yolk px-5 py-2 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold"
          >
            Go to orders
          </Link>
        </div>
      </div>
    </div>
  );
}
