/**
 * Every built route, in one place. Views and content link through these keys,
 * never through literal paths, so a renamed route is a one-line change.
 *
 * Pages that the site map names but that are not built yet (client stories,
 * the blog, the control index, the team…) have no entry here: their links are
 * `null` in the content and render as plain text until the page exists.
 */
export const routes = {
  home: "/",
  services: "/services",
  discovery: "/services/discovery",
  implementation: "/services/implementation",
  support: "/services/support",
  faq: "/knowledge/faq",
  privacy: "/privacy-policy",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];
