// 📖 Docs: obsidian/frontend/content.md

/**
 * Site-wide copy: header, footer, the mobile bar, shared CTAs. Content lives
 * in `src/data/`, never in a view (hard rule #4). Strings are the client's
 * copy doc, verbatim.
 */
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

/** A link whose page may not exist yet: `href: null` renders as plain text. */
export interface LinkItem {
  label: string;
  href: string | null;
}

/** Where "book a meeting" leads: the contact page (form, then the calendar). */
const MEETING_HREF = routes.contact;

/**
 * Where "find where the business loses control" leads.
 * ponytail: the home page's problem section until the control index
 * (מדד השליטה) is built.
 */
const CONTROL_INDEX_HREF = `${routes.home}#problem`;

export const links = {
  meeting: MEETING_HREF,
  controlIndex: CONTROL_INDEX_HREF,
  stories: routes.stories,
  blog: routes.blog,
  processes: routes.processes,
  /** "How we count" (איך אנחנו סופרים): not built yet. */
  howWeCount: null,
  /**
   * The self-booking calendar (cal.com) on the contact page and its thank-you
   * page. ponytail: null until the cal.com link exists; the button hides.
   */
  calendar: null as string | null,
} as const;

export const siteContent = {
  brand: "Ctrl+Shift",
  nav: [
    { label: "שירותים", href: routes.services },
    { label: "סיפורי לקוח", href: routes.stories },
    { label: "ידע", href: routes.blog },
    { label: "החברה", href: routes.about },
  ] satisfies LinkItem[],
  headerCta: { label: "לתאם פגישת איפיון", href: links.meeting },
  /** The sticky bar on phones: two buttons only, no floating WhatsApp. */
  mobileBar: [
    { label: "מדד השליטה", href: links.controlIndex },
    { label: "פגישת איפיון", href: links.meeting },
  ] satisfies LinkItem[],
  /** The routing layer (שכבת ניתוב) under each inner page's CTA section. */
  routing: [
    { label: "למנכ\"ל", href: null },
    { label: "לסמנכ\"ל מערכות", href: null },
    { label: "לסמנכ\"ל שיווק", href: null },
    { label: "לתאם פגישת איפיון", href: links.meeting },
  ] satisfies LinkItem[],
  footer: {
    tagline: "Ctrl+Shift עובדת עם חברות בצמיחה ומטמיעה פתרונות ייעול תהליכים עסקיים באמצעות CRM, אוטומציות ו-AI.",
    address: `${siteConfig.contact.street}, ${siteConfig.contact.city}`,
    phone: { label: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phoneE164}` },
    email: { label: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    /** ponytail: no company LinkedIn URL in the copy doc yet. */
    linkedin: { label: "LinkedIn", href: null } satisfies LinkItem,
    columns: [
      {
        title: "שירותים",
        links: [
          { label: "איפיון", href: routes.discovery },
          { label: "בנייה, הטמעה והדרכות", href: routes.implementation },
          { label: "תמיכה ופיתוח לאורך זמן", href: routes.support },
        ],
      },
      {
        title: "ידע",
        links: [
          { label: "סיפורי לקוח", href: routes.stories },
          { label: "בלוג", href: routes.blog },
          { label: "ספריית תהליכים", href: routes.processes },
          { label: "האם להחליף?", href: null },
          { label: "מדד השליטה", href: null },
          { label: "מחשבון החיכוך", href: null },
        ],
      },
      {
        title: "החברה",
        links: [
          { label: "הצוות", href: null },
          { label: "השיטה שלנו", href: null },
          { label: "דרושים", href: null },
          { label: "צור קשר", href: routes.contact },
          { label: "הצהרת נגישות", href: null },
          { label: "מדיניות פרטיות", href: routes.privacy },
        ],
      },
    ] satisfies { title: string; links: LinkItem[] }[],
    copyright: "© 2026 Ctrl+Shift. כל הזכויות שמורות.",
  },
  /** The preloader on the home page: Latin, mono — the brand's own formula. */
  preloader: {
    status: "[ CTRL+SHIFT ]",
    tags: ["CTRL", "SHIFT", "SCALE", "CTRL + SHIFT", "= SCALE"],
    footnote: "CRM · AUTOMATION · AI",
  },
} as const;
