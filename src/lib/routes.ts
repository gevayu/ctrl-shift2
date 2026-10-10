/**
 * Every built route, in one place. Views and content link through these keys,
 * never through literal paths, so a renamed route is a one-line change.
 *
 * Pages that the site map names but that are not built yet (the control
 * index, the team, the audience pages…) have no entry here: their links are
 * `null` in the content and render as plain text until the page exists.
 */
export const routes = {
  home: "/",
  services: "/services",
  discovery: "/services/discovery",
  implementation: "/services/implementation",
  support: "/services/support",
  stories: "/stories",
  faq: "/knowledge/faq",
  blog: "/knowledge/blog",
  processes: "/knowledge/processes",
  contact: "/contact",
  contactThanks: "/contact/thanks",
  contactThanksSmall: "/contact/thanks/small",
  privacy: "/privacy-policy",
} as const;

export const storyPath = (slug: string) => `${routes.stories}/${slug}`;
export const articlePath = (slug: string) => `${routes.blog}/${slug}`;
export const processPath = (slug: string) => `${routes.processes}/${slug}`;
