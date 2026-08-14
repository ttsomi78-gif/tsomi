"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { InstagramIcon } from "./social-icons";
import { socialLinks } from "@/lib/social";
import type { Dictionary } from "@/i18n/get-dictionary";

/* Real shots standing in for grid posts — swap for photos from the feed */
const tiles = [
  "/products/khinkali-street.jpg",
  "/products/gallery-tee.jpg",
  "/products/mr-khachapuri.jpg",
  "/products/khachapuri-shopper-worn.jpg",
];

export function Instagram({ dict }: { dict: Dictionary }) {
  return (
    <section id="instagram" className="mx-auto max-w-330 px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div
            aria-hidden="true"
            className="mb-4 h-1.5 w-16 rounded-full bg-terracotta"
          />
          <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
            {dict.instagram.heading}
          </h2>
        </div>
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta hover:underline"
        >
          {dict.hero.instagramHandle} ↗
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((src, index) => (
          <motion.a
            key={src}
            href={socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="TSOMI on Instagram"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
            whileHover={{ scale: 1.03, rotate: -0.5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-md"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-cream opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
              <InstagramIcon className="h-8 w-8 drop-shadow-lg" />
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
