"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import type { Dictionary } from "@/i18n/get-dictionary";

/*
 * High-res character art lives in /characters/v2 (white-background prints,
 * so the featured panel and thumbs are white — the artwork blends in
 * seamlessly). Order matches dict.story.characters. Characters with more
 * than one image get a "look" switcher under the featured panel.
 */
const cast = [
  { key: "khinkali-man", images: ["/characters/v2/khinkali-man.jpg"] },
  { key: "khinkali-woman", images: ["/characters/v2/khinkali-woman.jpg"] },
  {
    key: "minimalist",
    images: ["/characters/v2/minimalist.jpg", "/characters/v2/minimalist-bike.jpg"],
  },
  { key: "khachapuri-man", images: ["/characters/v2/khachapuri-man.jpg"] },
  {
    key: "three-khinkali",
    images: [
      "/characters/v2/three-khinkali.jpg",
      "/characters/v2/three-khinkali-stone.jpg",
    ],
  },
];

const featuredSizes = "(min-width: 1024px) 44vw, (min-width: 640px) 80vw, 100vw";

export function CharacterGallery({ dict }: { dict: Dictionary }) {
  const [state, setState] = useState({ index: 0, look: 0, dir: 1 });
  const { index, look, dir } = state;
  const character = cast[index];
  const info = dict.story.characters[index];
  const labels = dict.story.gallery;

  const goTo = (target: number) =>
    setState((s) => ({
      index: (target + cast.length) % cast.length,
      look: 0,
      dir: target > s.index ? 1 : -1,
    }));

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={dict.story.castEyebrow}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(index + 1);
        if (e.key === "ArrowLeft") goTo(index - 1);
      }}
      className="grid items-center gap-8 outline-none lg:grid-cols-[1.1fr_1fr] lg:gap-14"
    >
      {/* featured panel — height capped so the gallery never grows past the viewport */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/25">
        <div className="relative aspect-4/5 max-h-[58vh] sm:aspect-3/4 sm:max-h-[52vh] lg:aspect-auto lg:h-[min(52vh,560px)]">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={`${index}-${look}`}
              custom={dir}
              initial={{ opacity: 0, x: dir * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -48 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, dragInfo) => {
                if (dragInfo.offset.x < -60) goTo(index + 1);
                if (dragInfo.offset.x > 60) goTo(index - 1);
              }}
              className="absolute inset-0 cursor-grab p-6 active:cursor-grabbing sm:p-10"
            >
              <div className="relative h-full w-full">
                <Image
                  src={character.images[look]}
                  alt={info?.title ?? ""}
                  fill
                  sizes={featuredSizes}
                  draggable={false}
                  className="pointer-events-none object-contain"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* number badge */}
        <span className="font-display absolute left-5 top-5 text-5xl text-ink/10 sm:text-6xl">
          0{index + 1}
        </span>

        {/* look switcher */}
        {character.images.length > 1 && (
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {character.images.map((image, j) => (
              <button
                key={image}
                type="button"
                aria-label={labels.look.replace("{n}", String(j + 1))}
                aria-current={j === look}
                onClick={() => setState((s) => ({ ...s, look: j, dir: j > s.look ? 1 : -1 }))}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  j === look ? "w-8 bg-yolk" : "w-2.5 bg-ink/15 hover:bg-ink/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* prev / next */}
        <div className="absolute bottom-5 right-5 flex gap-2">
          <button
            type="button"
            aria-label={labels.prev}
            onClick={() => goTo(index - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors hover:bg-yolk"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => goTo(index + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors hover:bg-yolk"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* info + thumbnails */}
      <div className="text-left">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yolk">
              {info?.trait}
            </p>
            <h3 className="font-display mt-2 text-3xl uppercase tracking-wide sm:text-4xl">
              {info?.title}
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed text-cream/70">
              {info?.text}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap gap-3">
          {cast.map((member, i) => {
            const memberInfo = dict.story.characters[i];
            return (
              <button
                key={member.key}
                type="button"
                aria-label={memberInfo?.title}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-1.5 transition-all duration-300 ${
                  i === index
                    ? "ring-2 ring-yolk"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <span className="relative block h-full w-full">
                  <Image
                    src={member.images[0]}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
