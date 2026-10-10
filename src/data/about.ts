// 📖 Docs: obsidian/frontend/content.md

/**
 * The About page. Its body is the copy doc's 150-word company text
 * (`about-text.ts`); the stages and testimonials come from their own data.
 * Only the H1 and the section headings below are ours, built from phrases
 * the copy doc already uses.
 */
import { homeContent } from "@/data/home";
import { links, type LinkItem } from "@/data/site";
import { routes } from "@/lib/routes";
import type { Crumb } from "@/utils/seo/structured-data";

export const aboutContent = {
  meta: {
    title: "אודות | Ctrl+Shift",
    description: "Ctrl-Shift מטמיעה מערכות CRM, אוטומציות וכלי AI בחברות ישראליות עם 10 עובדים ומעלה. החברה פועלת ממודיעין-מכבים-רעות, ומנוהלת על ידי צליל נוימן.",
  },
  crumbs: [
    { label: "בית", href: routes.home },
    { label: "החברה", href: routes.about },
  ] satisfies Crumb[],
  title: "אודות Ctrl+Shift",
  stagesTitle: homeContent.steps.title,
  testimonialsTitle: "מה אומרים לקוחות",
  closing: {
    title: homeContent.closing.title,
    body: homeContent.closing.body,
    primary: homeContent.closing.primary,
    secondary: { label: "לסיפורי הלקוח", href: links.stories } satisfies LinkItem,
  },
} as const;
