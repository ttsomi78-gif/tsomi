"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import type { OrderStatus } from "@/db/schema";

/** Which paid order last emptied the cart — so a revisit doesn't do it again. */
const CLEARED_KEY = "tsomi.cart.clearedFor";

export function OrderEffects({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const { clear } = useCart();

  // Only a paid order empties the cart, and only the first time it's seen:
  // customers come back to this page a week later for the receipt, and the
  // things they had picked out since must survive that visit. After a
  // failure the customer keeps their items so "try again" is one click.
  useEffect(() => {
    if (status !== "paid") return;
    let alreadyCleared = false;
    try {
      alreadyCleared = window.localStorage.getItem(CLEARED_KEY) === orderId;
    } catch {
      // Storage blocked — fall through and clear; nothing else to go on.
    }
    if (alreadyCleared) return;
    clear();
    try {
      window.localStorage.setItem(CLEARED_KEY, orderId);
    } catch {
      // Private mode or a full quota — worst case the cart clears again later.
    }
  }, [orderId, status, clear]);

  // One automatic retry, four seconds in: the callback usually lands within a
  // second or two of the redirect. `status` doesn't change on a refresh that
  // finds it still pending, so the effect doesn't re-arm — from there the
  // customer uses the explicit refresh button rather than us polling forever.
  useEffect(() => {
    if (status !== "pending") return;
    const timer = setTimeout(() => router.refresh(), 4000);
    return () => clearTimeout(timer);
  }, [status, router]);

  return null;
}
