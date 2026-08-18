import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OrderEffects } from "./order-effects";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { getOrderById, getOrderItems, reconcileOrder } from "@/lib/orders";
import { formatGel, tetriToGel } from "@/lib/money";
import type { OrderStatus } from "@/db/schema";
import type { LocaleId } from "@/lib/products";

// Reconciles against BOG on every view — caching this would defeat the point.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order — TSOMI",
  robots: { index: false, follow: false },
};

type Tone = "success" | "danger" | "waiting";

function presentation(
  status: OrderStatus,
  dict: Dictionary,
): { heading: string; text: string; tone: Tone } {
  switch (status) {
    case "paid":
      return {
        heading: dict.order.paidHeading,
        text: dict.order.paidText,
        tone: "success",
      };
    case "pending":
      return {
        heading: dict.order.pendingHeading,
        text: dict.order.pendingText,
        tone: "waiting",
      };
    case "expired":
      return {
        heading: dict.order.expiredHeading,
        text: dict.order.expiredText,
        tone: "waiting",
      };
    // `refunded` is only ever set by hand for bookkeeping; to the customer it
    // reads the same as a payment that didn't stick.
    case "failed":
    case "refunded":
      return {
        heading: dict.order.failedHeading,
        text: dict.order.failedText,
        tone: "danger",
      };
  }
}

const TONE_STYLES: Record<Tone, { badge: string; icon: string }> = {
  success: { badge: "bg-green/10 text-green", icon: "bg-green text-cream" },
  danger: { badge: "bg-terracotta/10 text-terracotta", icon: "bg-terracotta text-cream" },
  waiting: { badge: "bg-gold/15 text-ink/70", icon: "bg-gold text-ink" },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: LocaleId; id: string }>;
}) {
  const { locale, id } = await params;

  const found = await getOrderById(id);
  if (!found) notFound();

  // Asks BOG directly when we're still pending, so a dropped callback resolves
  // itself the moment the customer lands back here.
  const order = await reconcileOrder(found);
  const [items, dict] = await Promise.all([
    getOrderItems(order.id),
    getDictionary(locale),
  ]);

  const { heading, text, tone } = presentation(order.status, dict);
  const styles = TONE_STYLES[tone];

  return (
    <>
      <Header locale={locale} dict={dict} />
      <OrderEffects status={order.status} />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border-2 border-tan/60 bg-white/70 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
            >
              {tone === "success" ? (
                <CheckIcon className="h-6 w-6" />
              ) : tone === "danger" ? (
                <CrossIcon className="h-6 w-6" />
              ) : (
                <ClockIcon className="h-6 w-6" />
              )}
            </span>
            <div>
              <h1 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
                {heading}
              </h1>
              <p className="mt-1 text-ink/55">{text}</p>
            </div>
          </div>

          {order.failureReason && tone !== "success" && (
            <p
              className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ${styles.badge}`}
            >
              {order.failureReason}
            </p>
          )}

          <dl className="mt-6 border-t border-tan/60 pt-5 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-ink/50">{dict.order.reference}</dt>
              <dd className="font-mono text-xs text-ink/70">{order.id}</dd>
            </div>
          </dl>

          <ul className="mt-5 space-y-2 border-t border-tan/60 pt-5">
            {items.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-ink/45"> × {item.quantity}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {formatGel(tetriToGel(item.totalTetri))} ₾
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1.5 border-t border-tan/60 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/55">{dict.order.items}</dt>
              <dd className="font-semibold tabular-nums">
                {formatGel(tetriToGel(order.itemsTetri))} ₾
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">{dict.order.delivery}</dt>
              <dd className="font-semibold tabular-nums">
                {formatGel(tetriToGel(order.deliveryTetri))} ₾
              </dd>
            </div>
            <div className="flex justify-between border-t border-tan/60 pt-2 text-base">
              <dt className="font-bold">{dict.order.total}</dt>
              <dd className="font-display text-xl text-terracotta tabular-nums">
                {formatGel(tetriToGel(order.totalTetri))} ₾
              </dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-tan/60 pt-5 text-sm">
            <p className="text-ink/50">{dict.order.shippingTo}</p>
            <p className="mt-1 font-medium">
              {order.customerName} · {order.customerPhone}
            </p>
            <p className="text-ink/70">
              {order.shippingCity}, {order.shippingAddress}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {order.status === "pending" && (
              <Link
                href={`/${locale}/order/${order.id}`}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-terracotta"
              >
                {dict.order.refresh}
              </Link>
            )}
            {(order.status === "failed" || order.status === "expired") && (
              <Link
                href={`/${locale}/checkout`}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-terracotta"
              >
                {dict.order.tryAgain}
              </Link>
            )}
            <Link
              href={`/${locale}/catalog`}
              className="rounded-full border-2 border-ink px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              {dict.order.backToShop}
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
