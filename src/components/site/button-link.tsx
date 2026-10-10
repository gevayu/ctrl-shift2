import type { LinkItem } from "@/data/site";

import { SmartLink } from "./smart-link";

const BASE =
  "group relative inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors duration-[var(--duration-fast)] ease-entrance focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const SIZE = { md: "px-6 py-3 md:px-8 md:py-4 md:text-base", sm: "px-4 py-2" };
const CORNER = "pointer-events-none absolute h-3 w-3 border-ink/70 transition-transform duration-[var(--duration-fast)] ease-entrance group-hover:scale-125";

/**
 * The site's two buttons. Primary: solid, the page's ink on black. Secondary:
 * transparent, the template's bracket-cornered outline.
 */
export const ButtonLink = ({
  item,
  variant = "primary",
  size = "md",
  className = "",
}: {
  item: LinkItem;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  className?: string;
}) =>
  variant === "primary" ? (
    <SmartLink item={item} className={`${BASE} ${SIZE[size]} bg-ink text-page hover:bg-soft ${className}`} />
  ) : (
    <SmartLink item={item} className={`${BASE} ${SIZE[size]} border border-ink/25 bg-page/40 text-ink backdrop-blur-md hover:bg-page/70 ${className}`}>
      <span className={`${CORNER} end-0 top-0 border-e-2 border-t-2`} />
      <span className={`${CORNER} bottom-0 start-0 border-b-2 border-s-2`} />
      {item.label}
    </SmartLink>
  );

/** A text link with an up-left arrow (the RTL mirror of the template's ↗). */
export const ArrowLink = ({ item, className = "" }: { item: LinkItem; className?: string }) => (
  <SmartLink
    item={item}
    className={`group inline-flex items-center gap-2 text-sm font-medium text-ink transition-opacity duration-[var(--duration-fast)] ease-entrance hover:opacity-70 md:text-base ${className}`}
  >
    {item.label}
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 -scale-x-100 transition-transform duration-[var(--duration-fast)] ease-entrance group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  </SmartLink>
);
