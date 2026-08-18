import Link from "next/link";
import { notFound } from "next/navigation";
import { formatGel, tetriToGel } from "@/lib/money";
import { getOrderWithItems } from "@/db/queries";
import type { OrderStatus } from "@/db/schema";

const STATUS_STYLES: Record<OrderStatus, string> = {
  paid: "border-green text-green",
  pending: "border-gold text-gold",
  failed: "border-brick text-brick",
  expired: "border-tan/70 text-ink/45",
  refunded: "border-terracotta text-terracotta",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tbilisi",
});

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderWithItems(id);
  if (!result) notFound();

  const { order, items } = result;

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/orders"
        className="text-sm font-semibold text-ink/50 underline decoration-2 underline-offset-4 hover:text-terracotta"
      >
        ← All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl uppercase tracking-wide">Order</h1>
        <span
          className={`rounded-full border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[order.status]}`}
        >
          {order.status}
        </span>
      </div>
      <p className="mt-1 font-mono text-xs text-ink/45">{order.id}</p>

      {order.failureReason && (
        <p className="mt-4 rounded-2xl bg-brick/10 px-4 py-3 text-sm font-medium text-brick">
          {order.failureReason}
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Panel title="Customer">
          <Row label="Name" value={order.customerName} />
          <Row label="Email" value={order.customerEmail} />
          <Row label="Phone" value={order.customerPhone} />
          <Row label="Language" value={order.locale.toUpperCase()} />
        </Panel>

        <Panel title="Delivery">
          <Row label="City" value={order.shippingCity} />
          <Row label="Address" value={order.shippingAddress} />
          {order.shippingNote && <Row label="Note" value={order.shippingNote} />}
        </Panel>

        <Panel title="Payment">
          <Row label="Method" value={order.paymentMethod ?? "—"} />
          <Row label="Transaction" value={order.transactionId ?? "—"} mono />
          <Row label="BOG order" value={order.bogOrderId ?? "—"} mono />
          <Row
            label="Stock deducted"
            value={order.stockApplied ? "Yes" : "No"}
          />
        </Panel>

        <Panel title="Timeline">
          <Row label="Placed" value={dateFormat.format(order.createdAt)} />
          <Row
            label="Paid"
            value={order.paidAt ? dateFormat.format(order.paidAt) : "—"}
          />
          <Row
            label="Failed"
            value={order.failedAt ? dateFormat.format(order.failedAt) : "—"}
          />
          <Row label="Expires" value={dateFormat.format(order.expiresAt)} />
        </Panel>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-tan/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-blush text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-tan/60">
                <td className="px-4 py-3">
                  <span className="font-semibold">{item.name}</span>
                  {item.productId ? (
                    <Link
                      href={`/admin/products/${item.productId}/edit`}
                      className="block text-xs text-ink/45 underline decoration-2 underline-offset-2 hover:text-terracotta"
                    >
                      {item.productId}
                    </Link>
                  ) : (
                    <span className="block text-xs text-ink/35">
                      product since deleted
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {formatGel(tetriToGel(item.unitPriceTetri))} ₾
                </td>
                <td className="px-4 py-3 tabular-nums">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatGel(tetriToGel(item.totalTetri))} ₾
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-tan/60 bg-sand/40">
            <tr>
              <td colSpan={3} className="px-4 py-2 text-ink/55">
                Items
              </td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatGel(tetriToGel(order.itemsTetri))} ₾
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-2 text-ink/55">
                Delivery
              </td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatGel(tetriToGel(order.deliveryTetri))} ₾
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-3 font-bold">
                Total
              </td>
              <td className="px-4 py-3 text-right font-display text-lg text-terracotta tabular-nums">
                {formatGel(tetriToGel(order.totalTetri))} ₾
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-tan/60 p-5">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/45">
        {title}
      </h2>
      <dl className="space-y-2 text-sm">{children}</dl>
    </section>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-between gap-x-3">
      <dt className="text-ink/50">{label}</dt>
      <dd
        className={`text-right ${mono ? "break-all font-mono text-xs" : "font-medium"}`}
      >
        {value}
      </dd>
    </div>
  );
}
