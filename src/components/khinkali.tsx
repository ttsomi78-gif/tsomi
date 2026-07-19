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
