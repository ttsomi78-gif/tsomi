import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

const photos = [
  { src: "/characters/khinkali-man.jpg", tilt: "-rotate-3" },
  { src: "/characters/khinkali-woman.jpg", tilt: "rotate-2 translate-y-3" },
  { src: "/characters/minimalist.jpg", tilt: "-rotate-2" },
  { src: "/characters/khachapuri-man.jpg", tilt: "rotate-3 translate-y-3" },
  { src: "/characters/supra.jpg", tilt: "-rotate-1" },
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

      <div className="relative mx-auto max-w-330 px-4 text-center sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-yolk">
          {dict.story.eyebrow}
        </p>
        <h2 className="font-display mx-auto max-w-3xl text-4xl uppercase leading-tight tracking-wide sm:text-5xl">
          <span className="font-georgian normal-case">ცომი</span>{" "}
          <span className="text-cream/50">[tsomi]</span> {dict.story.headingSuffix}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
          {dict.story.paragraph}
        </p>

        {/* character photo strip */}
        <div className="mt-12 flex justify-center -space-x-5 sm:-space-x-3">
          {photos.map((photo) => (
            <div
              key={photo.src}
              className={`relative aspect-4/5 w-24 overflow-hidden rounded-xl border-4 border-cream/90 shadow-xl transition-transform duration-300 hover:z-10 hover:scale-110 hover:rotate-0 sm:w-32 lg:w-36 ${photo.tilt}`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
          ))}
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
