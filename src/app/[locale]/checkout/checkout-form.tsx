"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatGel, tetriToGel } from "@/lib/money";
import { startCheckout, type CheckoutError } from "./actions";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

function errorMessage(error: CheckoutError, dict: Dictionary): string {
  switch (error.code) {
    case "empty":
      return dict.checkout.errorEmpty;
    case "unavailable":
      return dict.checkout.errorUnavailable;
    case "invalid":
      return dict.checkout.required;
    case "payment":
      return dict.checkout.errorPayment;
    case "sold_out":
      return dict.checkout.errorSoldOut.replace("{product}", error.product);
    case "stock":
      return dict.checkout.errorStock
        .replace("{product}", error.product)
        .replace("{count}", String(error.count));
  }
}

export function CheckoutForm({
  locale,
  dict,
  deliveryTetri,
}: {
  locale: LocaleId;
  dict: Dictionary;
  deliveryTetri: number;
}) {
  const { items, subtotal, hydrated } = useCart();
  const [state, formAction] = useActionState(startCheckout, undefined);

  const delivery = tetriToGel(deliveryTetri);
  const total = subtotal + delivery;

  // Until localStorage is read the cart is unknown — showing the empty state
  // here would flash "your cart is empty" at customers who have items.
  if (!hydrated) {
    return <div className="py-24 text-center text-ink/40">…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-lg text-ink/50">{dict.checkout.emptyCart}</p>
        <Link
          href={`/${locale}/catalog`}
          className="rounded-full border-2 border-ink px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream"
        >
          {dict.cart.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <input type="hidden" name="locale" value={locale} />
      {/* Only ids and quantities travel; the server re-prices from the database. */}
      <input
        type="hidden"
        name="cart"
        value={JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        )}
      />

      <div className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="mb-3 font-display text-xl uppercase tracking-wide">
            {dict.checkout.contactHeading}
          </legend>
          <Field name="name" label={dict.checkout.name} autoComplete="name" required minLength={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="email"
              type="email"
              label={dict.checkout.email}
              autoComplete="email"
              required
            />
            <Field
              name="phone"
              type="tel"
              label={dict.checkout.phone}
              autoComplete="tel"
              placeholder="+995 5XX XXX XXX"
              required
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-3 font-display text-xl uppercase tracking-wide">
            {dict.checkout.shippingHeading}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="city"
              label={dict.checkout.city}
              autoComplete="address-level2"
              required
              minLength={2}
            />
            <Field
              name="address"
              label={dict.checkout.address}
              autoComplete="street-address"
              required
              minLength={5}
            />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
              {dict.checkout.note}
            </span>
            <textarea
              name="note"
              rows={3}
              maxLength={500}
              placeholder={dict.checkout.notePlaceholder}
              className="w-full rounded-2xl border-2 border-tan/60 bg-white/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink/30 focus:border-ink"
            />
          </label>
          <p className="text-sm text-ink/45">
            {dict.checkout.deliveryNote.replace("{amount}", formatGel(delivery))}
          </p>
        </fieldset>
      </div>

      <aside className="h-fit rounded-3xl border-2 border-tan/60 bg-sand/50 p-5 lg:sticky lg:top-24">
        <h2 className="mb-4 font-display text-xl uppercase tracking-wide">
          {dict.checkout.summary}
        </h2>

        <ul className="space-y-3 border-b border-tan/60 pb-4">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                {item.image && (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold leading-tight">{item.name}</p>
                <p className="text-xs text-ink/45">× {item.quantity}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {formatGel(item.price * item.quantity)} ₾
              </span>
            </li>
          ))}
        </ul>

        <dl className="space-y-1.5 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/55">{dict.cart.subtotal}</dt>
            <dd className="font-semibold tabular-nums">{formatGel(subtotal)} ₾</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/55">{dict.cart.delivery}</dt>
            <dd className="font-semibold tabular-nums">{formatGel(delivery)} ₾</dd>
          </div>
          <div className="flex justify-between border-t border-tan/60 pt-2 text-base">
            <dt className="font-bold">{dict.cart.total}</dt>
            <dd className="font-display text-xl text-terracotta tabular-nums">
              {formatGel(total)} ₾
            </dd>
          </div>
        </dl>

        {state?.error && (
          <p
            role="alert"
            className="mb-3 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta"
          >
            {errorMessage(state.error, dict)}
          </p>
        )}

        <SubmitButton
          label={`${dict.checkout.pay} ${formatGel(total)} ₾`}
          pendingLabel={dict.checkout.paying}
        />

        <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/40">
          {dict.checkout.securedBy}
        </p>
      </aside>
    </form>
  );
}

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-cream shadow-md shadow-ink/15 transition-all hover:bg-terracotta hover:shadow-terracotta/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function Field({
  name,
  label,
  type = "text",
  ...rest
}: {
  name: string;
  label: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
        {label}
      </span>
      <input
        name={name}
        type={type}
        {...rest}
        className="w-full rounded-full border-2 border-tan/60 bg-white/60 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/30 focus:border-ink"
      />
    </label>
  );
}
