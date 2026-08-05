"use client";

import { motion } from "motion/react";
import { KhachapuriIcon, KhinkaliIcon, ToteIcon } from "./khinkali";
import { OrnamentO } from "./logo";
import { socialLinks } from "@/lib/social";
import type { Dictionary } from "@/i18n/get-dictionary";

/* Tiles stand in for real grid posts — swap for photos from the feed */
const tiles = [
  {
    bg: "bg-gradient-to-br from-terracotta to-brick",
    fg: "text-cream",
    render: () => <KhinkaliIcon className="h-1/2 w-auto max-w-[50%]" />,
  },
  {
    bg: "bg-gradient-to-br from-blush to-sand",
    fg: "text-ink",
    render: () => <OrnamentO className="h-1/2 w-auto max-w-[50%]" />,
  },
  {
    bg: "bg-gradient-to-br from-navy to-ink",
    fg: "text-cream",
    render: () => <KhachapuriIcon className="h-2/5 w-auto max-w-[55%]" />,
  },
  {
    bg: "bg-gradient-to-br from-gold to-yolk",
    fg: "text-cream",
    render: () => <ToteIcon className="h-1/2 w-auto max-w-[50%]" />,
  },
];

export function Instagram({ dict }: { dict: Dictionary }) {
  return (
    <section id="instagram" className="mx-auto max-w-330 px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
          {dict.instagram.heading}
        </h2>
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta hover:underline"
        >
          @tsomi.streetwear ↗
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((tile, index) => (
          <motion.a
            key={index}
            href={socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="TSOMI on Instagram"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
            whileHover={{ scale: 1.04, rotate: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`flex aspect-square items-center justify-center rounded-2xl shadow-md ${tile.bg} ${tile.fg}`}
          >
            {tile.render()}
          </motion.a>
        ))}
      </div>
    </section>
  );
}
