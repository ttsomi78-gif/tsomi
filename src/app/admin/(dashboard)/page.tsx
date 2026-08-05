import Link from "next/link";
import { getProductStats } from "@/db/queries";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
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
  const stats = await getProductStats();

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-wide">
        Dashboard
      </h1>
      <p className="mt-1 text-ink/60">Overview of your TSOMI catalog.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total products" value={stats.total} accent="text-ink" />
        <StatCard label="Active" value={stats.active} accent="text-green" />
        <StatCard label="Hidden" value={stats.hidden} accent="text-ink/40" />
        <StatCard label="Tees" value={stats.tees} accent="text-terracotta" />
        <StatCard label="Bags" value={stats.bags} accent="text-gold" />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-tan/60 bg-white/50 p-6">
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
    </div>
  );
}
