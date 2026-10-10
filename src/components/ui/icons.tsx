/**
 * The one icon the shipped page used — lucide's `ArrowUpRight` — inlined, so
 * the page needs no icon library. Same 24-unit geometry and 2 px stroke;
 * `stroke-[2.5]` etc. on the className override it as before.
 */
export const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);
