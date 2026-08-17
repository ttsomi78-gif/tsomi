"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CharacterGallery } from "./character-gallery";
import type { Dictionary } from "@/i18n/get-dictionary";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * Art-only prints (no story text) shown as a masonry gallery wall.
 * Intrinsic dimensions keep next/image from shifting the columns.
 */
const artPieces = [
  { src: "/characters/v2/art-statues.jpg", width: 1240, height: 1339 },
  { src: "/characters/v2/art-adjaruli-pink.jpg", width: 1226, height: 966 },
  { src: "/characters/v2/art-bouquet.jpg", width: 891, height: 1189 },
  { src: "/characters/v2/art-eyes.jpg", width: 1240, height: 528 },
  { src: "/characters/v2/art-adjaruli-green.jpg", width: 994, height: 877 },
  { src: "/characters/v2/art-adjaruli.jpg", width: 918, height: 1034 },
  { src: "/characters/v2/art-adjaruli-blue.jpg", width: 1240, height: 976 },
  { src: "/characters/v2/art-khinkali.jpg", width: 393, height: 363 },
  { src: "/characters/v2/art-adjaruli-sunny.jpg", width: 1119, height: 988 },
];

const artImageSizes = "(min-width: 640px) 33vw, 50vw";

export function Story({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // reduced motion: no reveal — everything just sits in place
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const reveals = sectionRef.current
        ? Array.from(
            sectionRef.current.querySelectorAll<HTMLElement>(".story-reveal"),
          )
        : [];
      if (!reveals.length) return;

      gsap.set(reveals, { autoAlpha: 0, y: 60 });

      ScrollTrigger.batch(reveals, {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power2.out",
          }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative overflow-hidden bg-green py-20 text-cream sm:py-24"
    >
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-yolk/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-terracotta/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-330 px-4 sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-yolk">
          {dict.story.eyebrow}
        </p>
        <h2 className="font-display max-w-3xl text-4xl uppercase leading-tight tracking-wide sm:text-5xl">
          <span className="font-georgian normal-case">ცომი</span>{" "}
          <span className="text-cream/50">[tsomi]</span> {dict.story.headingSuffix}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
          {dict.story.paragraph}
        </p>

        <p className="mt-16 text-xs font-semibold uppercase tracking-[0.3em] text-cream/40">
          {dict.story.castEyebrow}
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-cream/60">
          {dict.story.castIntro}
        </p>

        <div className="mt-10">
          <CharacterGallery dict={dict} />
        </div>

        {/* gallery wall — art without words */}
        <div className="story-reveal mt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yolk">
            {dict.story.gallery.artEyebrow}
          </p>
          <h3 className="font-display mt-3 max-w-2xl text-3xl uppercase leading-tight tracking-wide sm:text-4xl">
            {dict.story.gallery.artHeading}
          </h3>
          <p className="mt-4 max-w-2xl leading-relaxed text-cream/60">
            {dict.story.gallery.artIntro}
          </p>
        </div>
        <div className="mt-8 columns-2 gap-4 sm:columns-3 sm:gap-5">
          {artPieces.map((piece) => (
            <div
              key={piece.src}
              className="story-reveal group mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/15 sm:mb-5"
            >
              <Image
                src={piece.src}
                alt=""
                width={piece.width}
                height={piece.height}
                sizes={artImageSizes}
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>

        {/* Made in Georgia */}
        <div className="story-reveal mt-20 overflow-hidden rounded-2xl border border-cream/15 bg-gradient-to-br from-pine to-pine/70 p-8 shadow-lg shadow-black/10 sm:p-10 md:grid md:grid-cols-[1fr_1.5fr] md:items-center md:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yolk">
              {dict.story.madeIn.eyebrow} 🇬🇪
            </p>
            <h3 className="font-display mt-3 text-3xl uppercase leading-tight tracking-wide sm:text-4xl">
              {dict.story.madeIn.heading}
            </h3>
          </div>
          <p className="mt-6 leading-relaxed text-cream/70 md:mt-0">
            {dict.story.madeIn.text}
          </p>
        </div>

        {/* Manifesto */}
        <div className="story-reveal mt-20 text-center">
          <h3 className="font-display mx-auto max-w-2xl text-3xl uppercase leading-tight tracking-wide sm:text-4xl">
            {dict.story.manifesto.heading}
          </h3>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {dict.story.manifesto.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-cream/20 bg-cream/5 px-5 py-2 text-sm text-cream/80"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-cream/60">
            {dict.story.manifesto.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
