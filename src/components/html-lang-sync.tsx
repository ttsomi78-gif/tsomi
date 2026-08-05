"use client";

import { useEffect } from "react";
import type { LocaleId } from "@/lib/products";

/** The root layout owns <html lang>, so this syncs it once the active locale is known client-side. */
export function HtmlLangSync({ locale }: { locale: LocaleId }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
