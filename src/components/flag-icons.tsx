import type { LocaleId } from "@/lib/products";

const wrapperClass = "h-full w-full";

function FlagGB() {
  return (
    <svg viewBox="0 0 20 15" className={wrapperClass} aria-hidden="true">
      <rect width="20" height="15" fill="#00247d" />
      <path d="M0 0 20 15M20 0 0 15" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 20 15M20 0 0 15" stroke="#cf142b" strokeWidth="1" />
      <path d="M10 0V15M0 7.5H20" stroke="#fff" strokeWidth="5" />
      <path d="M10 0V15M0 7.5H20" stroke="#cf142b" strokeWidth="3" />
    </svg>
  );
}

function FlagRU() {
  return (
    <svg viewBox="0 0 20 15" className={wrapperClass} aria-hidden="true">
      <rect width="20" height="5" y="0" fill="#fff" />
      <rect width="20" height="5" y="5" fill="#0039a6" />
      <rect width="20" height="5" y="10" fill="#d52b1e" />
    </svg>
  );
}

function FlagKA() {
  return (
    <svg viewBox="0 0 20 15" className={wrapperClass} aria-hidden="true">
      <rect width="20" height="15" fill="#fff" />
      <rect x="8.5" width="3" height="15" fill="#ff0000" />
      <rect y="6" width="20" height="3" fill="#ff0000" />
      {[[3.2, 2.2], [16.8, 2.2], [3.2, 12.8], [16.8, 12.8]].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <rect x={cx - 0.35} y={cy - 1.3} width="0.7" height="2.6" fill="#ff0000" />
          <rect x={cx - 1.3} y={cy - 0.35} width="2.6" height="0.7" fill="#ff0000" />
        </g>
      ))}
    </svg>
  );
}

function FlagJP() {
  return (
    <svg viewBox="0 0 20 15" className={wrapperClass} aria-hidden="true">
      <rect width="20" height="15" fill="#fff" />
      <circle cx="10" cy="7.5" r="4.2" fill="#bc002d" />
    </svg>
  );
}

const flags: Record<LocaleId, React.ComponentType> = {
  en: FlagGB,
  ru: FlagRU,
  ka: FlagKA,
  ja: FlagJP,
};

export function FlagIcon({ locale, className = "" }: { locale: LocaleId; className?: string }) {
  const Flag = flags[locale];
  return (
    <span className={`inline-flex overflow-hidden rounded-[3px] ${className}`}>
      <Flag />
    </span>
  );
}
