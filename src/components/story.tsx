"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import {
  BicycleIcon,
  KhachapuriIcon,
  KhinkaliIcon,
  KhinkaliWomanIcon,
  ThreeKhinkaliIcon,
} from "./khinkali";
import type { Dictionary } from "@/i18n/get-dictionary";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const icons = [
  <KhinkaliIcon key="khinkali-man" className="h-8 w-auto" />,
  <KhinkaliWomanIcon key="khinkali-woman" className="h-8 w-auto" />,
  <BicycleIcon key="minimalist" className="h-8 w-auto" />,
  <KhachapuriIcon key="khachapuri-man" className="h-8 w-auto" />,
  <ThreeKhinkaliIcon key="three-khinkali" className="h-8 w-auto" />,
];
const images = [
  "/characters/khinkali-man.jpg",
  "/characters/khinkali-woman.jpg",
  "/characters/minimalist.jpg",
  "/characters/khachapuri-man.jpg",
  "/characters/supra.jpg",
];
const rotations = [
  "md:-rotate-2",
  "md:rotate-1",
  "md:-rotate-1",
  "md:rotate-2",
  "md:-rotate-1",
];
const cardImageSizes =
  "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

export function Story({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const characters = dict.story.characters.map((character, index) => ({
    ...character,
    number: `0${index + 1}`,
    icon: icons[index],
    image: images[index],
    rotate: rotations[index],
  }));

  useGSAP(
    () => {
      // reduced motion: no reveal — everything just sits in place
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const reveals = sectionRef.current
        ? Array.from(
            sectionRef.current.querySelectorAll<HTMLElement>(
              ".story-card, .story-reveal",
            ),
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

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <div key={character.title} className="story-card">
              <motion.article
                whileHover={{ y: -6, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream/15 bg-gradient-to-b from-pine to-pine/80 shadow-lg shadow-black/10 transition-colors duration-300 hover:border-yolk/60 hover:shadow-2xl hover:shadow-black/30 ${character.rotate}`}
              >
                <div className="relative aspect-4/5 overflow-hidden">
                  <Image
                    src={character.image}
                    alt={character.title}
                    fill
                    sizes={cardImageSizes}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pine/90 to-transparent"
                  />
                  <span className="font-display absolute right-4 top-4 rounded-full bg-ink/50 px-3 py-1 text-sm text-cream/80 backdrop-blur-sm">
                    {character.number}
                  </span>
                  <motion.span
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-4 left-4 inline-flex items-center justify-center rounded-xl bg-ink/50 p-2.5 text-yolk backdrop-blur-sm transition-colors group-hover:bg-yolk/20"
                  >
                    {character.icon}
                  </motion.span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-yolk/80">
                    {character.trait}
                  </p>
                  <h3 className="font-display text-xl uppercase tracking-wide">
                    {character.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-cream/60">
                    {character.text}
                  </p>
                </div>
              </motion.article>
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
