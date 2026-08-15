import { FacebookIcon, InstagramIcon } from "./social-icons";
import { socialLinks } from "@/lib/social";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Community({ dict }: { dict: Dictionary }) {
  return (
    <section id="instagram" className="mx-auto max-w-330 px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-terracotta to-brick px-6 py-14 text-center text-cream shadow-xl shadow-brick/20 sm:px-12 sm:py-16">
        {/* ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-yolk/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-ink/20 blur-3xl"
        />

        <div className="relative">
          <h2 className="font-display mx-auto max-w-2xl text-3xl uppercase leading-tight tracking-wide sm:text-5xl">
            {dict.community.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream/80">
            {dict.community.text}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-cream px-8 py-4 font-bold uppercase tracking-wide text-ink shadow-lg shadow-ink/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yolk"
            >
              <InstagramIcon className="h-5 w-5" />
              {dict.community.cta}
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full border-2 border-cream/50 px-8 py-[0.85rem] font-bold uppercase tracking-wide text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream hover:text-ink"
            >
              <FacebookIcon className="h-5 w-5" />
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
