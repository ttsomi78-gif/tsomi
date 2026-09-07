import Link from "next/link";
import { formatGel, tetriToGel } from "@/lib/money";
import { getOrderStats, getOrdersForAdmin } from "@/db/queries";
import { expireStaleOrders } from "@/lib/orders";
import type { OrderStatus } from "@/db/schema";

const STATUSES: OrderStatus[] = ["pending", "paid", "failed", "expired", "refunded"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-500",
  refunded: "bg-blue-100 text-blue-700",
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
      <h1 className="mb-2 text-xl font-semibold tracking-tight">Orders</h1>

      <p className="mb-5 text-sm text-gray-500">
        {stats.total} total · <span className="text-emerald-600">{stats.paid} paid</span> ·{" "}
        <span className="text-amber-600">{stats.pending} pending</span> ·{" "}
        <span className="text-gray-400">{stats.unsuccessful} unsuccessful</span> ·{" "}
        <span className="font-semibold text-gray-900">
          {formatGel(tetriToGel(stats.revenueTetri))} ₾ collected
        </span>
      </p>

      <div className="mb-5 flex flex-wrap gap-1.5">
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
        <p className="text-sm text-gray-500">No orders here yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
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
                  <tr key={order.id} className="border-t border-gray-100 transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {dateFormat.format(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{order.customerName}</span>
                      <span className="block text-xs text-gray-400">
                        {order.customerEmail}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.shippingCity}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums">
                      {formatGel(tetriToGel(order.totalTetri))} ₾
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
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
              <span className="text-gray-500">
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
      className={`rounded-lg px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900"
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
    return <span className="text-gray-300">{children}</span>;
  }
  return (
    <Link href={href} className="font-medium text-gray-600 hover:text-gray-900">
      {children}
    </Link>
  );
}
