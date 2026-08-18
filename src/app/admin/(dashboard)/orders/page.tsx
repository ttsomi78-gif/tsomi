import Link from "next/link";
import { formatGel, tetriToGel } from "@/lib/money";
import { getOrderStats, getOrdersForAdmin } from "@/db/queries";
import { expireStaleOrders } from "@/lib/orders";
import type { OrderStatus } from "@/db/schema";

const STATUSES: OrderStatus[] = ["pending", "paid", "failed", "expired", "refunded"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  paid: "border-green text-green",
  pending: "border-gold text-gold",
  failed: "border-brick text-brick",
  expired: "border-tan/70 text-ink/45",
  refunded: "border-terracotta text-terracotta",
};

/** The shop is in Tbilisi — showing the server's UTC clock would just confuse. */
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tbilisi",
});

function isOrderStatus(value: string | undefined): value is OrderStatus {
  return !!value && (STATUSES as string[]).includes(value);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status: rawStatus, page: rawPage } = await searchParams;

  // Abandoned checkouts never get a callback, so nothing else would ever move
  // them out of `pending`. Sweeping on view keeps this list honest.
  await expireStaleOrders();

  const status = isOrderStatus(rawStatus) ? rawStatus : undefined;
  const page = Number.parseInt(rawPage ?? "1", 10) || 1;

  const [{ rows, total, pageCount }, stats] = await Promise.all([
    getOrdersForAdmin({ status, page }),
    getOrderStats(),
  ]);

  function filterHref(next?: OrderStatus) {
    return next ? `/admin/orders?status=${next}` : "/admin/orders";
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl uppercase tracking-wide">Orders</h1>

      <p className="mb-6 text-sm text-ink/60">
        {stats.total} total · <span className="text-green">{stats.paid} paid</span> ·{" "}
        <span className="text-gold">{stats.pending} pending</span> ·{" "}
        <span className="text-ink/50">{stats.unsuccessful} unsuccessful</span> ·{" "}
        <span className="font-semibold text-ink">
          {formatGel(tetriToGel(stats.revenueTetri))} ₾ collected
        </span>
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterPill href={filterHref()} active={!status}>
          All
        </FilterPill>
        {STATUSES.map((value) => (
          <FilterPill
            key={value}
            href={filterHref(value)}
            active={status === value}
          >
            {value}
          </FilterPill>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-ink/60">No orders here yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-tan/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-blush text-xs uppercase tracking-wide text-ink/60">
                <tr>
                  <th className="px-4 py-3">Placed</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((order) => (
                  <tr key={order.id} className="border-t border-tan/60">
                    <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                      {dateFormat.format(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{order.customerName}</span>
                      <span className="block text-xs text-ink/50">
                        {order.customerEmail}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{order.shippingCity}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums">
                      {formatGel(tetriToGel(order.totalTetri))} ₾
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold underline decoration-2 underline-offset-4 hover:text-terracotta"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <nav className="mt-6 flex items-center justify-between text-sm">
              <PageLink
                href={`/admin/orders?${new URLSearchParams({ ...(status ? { status } : {}), page: String(page - 1) })}`}
                disabled={page <= 1}
              >
                ← Previous
              </PageLink>
              <span className="text-ink/50">
                Page {page} of {pageCount} · {total} orders
              </span>
              <PageLink
                href={`/admin/orders?${new URLSearchParams({ ...(status ? { status } : {}), page: String(page + 1) })}`}
                disabled={page >= pageCount}
              >
                Next →
              </PageLink>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wide capitalize transition-colors ${
        active
          ? "border-ink bg-ink text-cream"
          : "border-tan/60 text-ink/60 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return <span className="text-ink/25">{children}</span>;
  }
  return (
    <Link href={href} className="font-semibold hover:text-terracotta">
      {children}
    </Link>
  );
}
