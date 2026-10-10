/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper.
 */
import { aboutParagraphs } from "@/data/about-text";
import { getServerEnv, publicEnv } from "@/env";

/**
 * Vercel's production domain, read at build time — the fallback when a deploy
 * doesn't set `NEXT_PUBLIC_SITE_URL`. Server-only: every consumer of
 * `siteConfig` renders on the server.
 */
const vercelProduction = getServerEnv().VERCEL_PROJECT_PRODUCTION_URL;

export const siteConfig = {
  name: "Ctrl+Shift",
  /** The home page's <title>, from the copy doc. */
  title: "Ctrl+Shift | הטמעת CRM, אוטומציות ו-AI לחברות של 10 עובדים ומעלה",
  /** The home page's meta description, from the copy doc. */
  description:
    "העסק גדל. הגיע הזמן שתדעו מה קורה בו. Ctrl+Shift מחזירה למנהלים שליטה בנתונים ומודדת מה השתנה: שעות, תקנים, זמן תגובה. לחברות של 10 עובדים ומעלה.",
  /**
   * The company in 150 words (copy doc), for the Organization JSON-LD — what
   * search engines and AI answers read about who the company is.
   */
  about: aboutParagraphs.join(" "),
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url:
    publicEnv.NEXT_PUBLIC_SITE_URL ??
    (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000"),
  /**
   * Default Open Graph / Twitter share image (path under `public/`).
   * ponytail: still the Vexon template's image; replace with a Ctrl+Shift one.
   */
  ogImage: "/open-graph.jpg",
  ogImageAlt: "Ctrl+Shift",
  twitterHandle: "",
  author: "Ctrl+Shift",
  locale: "he_IL",
  keywords: ["הטמעת CRM", "אוטומציות", "איפיון מערכת CRM", "Fireberry", "Monday", "Zoho", "אוריגמי", "AI לעסקים"],
  /** Browser theme-color (address bar / PWA). */
  themeColor: "#000000",
  contact: {
    phone: "054-7406064",
    phoneE164: "+972547406064",
    email: "office@ctrl-shift.co.il",
    street: "דם המכבים 28",
    city: "מודיעין-מכבים-רעות",
    hours: "ימים א' עד ה', 9:00 עד 18:00",
    /** schema.org openingHours for the same. */
    hoursSchema: "Su-Th 09:00-18:00",
  },
} as const;
