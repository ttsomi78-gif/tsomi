import { KhinkaliIcon } from "./khinkali";
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

export function Benefits({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-tan/40 bg-blush/60">
      <div className="mx-auto grid max-w-330 gap-x-8 gap-y-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {dict.benefits.map((benefit, index) => (
          <div key={benefit.title} className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream text-terracotta shadow-sm ring-1 ring-tan/50">
              {icons[index]}
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide">
                {benefit.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/55">
                {benefit.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
