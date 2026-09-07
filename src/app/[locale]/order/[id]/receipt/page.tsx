import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintButton } from "./print-button";
import { getDictionary } from "@/i18n/get-dictionary";
import { getOrderById, getOrderItems } from "@/lib/orders";
import { formatGel, tetriToGel } from "@/lib/money";
import { colorLabel } from "@/lib/colors";
import { company } from "@/lib/company";
import type { LocaleId } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Receipt",
  robots: { index: false, follow: false },
};

/**
 * A standalone printable receipt — what was bought, for how much, and where
 * it's going. Deliberately free of site chrome so "Save as PDF" produces a
 * clean document. Only paid orders have one.
 */
export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ locale: LocaleId; id: string }>;
}) {
  const { locale, id } = await params;
  const order = await getOrderById(id);
  // A receipt exists only for money actually taken.
  if (!order || order.status !== "paid") notFound();

  const [items, dict] = await Promise.all([
    getOrderItems(order.id),
    getDictionary(locale),
  ]);

  const dateFormat = new Intl.DateTimeFormat(
    locale === "ka" ? "ka-GE" : locale === "ru" ? "ru-RU" : locale === "ja" ? "ja-JP" : "en-GB",
    { day: "2-digit", month: "long", year: "numeric", timeZone: "Asia/Tbilisi" },
  );

  return (
    <main className="mx-auto max-w-xl px-6 py-10 print:max-w-none print:px-0 print:py-0">
      <div className="rounded-3xl border-2 border-tan/60 bg-white p-8 print:rounded-none print:border-0 print:p-2">
        <header className="flex items-baseline justify-between border-b-2 border-ink pb-4">
          <div>
            <p className="font-display text-2xl uppercase tracking-wide">TSOMI</p>
            <p className="text-xs text-ink/50">
              {company.legalName} · tsomistreetwear.ge · {company.phone}
            </p>
          </div>
          <p className="text-sm font-bold uppercase tracking-wide text-ink/60">
            {dict.order.receiptTitle}
          </p>
        </header>

        <dl className="mt-5 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/50">{dict.order.reference}</dt>
            <dd className="font-bold tracking-wide">
              {order.id.slice(0, 8).toUpperCase()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">{dict.order.date}</dt>
            <dd className="font-medium">
              {dateFormat.format(order.paidAt ?? order.createdAt)}
            </dd>
          </div>
        </dl>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-ink/20 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="pb-2 font-bold">{dict.order.items}</th>
              <th className="pb-2 text-right font-bold" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-ink/10">
                <td className="py-2.5">
                  <span className="font-semibold">{item.name}</span>
                  {(item.color || item.size) && (
                    <span className="text-ink/55">
                      {" "}
                      ({[colorLabel(item.color, locale), item.size]
                        .filter(Boolean)
                        .join(", ")})
                    </span>
                  )}
                  <span className="text-ink/45"> × {item.quantity}</span>
                </td>
                <td className="py-2.5 text-right font-semibold tabular-nums">
                  {formatGel(tetriToGel(item.totalTetri))} ₾
                </td>
              </tr>
            ))}
            {order.deliveryTetri > 0 && (
              <tr className="border-b border-ink/10">
                <td className="py-2.5 text-ink/60">{dict.order.delivery}</td>
                <td className="py-2.5 text-right tabular-nums">
                  {formatGel(tetriToGel(order.deliveryTetri))} ₾
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-3 text-base font-bold">{dict.order.total}</td>
              <td className="pt-3 text-right font-display text-xl tabular-nums">
                {formatGel(tetriToGel(order.totalTetri))} ₾
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-6 border-t border-ink/10 pt-4 text-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-ink/45">
            {dict.order.shippingTo}
          </p>
          <p className="mt-1.5 font-medium">
            {order.customerName} · {order.customerPhone}
          </p>
          <p className="text-ink/60">
            {order.shippingCity}, {order.shippingAddress}
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-ink/40 print:hidden">
          {dict.order.printHint}
        </p>
        <div className="mt-3 flex justify-center print:hidden">
          <PrintButton label={dict.order.download} />
        </div>
      </div>
    </main>
  );
}
