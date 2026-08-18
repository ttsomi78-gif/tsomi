"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/products";

/**
 * Cart state lives entirely in the browser. `price` here is for rendering the
 * running total only — checkout re-prices every line from the database, so a
 * doctored localStorage entry changes nothing about what the customer is
 * charged (see `priceCart` in `@/lib/orders`).
 */
export type CartItem = {
  productId: string;
  name: string;
  price: number; // GEL
  image: string;
  quantity: number;
  /** Stock at the time it was added — the checkout re-checks against live stock. */
  stock: number;
};

const STORAGE_KEY = "tsomi.cart.v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  /** False until localStorage has been read, so SSR and first paint agree. */
  hydrated: boolean;
  isOpen: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Written by an older build, or hand-edited — keep only well-formed lines.
    return parsed.flatMap((entry): CartItem[] => {
      if (typeof entry !== "object" || entry === null) return [];
      const item = entry as Partial<CartItem>;
      if (typeof item.productId !== "string" || typeof item.name !== "string") return [];
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) return [];
      return [
        {
          productId: item.productId,
          name: item.name,
          price: Number(item.price) || 0,
          image: typeof item.image === "string" ? item.image : "",
          quantity,
          stock: Number(item.stock) || 0,
        },
      ];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Read after mount rather than during render: localStorage doesn't exist on
  // the server, and seeding state from it would desync the first client render.
  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private mode or a full quota — the cart still works for this session.
    }
  }, [items, hydrated]);

  const add = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      const nextQuantity = Math.min(
        (existing?.quantity ?? 0) + quantity,
        Math.max(product.stock, 1),
      );
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: nextQuantity, stock: product.stock } : item,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: nextQuantity,
          stock: product.stock,
        },
      ];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.productId !== productId) return [item];
        const clamped = Math.min(Math.max(quantity, 0), Math.max(item.stock, 1));
        return clamped <= 0 ? [] : [{ ...item, quantity: clamped }];
      }),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      hydrated,
      isOpen,
      add,
      remove,
      setQuantity,
      clear,
      openCart,
      closeCart,
    };
  }, [items, hydrated, isOpen, add, remove, setQuantity, clear, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
