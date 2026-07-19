import { KhachapuriIcon, KhinkaliIcon, ToteIcon } from "./khinkali";

const characters = [
  {
    title: "The Khinkali Kid",
    text: "Dumpling-headed, bomber jacket on, hands in pockets. Twelve pleats minimum, no broth spilled.",
    icon: <KhinkaliIcon className="h-16 w-auto" />,
  },
  {
    title: "Mr. Khachapuri",
    text: "Boat-shaped businessman. Sunglasses on, yolk intact, wine in hand. Closes deals before the cheese sets.",
    icon: <KhachapuriIcon className="h-16 w-auto" />,
  },
  {
    title: "The Shopper",
    text: "A canvas bag wearing its breakfast — adjaruli prints and a plush khachapuri riding in the pocket.",
    icon: <ToteIcon className="h-16 w-auto" />,
  },
];

export function Story() {
  return (
    <section id="story" className="bg-green py-20 text-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-yolk">
          What is TSOMI?
        </p>
        <h2 className="font-display max-w-3xl text-4xl uppercase leading-tight tracking-wide sm:text-5xl">
          <span className="font-georgian normal-case">ცომი</span>{" "}
          <span className="text-cream/50">[tsomi]</span> — dough.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
          Georgia&apos;s greatest hits are made of dough — khinkali, khachapuri,
          the whole supra table. TSOMI folds that heritage into streetwear:
          surreal characters, heavy cotton, and a wink. Culturally proud, never
          serious. Made in Georgia, always.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {characters.map((character) => (
            <article
              key={character.title}
              className="rounded-2xl border border-cream/15 bg-pine p-7 transition-colors hover:border-yolk/60"
            >
              <div className="mb-5 text-yolk">{character.icon}</div>
              <h3 className="font-display text-xl uppercase tracking-wide">
                {character.title}
              </h3>
              <p className="mt-3 leading-relaxed text-cream/60">
                {character.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
