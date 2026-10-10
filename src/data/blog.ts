// 📖 Docs: obsidian/frontend/content.md

/**
 * The blog — index copy and the article registry. Article bodies live as
 * Markdown in `src/content/blog/<slug>.md` (client's text, verbatim), read
 * at build time by `src/lib/blog.ts`.
 */
import { links, type LinkItem } from "@/data/site";
import { routes } from "@/lib/routes";
import type { Crumb } from "@/utils/seo/structured-data";

export const CLUSTERS = [
  { id: "fit", label: "לא במידה", description: "איך יודעים שהעסק גדל מהר יותר מהמערכת שלו." },
  { id: "switch", label: "המעבר", description: "איך מחליפים מערכת בלי לעצור את העסק, ומה קורה לנתונים ולאנשים." },
  { id: "growth", label: "צמיחה בלי ידיים", description: "אוטומציה, מדידה, ומתי AI באמת עוזר." },
  { id: "cto", label: "לסמנכ\"ל", description: "ארכיטקטורה, תיעוד, אינטגרציות, אבטחה. למי שיחיה עם המערכת." },
] as const;

export type ClusterId = (typeof CLUSTERS)[number]["id"];

export interface ArticleMeta {
  slug: string;
  title: string;
  subtitle?: string;
  cluster: ClusterId;
  /** ponytail: no author or date in the doc yet; the CEO is named as author until set per article. */
  author: string;
}

/** Newest first (the doc's order; real publish dates still to come). */
export const articles: readonly ArticleMeta[] = [
  { slug: "when-to-replace-crm", title: "מתי צריך להחליף מערכת CRM?", subtitle: "7 סימנים שהעסק צמח מעבר למערכת שלו", cluster: "fit", author: "צליל נוימן" },
  { slug: "why-crm-projects-fail", title: "למה פרויקטי CRM נכשלים – ומה צריך לעשות אחרת כדי שהמערכת באמת תעבוד", cluster: "switch", author: "צליל נוימן" },
  { slug: "how-to-choose-crm", title: "איך לבחור מערכת CRM לעסק? מדריך לחברות שצומחות", cluster: "cto", author: "צליל נוימן" },
  { slug: "which-processes-to-automate", title: "איך לזהות תהליכים שצריך להפוך לאוטומטיים בעסק?", cluster: "growth", author: "צליל נוימן" },
  { slug: "before-ai", title: "לפני שמכניסים AI לעסק: 5 דברים שחייבים לסדר קודם", cluster: "growth", author: "צליל נוימן" },
  { slug: "replace-crm-without-stopping", title: "איך מחליפים מערכת CRM בלי לעצור את העסק", cluster: "switch", author: "צליל נוימן" },
];

export const findArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const blogContent = {
  meta: {
    title: "בלוג | על יעילות בעסק בינוני, לא על כלים | Ctrl+Shift",
    description: "מאמרים על החלפת מערכות, אוטומציה ו-AI בחברות של 10 עד 50 עובדים. מתי ה-CRM כבר לא במידה, איך עוברים בלי לעצור, וכמה עבודה ידנית באמת צריכה להיות.",
  },
  crumbs: [
    { label: "בית", href: routes.home },
    { label: "ידע", href: null },
    { label: "בלוג", href: routes.blog },
  ] satisfies Crumb[],
  title: "על יעילות. לא על כלים.",
  intro: "מאמר אחד בשבועיים, מהצוות שעושה את העבודה. בלי סקירות של מערכות, בלי \"עשרת הטיפים\". מה עובד בחברות של 10 עד 50 עובדים, ומה לא.",
  all: "הכל",
  newsletter: {
    title: "מאמר אחד בשבועיים. על יעילות.",
    body: "לא נשלח שום דבר אחר. לא מבצעים, לא \"עדכונים מהחברה\".",
    /** UI microcopy: the field label (the doc names the field "מייל"). */
    field: "מייל",
    submit: "להירשם",
    note: "אפשר לעזוב בלחיצה אחת.",
    privacy: { label: "מדיניות פרטיות", href: routes.privacy } satisfies LinkItem,
    /** UI microcopy (not in the doc). */
    done: "נרשמתם. המאמר הבא יגיע למייל.",
    error: "משהו השתבש. נסו שוב עוד רגע.",
  },
  /** On each article page. UI labels (not in the doc). */
  article: {
    byline: "מאת",
    cta: {
      title: "רוצים לבדוק את זה אצלכם?",
      primary: { label: "לתאם פגישת איפיון", href: links.meeting } satisfies LinkItem,
      secondary: { label: "לכל המאמרים", href: routes.blog } satisfies LinkItem,
    },
  },
} as const;
