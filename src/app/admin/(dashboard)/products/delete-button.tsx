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
      className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
