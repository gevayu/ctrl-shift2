// 📖 Docs: obsidian/frontend/content.md

/**
 * The contact page copy — the client's copy doc, verbatim. The form's option
 * lists are also the values sent to the CRM (`src/lib/contact-schema.ts`).
 */
import { links, type LinkItem } from "@/data/site";
import { routes } from "@/lib/routes";
import type { Crumb } from "@/utils/seo/structured-data";

export const ROLES = ["מנכ\"ל או בעלים", "מערכות מידע או תפעול", "שיווק או מכירות", "אחר"] as const;
export const EMPLOYEES = ["עד 9", "10 עד 30", "31 עד 100", "מעל 100"] as const;
/** "עד 9" does not block sending; it leads to thank-you version B. */
export const SMALL_COMPANY = EMPLOYEES[0];

export const contactContent = {
  meta: {
    title: "צור קשר | לתאם פגישת היכרות והתאמה | Ctrl+Shift",
    description: "פגישת היכרות והתאמה של 60 דקות, לא שיחת מכירה. תיאום עצמאי ביומן או טופס עם חזרה תוך יום עסקים. מודיעין-מכבים-רעות.",
  },
  crumbs: [
    { label: "בית", href: routes.home },
    { label: "צור קשר", href: routes.contact },
  ] satisfies Crumb[],
  title: "נתחיל בפגישת היכרות והתאמה של 60 דקות.",
  intro: "לא שיחת מכירה. יוצאים ממנה עם ציון שליטה, שלושה ממדים לטיפול, והמלצה אם בכלל צריך אותנו.",
  booking: {
    title: "לבחור זמן",
    body: "הפגישה בזום. עם צליל נוימן, לא עם נציג.",
    /** ponytail: the cal.com link is not set yet (`links.calendar`); until it is, the button renders as text. */
    cta: { label: "לבחור זמן ביומן", href: links.calendar } satisfies LinkItem,
  },
  form: {
    title: "או שנחזור אליכם",
    fields: {
      name: "שם מלא",
      company: "שם החברה",
      role: "תפקיד",
      employees: "מספר עובדים",
      phone: "טלפון",
      email: "מייל",
      pain: "מה כואב הכי הרבה?",
    },
    painPlaceholder: "הדוח לישיבה, לידים שנופלים, אקסל שרץ מהצד...",
    /** UI microcopy (not in the doc): the empty choice in the two dropdowns. */
    choose: "בחירה",
    submit: "לתיאום פגישת ייעוץ והתאמה",
    sending: "שולחים...",
    /** UI microcopy (not in the doc). */
    error: "משהו השתבש בשליחה. נסו שוב, או התקשרו אלינו.",
    after: "מנהל פרויקטים יחזור אליכם תוך יום עסקים אחד. לא נציג מכירות.",
    privacy: "הפרטים נשמרים במערכת שלנו לצורך חזרה אליכם בלבד.",
    privacyLink: { label: "מדיניות פרטיות", href: routes.privacy } satisfies LinkItem,
  },
  details: {
    title: "פרטים",
  },
  audience: {
    title: "לא בטוחים שאתם הקהל שלנו?",
    body: "אנחנו עובדים עם חברות של 10 עובדים ומעלה, עם לפחות שתי מחלקות שצריכות לדבר ביניהן. אם אתם קטנים יותר, אתם מוזמנים להשאיר פרטים ונראה אם אנחנו יכולים לעזור בכל זאת.",
    link: { label: "לספריית התהליכים", href: routes.processes } satisfies LinkItem,
  },
  /**
   * Thank-you pages. ponytail: the doc points to the structure doc (ch. 19) for
   * their wording, which was not supplied; these are holding lines built from
   * the contact page's own sentences until it arrives.
   */
  thanks: {
    a: {
      title: "קיבלנו את הפרטים.",
      body: "מנהל פרויקטים יחזור אליכם תוך יום עסקים אחד. לא נציג מכירות.",
      calendarIntro: "רוצים לקבוע כבר עכשיו? הפגישה בזום. עם צליל נוימן, לא עם נציג.",
    },
    b: {
      title: "קיבלנו את הפרטים.",
      body: "אנחנו עובדים בעיקר עם חברות של 10 עובדים ומעלה. נעבור על הפרטים ונראה אם אנחנו יכולים לעזור בכל זאת.",
    },
    home: { label: "לעמוד הבית", href: routes.home } satisfies LinkItem,
  },
} as const;
