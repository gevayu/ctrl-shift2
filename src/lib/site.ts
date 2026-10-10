/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper. Update the placeholder values per project.
 */
import { getServerEnv, publicEnv } from "@/env";

/**
 * Vercel's production domain, read at build time — the fallback when a deploy
 * doesn't set `NEXT_PUBLIC_SITE_URL` (none did: the live canonical said
 * localhost). Server-only: every consumer of `siteConfig` renders on the server.
 */
const vercelProduction = getServerEnv().VERCEL_PROJECT_PRODUCTION_URL;

export const siteConfig = {
  name: "Vexon",
  /** The home page's <title>: the brand + what it is (≤ 60 chars). */
  title: "Vexon — AI intelligence platform",
  /** The hero's own body copy — what the product does, in the page's words. */
  description:
    "Vexon AI unifies data, workflows, and signals into one intelligence system so SaaS teams can automate decisions and scale smarter.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url:
    publicEnv.NEXT_PUBLIC_SITE_URL ??
    (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000"),
  /** Default Open Graph / Twitter share image (path under `public/`). */
  ogImage: "/open-graph.jpg",
  /** Alt text for the share image. */
  ogImageAlt: "Vexon — “Where raw data becomes your unfair advantage” over a particle orb",
  /**
   * Blank until the brand holds a real handle — the starter's `@newproject`
   * would tag whoever owns it. The generator omits the Twitter site/creator
   * fields while this is empty.
   */
  twitterHandle: "",
  author: "Vexon",
  /** From the page's copy. */
  keywords: [
    "AI intelligence platform",
    "SaaS automation",
    "decision automation",
    "data unification",
    "workflow intelligence",
    "real-time analytics",
  ],
  /** Browser theme-color (address bar / PWA). */
  themeColor: "#000000",
} as const;
