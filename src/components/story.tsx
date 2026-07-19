import { KhachapuriIcon, KhinkaliIcon } from "./khinkali";
import { SpiralO } from "./logo";

const characters = [
  {
    title: "The Khinkali Reader",
    text: "A dumpling-headed regular who reads more than he talks. Twelve pleats minimum, no broth spilled.",
    icon: <KhinkaliIcon className="h-16 w-auto" />,
  },
  {
    title: "Mr. Khachapuri",
    text: "Boat-shaped businessman. Sunglasses on, yolk intact, wine in hand. Closes deals before the cheese sets.",
    icon: <KhachapuriIcon className="h-16 w-auto" />,
  },
  {
    title: "The Supra Uniform",
    text: "Built for long tables and longer toasts. From the first gaumarjos to the last bite of dough.",
    icon: <SpiralO className="h-16 w-16" />,
  },
];

export function Story() {
  return (
    <section id="story" className="bg-ink py-20 text-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-mustard">
          What is TSOMI?
        </p>
        <h2 className="max-w-3xl text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
          <span className="font-georgian">ცომი</span>{" "}
          <span className="text-cream/50">[tsomi]</span> — dough.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
          Georgia&apos;s greatest hits are made of dough — khinkali, khachapuri,
          the whole supra table. TSOMI folds that heritage into streetwear:
          surreal characters, heavy cotton, and a wink. Culturally proud, never
          serious.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {characters.map((character) => (
            <article
              key={character.title}
              className="rounded-2xl border border-cream/15 bg-coal p-7 transition-colors hover:border-mustard/60"
            >
              <div className="mb-5 text-mustard">{character.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-tight">
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
