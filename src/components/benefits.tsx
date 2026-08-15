import { KhinkaliIcon } from "./khinkali";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "./ui/carousel";
import type { Dictionary } from "@/i18n/get-dictionary";

const iconProps = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function TagIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M3 3h8l10 10-8 8L3 11V3Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

function TeeIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M8 3 3.5 6l2 3.5L8 8.5V21h8V8.5l2.5 1 2-3.5L16 3a4 4 0 0 1-8 0Z" />
    </svg>
  );
}

const icons = [
  <PinIcon key="pin" className="h-6 w-6" />,
  <TagIcon key="tag" className="h-6 w-6" />,
  <TeeIcon key="tee" className="h-6 w-6" />,
  <KhinkaliIcon key="khinkali" className="h-6 w-auto" />,
];

/* one logo color per card — terracotta T, gold I, green S, navy M */
const accents = [
  {
    chip: "bg-terracotta/10 text-terracotta ring-terracotta/25",
    bar: "bg-terracotta",
  },
  {
    chip: "bg-gold/10 text-gold ring-gold/25",
    bar: "bg-gold",
  },
  {
    chip: "bg-green/10 text-green ring-green/25",
    bar: "bg-green",
  },
  {
    chip: "bg-navy/10 text-navy ring-navy/25",
    bar: "bg-navy",
  },
];

function BenefitCard({
  benefit,
  index,
  alwaysAccent = false,
}: {
  benefit: Dictionary["benefits"][number];
  index: number;
  alwaysAccent?: boolean;
}) {
  const accent = accents[index % accents.length];
  return (
    <div className="group relative h-full overflow-hidden rounded-3xl bg-cream p-6 shadow-sm ring-1 ring-tan/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/10">
      {/* accent bar — always shown on the mobile carousel, slides in on hover elsewhere */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 origin-left transition-transform duration-300 group-hover:scale-x-100 ${
          alwaysAccent ? "scale-x-100" : "scale-x-0"
        } ${accent.bar}`}
      />
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${accent.chip}`}
      >
        {icons[index]}
      </span>
      <h3 className="mt-4 text-sm font-bold uppercase tracking-wide">
        {benefit.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
        {benefit.text}
      </p>
    </div>
  );
}

export function Benefits({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-tan/40 bg-blush/60">
      {/* mobile: swipeable carousel with the next card peeking in */}
      <div className="px-4 py-10 sm:hidden">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {dict.benefits.map((benefit, index) => (
              <CarouselItem key={benefit.title} className="basis-[85%]">
                <BenefitCard benefit={benefit} index={index} alwaysAccent />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots className="mt-2" />
        </Carousel>
      </div>

      {/* tablet & up: grid */}
      <div className="mx-auto hidden max-w-330 gap-5 px-4 py-12 sm:grid sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-14">
        {dict.benefits.map((benefit, index) => (
          <BenefitCard key={benefit.title} benefit={benefit} index={index} />
        ))}
      </div>
    </section>
  );
}
