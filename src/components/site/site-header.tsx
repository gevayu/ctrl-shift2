import { siteContent as c } from "@/data/site";

import { BrandLogo } from "./brand-logo";
import { ButtonLink } from "./button-link";
import { SmartLink } from "./smart-link";

/**
 * Logo on the right (the RTL start), the menu, and the one header CTA. No
 * WhatsApp button and no phone number here by design: the phone is in the
 * footer only. On phones the menu folds away; the sticky bottom bar and the
 * footer carry navigation there.
 */
export const SiteHeader = () => (
  <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/5 bg-page/70 backdrop-blur-md">
    <div className="flex items-center justify-between gap-6 px-6 py-4 md:px-10">
      <BrandLogo height={40} priority />
      <nav aria-label="ראשי" className="hidden md:block">
        <ul className="flex items-center gap-8">
          {c.nav.map((item) => (
            <li key={item.label}>
              <SmartLink item={item} className="text-sm text-soft transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-ink" />
            </li>
          ))}
        </ul>
      </nav>
      <ButtonLink item={c.headerCta} size="sm" />
    </div>
  </header>
);
