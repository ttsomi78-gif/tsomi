"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import type { OrderStatus } from "@/db/schema";

export function OrderEffects({ status }: { status: OrderStatus }) {
  const router = useRouter();
  const { clear } = useCart();

  // Only a paid order empties the cart. After a failure the customer keeps their
  // items so "try again" is one click rather than a rebuild from scratch.
  useEffect(() => {
    if (status === "paid") clear();
  }, [status, clear]);

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
