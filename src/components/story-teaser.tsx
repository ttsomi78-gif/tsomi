import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

/*
 * Character cutouts extracted from the print artwork (transparent PNGs).
 * Order matches dict.story.characters. Heights vary so the lineup reads
 * like a group shot, not a grid of same-size tiles.
 */
const cast = [
  {
    src: "/characters/khinkali-man.png",
    width: 262,
    height: 729,
    size: "h-44 sm:h-60 lg:h-72",
  },
  {
    src: "/characters/khinkali-woman.png",
    width: 239,
    height: 645,
    size: "h-40 sm:h-56 lg:h-64",
  },
  {
    src: "/characters/minimalist.png",
    width: 192,
    height: 425,
    size: "h-32 sm:h-44 lg:h-52",
  },
  {
    src: "/characters/khachapuri-man.png",
    width: 249,
    height: 812,
    size: "h-48 sm:h-64 lg:h-80",
  },
  {
    src: "/characters/three-khinkali.png",
    width: 289,
    height: 98,
    size: "h-14 sm:h-18 lg:h-20",
  },
];

export function StoryTeaser({
  locale,
  dict,
}: {
  locale: LocaleId;
  dict: Dictionary;
}) {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-green py-16 text-cream sm:py-24"
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

      <div className="relative mx-auto max-w-330 px-4 text-center sm:px-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-yolk">
          {dict.story.eyebrow}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
          {dict.story.paragraph}
        </p>

        {/* the cast, lined up like a family photo */}
        <div className="mt-12 flex flex-wrap items-end justify-center gap-x-5 gap-y-10 sm:gap-x-10 lg:gap-x-14">
          {cast.map((character, index) => {
            const info = dict.story.characters[index];
            return (
              <div
                key={character.src}
                className="group flex flex-col items-center gap-3"
              >
                <Image
                  src={character.src}
                  alt={info?.title ?? ""}
                  width={character.width}
                  height={character.height}
                  className={`w-auto ${character.size} drop-shadow-[0_18px_22px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105`}
                />
                {info && (
                  <span className="rounded-full bg-cream/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cream/70 backdrop-blur-sm transition-colors duration-300 group-hover:bg-yolk group-hover:text-ink">
                    {info.title}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <Link
          href={`/${locale}/history`}
          className="group mt-12 inline-flex items-center gap-3 rounded-full bg-yolk px-8 py-4 font-bold uppercase tracking-wide text-ink shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold"
        >
          {dict.story.readMore}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
