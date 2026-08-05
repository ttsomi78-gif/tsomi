"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { KhachapuriIcon, KhinkaliIcon, ToteIcon } from "./khinkali";
import type { Dictionary } from "@/i18n/get-dictionary";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const icons = [
  <KhinkaliIcon key="khinkali" className="h-12 w-auto" />,
  <KhachapuriIcon key="khachapuri" className="h-12 w-auto" />,
  <ToteIcon key="tote" className="h-12 w-auto" />,
];
const rotations = ["md:-rotate-2", "md:rotate-1", "md:-rotate-1"];

export function Story({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const characters = dict.story.characters.map((character, index) => ({
    ...character,
    number: `0${index + 1}`,
    icon: icons[index],
    rotate: rotations[index],
  }));

  useGSAP(
    () => {
      const cards = cardsRef.current
        ? Array.from(cardsRef.current.querySelectorAll<HTMLElement>(".story-card"))
        : [];
      if (!cards.length) return;

      gsap.set(cards, { autoAlpha: 0, y: 80 });

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: 1,
        animation: gsap.timeline().to(cards, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.5,
          ease: "power2.out",
        }),
      });

      return () => st.kill();
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

        <div ref={cardsRef} className="mt-6 grid gap-6 md:grid-cols-3">
          {characters.map((character) => (
            <div key={character.title} className="story-card">
              <motion.article
                whileHover={{ y: -6, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative overflow-hidden rounded-2xl border border-cream/15 bg-gradient-to-b from-pine to-pine/80 p-7 shadow-lg shadow-black/10 transition-colors duration-300 hover:border-yolk/60 hover:shadow-2xl hover:shadow-black/30 ${character.rotate}`}
              >
                <span className="font-display absolute right-6 top-6 text-sm text-cream/20">
                  {character.number}
                </span>
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                  className="mb-5 inline-flex items-center justify-center rounded-2xl bg-cream/5 p-4 text-yolk shadow-inner shadow-black/20 transition-colors group-hover:bg-yolk/10"
                >
                  {character.icon}
                </motion.div>
                <h3 className="font-display text-xl uppercase tracking-wide">
                  {character.title}
                </h3>
                <p className="mt-3 leading-relaxed text-cream/60">
                  {character.text}
                </p>
              </motion.article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
