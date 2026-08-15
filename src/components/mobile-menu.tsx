"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { SocialLinks } from "./social-links";

type NavItem = { label: string; href: string };

export function MobileMenu({
  items,
  shopHref,
  shopLabel,
  menuLabel,
}: {
  items: NavItem[];
  shopHref: string;
  shopLabel: string;
  menuLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // navigating away (including same-page anchor links via onClick) closes the panel
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={menuLabel}
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-cream"
      >
        <span
          aria-hidden="true"
          className={`absolute h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${
            open ? "rotate-45" : "-translate-y-1"
          }`}
        />
        <span
          aria-hidden="true"
          className={`absolute h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ${
            open ? "-rotate-45" : "translate-y-1"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* dim everything under the header so the panel reads as a layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-ink/40 backdrop-blur-sm"
            />
            <motion.nav
              id="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-x-0 top-full z-50 rounded-b-3xl border-b border-tan/50 bg-cream/95 shadow-xl shadow-ink/15 backdrop-blur-md"
            >
              <div className="mx-auto flex max-w-330 flex-col px-4 pb-6 pt-3 sm:px-6">
                {items.map((item, index) => {
                  const active =
                    pathname === item.href ||
                    (item.href.length > 3 && pathname.startsWith(item.href));
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: 0.05 + index * 0.06,
                        ease: "easeOut",
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl uppercase tracking-wide transition-colors ${
                          active
                            ? "bg-blush text-terracotta"
                            : "hover:bg-blush hover:text-terracotta"
                        }`}
                      >
                        {item.label}
                        <ArrowRightIcon
                          className={`h-5 w-5 transition-all duration-200 ${
                            active
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-40"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + items.length * 0.06 }}
                  className="mt-4 flex items-center justify-between gap-4 border-t border-tan/40 pt-5"
                >
                  <SocialLinks size="sm" />
                  <Link
                    href={shopHref}
                    onClick={() => setOpen(false)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-terracotta"
                  >
                    {shopLabel}
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
