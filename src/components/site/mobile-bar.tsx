import { siteContent as c } from "@/data/site";

import { ButtonLink } from "./button-link";

/** The sticky phone bar: two buttons only, no floating WhatsApp (copy doc §14). */
export const MobileBar = () => (
  <nav aria-label="פעולות מהירות" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-ink/10 bg-page/85 p-3 backdrop-blur-md md:hidden">
    <ButtonLink item={c.mobileBar[0]} variant="secondary" />
    <ButtonLink item={c.mobileBar[1]} />
  </nav>
);
