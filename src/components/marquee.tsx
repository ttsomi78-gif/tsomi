"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const items = [
  "TSOMI",
  "ცომი",
  "MADE IN GEORGIA",
  "KHACHAPURI",
  "ხაჭაპური",
  "KHINKALI",
  "ხინკალი",
  "SUPRA",
  "სუფრა",
  "GEORGIA",
];

/*
 * Photo cutouts between the words — adjaruli khachapuri (pngimg.com)
 * and khinkali (vecteezy.com), in /public/icons.
 */
const separators = [
  { src: "/icons/khachapuri.png", width: 200, height: 168 },
  { src: "/icons/khinkali.png", width: 450, height: 350 },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item, index) => {
        const icon = separators[index % separators.length];
        return (
          <span
            key={item}
            className="flex items-center gap-5 pr-5 text-lg uppercase tracking-[0.15em]"
          >
            <motion.span
              className={`inline-block cursor-default [text-shadow:0_1px_3px_rgba(0,0,0,0.3)] ${
                /[ა-ჰ]/.test(item) ? "font-georgian" : "font-display"
              }`}
              whileHover={{ scale: 1.18, y: -3, color: "#e59a2f" }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              {item}
            </motion.span>
            <motion.div
              animate={{ rotate: [0, 10, -8, 0], y: [0, -3, 0, 0] }}
              transition={{
                duration: 4 + (index % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.15,
              }}
              whileHover={{ scale: 1.25, rotate: 0 }}
            >
              <Image
                src={icon.src}
                alt=""
                width={icon.width}
                height={icon.height}
                className="h-9 w-auto drop-shadow-sm"
              />
            </motion.div>
          </span>
        );
      })}
    </div>
  );
}

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;

      // base autoplay — always drifting forward at a steady pace
      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 18,
        ease: "none",
        repeat: -1,
      });

      const clampSpeed = gsap.utils.clamp(-4, 4);

      // scrolling down speeds it up, scrolling up reverses it — then it eases
      // back to the base pace once scrolling settles
      const trigger = ScrollTrigger.create({
        onUpdate: (self) => {
          tween.timeScale(clampSpeed(1 + self.getVelocity() / 400));
        },
      });

      const settle = () => {
        tween.timeScale(gsap.utils.interpolate(tween.timeScale(), 1, 0.015));
      };
      gsap.ticker.add(settle);

      return () => {
        gsap.ticker.remove(settle);
        trigger.kill();
      };
    },
    { scope: trackRef },
  );

  return (
    <div className="relative overflow-hidden border-y border-brick/40 bg-gradient-to-r from-brick via-terracotta to-brick py-3 text-cream shadow-[inset_0_2px_6px_rgba(0,0,0,0.25),inset_0_-2px_6px_rgba(0,0,0,0.25),0_6px_16px_-4px_rgba(0,0,0,0.25)]">
      <div
        ref={trackRef}
        className="flex w-max [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        <Row />
        <div aria-hidden="true" className="flex shrink-0">
          <Row />
        </div>
      </div>

      {/* soft depth line along the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/20"
      />
    </div>
  );
}
