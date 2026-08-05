"use client";

import { useTransition } from "react";
import { deleteProduct } from "./actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete "${name}"? This can't be undone.`)) {
          startTransition(() => {
            deleteProduct(id);
          });
        }
      }}
      className="font-semibold text-terracotta underline decoration-2 underline-offset-4 transition-colors hover:text-brick disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
