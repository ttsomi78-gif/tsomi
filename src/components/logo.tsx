/* The spiral "O" — echoes the khinkali twist from the TSOMI bag logotype */
export function SpiralO({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="11"
      strokeLinecap="round"
    >
      <path d="M50 8 A42 42 0 0 1 50 92 A34 34 0 0 1 50 24 A26 26 0 0 1 50 76 A20 20 0 0 1 50 36 A14 14 0 0 1 50 64" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center font-black tracking-tight ${className}`}
    >
      TS
      <SpiralO className="mx-[0.06em] h-[0.78em] w-[0.78em]" />
      MI
    </span>
  );
}
