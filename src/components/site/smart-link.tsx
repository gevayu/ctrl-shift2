import Link from "next/link";

import type { LinkItem } from "@/data/site";

/**
 * A link to a page that may not exist yet. Internal paths go through
 * `next/link`, `mailto:`/`tel:` and external URLs through `<a>`, and a
 * `null` href (the page is in the site map but not built) renders the label
 * as plain, dimmed text so nothing on the site points at a 404.
 */
export const SmartLink = ({
  item,
  className = "",
  children,
}: {
  item: LinkItem;
  className?: string;
  /** Overrides the label (e.g. label + icon). */
  children?: React.ReactNode;
}) => {
  const content = children ?? item.label;
  if (!item.href) return <span className={`${className} cursor-default opacity-40`}>{content}</span>;
  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <a href={item.href} className={className}>
      {content}
    </a>
  );
};
