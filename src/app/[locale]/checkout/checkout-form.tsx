"use client";

import { startTransition, useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatGel, tetriToGel } from "@/lib/money";
import { colorLabel } from "@/lib/colors";
import { company } from "@/lib/company";
import { socialLinks } from "@/lib/social";
import { deliveryAmountLabel as deliveryLabel } from "@/lib/delivery-copy";
import {
  OTHER_COUNTRY,
  deliveryFeeTetri,
  zoneForCountry,
  type ShippingRates,
} from "@/lib/shipping";
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
  rates,
  countries,
}: {
  locale: LocaleId;
  dict: Dictionary;
  rates: ShippingRates;
  countries: { code: string; name: string }[];
}) {
  const { items, subtotal, hydrated, keyOf } = useCart();
  const [state, formAction, isPending] = useActionState(startCheckout, undefined);
  const [country, setCountry] = useState<string>("GE");

  // The delivery line follows the country picker; null means "we don't ship
  // there" and the Pay button locks. The server recomputes the same number
  // from the same country, so this is display only.
  const deliveryTetri = country === OTHER_COUNTRY ? null : deliveryFeeTetri(country, rates);
  const abroad = country !== "GE" && deliveryTetri !== null;
  const delivery = tetriToGel(deliveryTetri ?? 0);
  const total = subtotal + delivery;

  // Submitted by hand rather than through `<form action>`: React resets an
  // uncontrolled form the moment its action resolves — including resolving
  // with an error — which wiped name, email, phone and address every time
  // the last unit sold out under a customer, or the bank was unreachable.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (deliveryTetri === null) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    startTransition(() => formAction(formData));
  }

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

  const otherNote = dict.checkout.countryOtherNote.split("{handle}");

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <input type="hidden" name="locale" value={locale} />
      {/* Only ids and quantities travel; the server re-prices from the database. */}
      <input
        type="hidden"
        name="cart"
        value={JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? undefined,
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
              placeholder={abroad ? "+…" : "+995 5XX XXX XXX"}
              required
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-3 font-display text-xl uppercase tracking-wide">
            {dict.checkout.shippingHeading}
          </legend>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/55">
              {dict.checkout.country}
            </span>
            <select
              name="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              autoComplete="country"
              className={`${fieldClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2327211a%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
            >
              {countries.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
              <option value={OTHER_COUNTRY}>{dict.checkout.countryOther}</option>
            </select>
          </label>

          {deliveryTetri === null ? (
            <p
              role="alert"
              className="rounded-2xl bg-gold/15 px-4 py-3 text-sm text-ink/70"
            >
              {otherNote[0]}
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-ink underline decoration-2 underline-offset-2 hover:text-terracotta"
              >
                {company.instagram}
              </a>
              {otherNote[1]}
            </p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  name="city"
                  label={dict.checkout.city}
                  autoComplete="address-level2"
                  required
                  minLength={2}
                />
                {abroad ? (
                  <Field
                    name="postalCode"
                    label={dict.checkout.postalCode}
                    autoComplete="postal-code"
                    required
                    maxLength={20}
                  />
                ) : (
                  <Field
                    name="address"
                    label={dict.checkout.address}
                    autoComplete="street-address"
                    required
                    minLength={5}
                  />
                )}
              </div>
              {abroad && (
                <Field
                  name="address"
                  label={dict.checkout.address}
                  autoComplete="street-address"
                  required
                  minLength={5}
                />
              )}
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
                {(!abroad
                  ? dict.checkout.deliveryGeorgia
                  : // The weekly-dispatch / 2.5–3 week promise is the courier's
                    // EU and USA figure; elsewhere we don't quote a time.
                    zoneForCountry(country) === "cis"
                    ? dict.checkout.deliveryIntlOther
                    : dict.checkout.deliveryIntl
                ).replace("{amount}", deliveryLabel(deliveryTetri, dict))}
              </p>
            </>
          )}
        </fieldset>
      </div>

      <aside className="h-fit rounded-3xl border-2 border-tan/60 bg-sand/50 p-5 lg:sticky lg:top-24">
        <h2 className="mb-4 font-display text-xl uppercase tracking-wide">
          {dict.checkout.summary}
        </h2>

        <ul className="space-y-3 border-b border-tan/60 pb-4">
          {items.map((item) => (
            <li key={keyOf(item)} className="flex items-center gap-3">
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
                <p className="text-xs text-ink/45">
                  {[colorLabel(item.color, locale), item.size]
                    .filter(Boolean)
                    .join(" · ")}
                  {(item.color || item.size) && " · "}× {item.quantity}
                </p>
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
            <dd className="font-semibold tabular-nums">
              {deliveryTetri === null ? "—" : deliveryLabel(deliveryTetri, dict)}
            </dd>
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
          pending={isPending}
          disabled={deliveryTetri === null}
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
  pending,
  disabled,
}: {
  label: string;
  pendingLabel: string;
  /** From useActionState — useFormStatus only sees `<form action>` submits. */
  pending: boolean;
  disabled: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-cream shadow-md shadow-ink/15 transition-all hover:bg-terracotta hover:shadow-terracotta/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

const fieldClass =
  "w-full rounded-full border-2 border-tan/60 bg-white/60 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/30 focus:border-ink";

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
      <input name={name} type={type} {...rest} className={fieldClass} />
    </label>
  );
}
