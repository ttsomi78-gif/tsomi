"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/components/cart-provider";
import { formatGel, tetriToGel } from "@/lib/money";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export function CartDrawer({
  locale,
  dict,
  deliveryTetri,
}: {
  locale: LocaleId;
  dict: Dictionary;
  deliveryTetri: number;
}) {
  const { items, subtotal, isOpen, closeCart, remove, setQuantity } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  // Rendered through a portal so the drawer isn't clipped by the sticky header's
  // stacking context.
  if (typeof document === "undefined") return null;

  const delivery = tetriToGel(deliveryTetri);
  const total = subtotal + delivery;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex justify-end bg-ink/60 backdrop-blur-sm"
          onClick={closeCart}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={dict.cart.title}
            className="flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b-2 border-tan/60 px-5 py-4">
              <h2 className="font-display text-xl uppercase tracking-wide">
                {dict.cart.title}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label={dict.cart.close}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink transition-colors hover:bg-tan"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-ink/40">
                  <BagIcon className="h-6 w-6" />
                </span>
                <p className="text-ink/50">{dict.cart.empty}</p>
                <Link
                  href={`/${locale}/catalog`}
                  onClick={closeCart}
                  className="rounded-full border-2 border-ink px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  {dict.cart.emptyCta}
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-tan/50 overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4 py-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 truncate font-bold leading-tight">
                            {item.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(item.productId)}
                            aria-label={`${dict.cart.remove} — ${item.name}`}
                            className="shrink-0 text-ink/35 transition-colors hover:text-terracotta"
                          >
                            <CloseIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="mt-0.5 text-sm text-ink/50">
                          {formatGel(item.price)} ₾
                        </p>

                        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-1 rounded-full bg-sand p-1">
                            <StepperButton
                              label={dict.cart.decrease}
                              onClick={() =>
                                setQuantity(item.productId, item.quantity - 1)
                              }
                            >
                              −
                            </StepperButton>
                            <span className="min-w-6 text-center text-sm font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <StepperButton
                              label={dict.cart.increase}
                              disabled={item.quantity >= item.stock}
                              onClick={() =>
                                setQuantity(item.productId, item.quantity + 1)
                              }
                            >
                              +
                            </StepperButton>
                          </div>
                          <span className="font-display text-lg text-terracotta">
                            {formatGel(item.price * item.quantity)} ₾
                          </span>
                        </div>

                        {item.quantity >= item.stock && (
                          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                            {dict.cart.maxStock.replace("{count}", String(item.stock))}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t-2 border-tan/60 bg-sand/60 px-5 py-4">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink/55">{dict.cart.subtotal}</dt>
                      <dd className="font-semibold tabular-nums">
                        {formatGel(subtotal)} ₾
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink/55">{dict.cart.delivery}</dt>
                      <dd className="font-semibold tabular-nums">
                        {formatGel(delivery)} ₾
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-tan/60 pt-2 text-base">
                      <dt className="font-bold">{dict.cart.total}</dt>
                      <dd className="font-display text-xl text-terracotta tabular-nums">
                        {formatGel(total)} ₾
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`/${locale}/checkout`}
                    onClick={closeCart}
                    className="mt-4 flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream shadow-md shadow-ink/15 transition-all hover:bg-terracotta hover:shadow-terracotta/25"
                  >
                    {dict.cart.checkout}
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-2 w-full py-2 text-xs font-semibold uppercase tracking-wide text-ink/45 transition-colors hover:text-ink"
                  >
                    {dict.cart.continueShopping}
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function StepperButton({
  label,
  onClick,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-ink shadow-sm transition-colors hover:bg-yolk disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white"
    >
      {children}
    </button>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
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
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function BagIcon({ className = "" }: { className?: string }) {
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
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
