/* Line-art khinkali — pleated body with a twisted top knot */
export function KhinkaliIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* knot */}
      <rect x="52" y="8" width="16" height="26" rx="6" />
      {/* body */}
      <path d="M60 34 C 24 40 12 74 16 95 C 20 118 38 132 60 132 C 82 132 100 118 104 95 C 108 74 96 40 60 34 Z" />
      {/* pleats fanning from the knot */}
      <path d="M60 36 C 42 52 30 72 27 92" />
      <path d="M60 36 C 52 62 48 98 50 128" />
      <path d="M60 36 C 68 62 72 98 70 128" />
      <path d="M60 36 C 78 52 90 72 93 92" />
    </svg>
  );
}

/* Line-art khinkali with a bow and a little heart — Khinkali-Woman */
export function KhinkaliWomanIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* knot */}
      <rect x="52" y="8" width="16" height="26" rx="6" />
      {/* bow loops */}
      <path d="M52 20 C 40 8 28 22 48 27" />
      <path d="M68 20 C 80 8 92 22 72 27" />
      {/* body */}
      <path d="M60 34 C 24 40 12 74 16 95 C 20 118 38 132 60 132 C 82 132 100 118 104 95 C 108 74 96 40 60 34 Z" />
      {/* pleats fanning from the knot */}
      <path d="M60 36 C 42 52 30 72 27 92" />
      <path d="M60 36 C 52 62 48 98 50 128" />
      <path d="M60 36 C 68 62 72 98 70 128" />
      <path d="M60 36 C 78 52 90 72 93 92" />
      {/* heart */}
      <path
        strokeWidth="3.5"
        d="M104 12 c -3 -6 -11 -3 -8 3 c 1 3 8 7 8 7 c 0 0 7 -4 8 -7 c 3 -6 -5 -9 -8 -3 Z"
      />
    </svg>
  );
}

/* Line-art bicycle — the Minimalist thought about it for a month */
export function BicycleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 110"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* wheels */}
      <circle cx="36" cy="74" r="26" />
      <circle cx="124" cy="74" r="26" />
      {/* frame */}
      <path d="M36 74 L60 36 L104 36 L124 74" />
      <path d="M60 36 L80 74 L36 74" />
      <path d="M104 36 L80 74" />
      {/* seat */}
      <path d="M60 36 L58 26 M50 26 L66 26" />
      {/* handlebars */}
      <path d="M104 36 L106 22 M98 20 L114 20" />
    </svg>
  );
}

/* Line-art trio of khinkali — three friends at one table */
export function ThreeKhinkaliIcon({ className = "" }: { className?: string }) {
  const mini = (
    <>
      <rect x="24" y="2" width="12" height="16" rx="5" />
      <path d="M30 18 C 12 22 4 40 6 52 C 8 68 18 78 30 78 C 42 78 52 68 54 52 C 56 40 48 22 30 18 Z" />
      <path d="M30 20 C 22 32 17 44 16 54" />
      <path d="M30 20 C 38 32 43 44 44 54" />
    </>
  );
  return (
    <svg
      viewBox="0 0 190 110"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="translate(2 16)">{mini}</g>
      <g transform="translate(63 2)">{mini}</g>
      <g transform="translate(124 16)">{mini}</g>
    </svg>
  );
}

/* Line-art shopper tote with a khachapuri print — the TSOMI bag */
export function ToteIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* handle */}
      <path d="M38 50 C 38 18 82 18 82 50" />
      {/* bag body */}
      <path d="M24 50 L96 50 L104 122 C 80 132 40 132 16 122 Z" />
      {/* khachapuri print */}
      <path d="M38 88 C 48 74 72 74 82 88 C 72 102 48 102 38 88 Z" />
      <circle cx="60" cy="88" r="5" />
    </svg>
  );
}

/* Line-art Adjarian khachapuri — the boat, the cheese, the yolk */
export function KhachapuriIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 100"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* bread boat */}
      <path d="M8 50 C 30 18 60 10 80 10 C 100 10 130 18 152 50 C 130 82 100 90 80 90 C 60 90 30 82 8 50 Z" />
      {/* cheese well */}
      <path d="M30 50 C 46 31 64 27 80 27 C 96 27 114 31 130 50 C 114 69 96 73 80 73 C 64 73 46 69 30 50 Z" />
      {/* yolk */}
      <circle cx="80" cy="50" r="10" />
    </svg>
  );
}
