import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { CharacterGallery } from "./character-gallery";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

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
      className="relative flex min-h-screen items-center overflow-hidden bg-green py-10 text-cream sm:py-12"
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
        <div className="text-center">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-yolk">
            {dict.story.eyebrow}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-cream/70">
            {dict.story.paragraph}
          </p>
        </div>

        <div className="mt-8">
          <CharacterGallery dict={dict} />
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/history`}
            className="group inline-flex items-center gap-3 rounded-full bg-yolk px-8 py-4 font-bold uppercase tracking-wide text-ink shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold"
          >
            {dict.story.readMore}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
