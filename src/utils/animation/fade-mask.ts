/**
 * An opacity fade drawn as a mask: `fadeMask(a)` paints exactly what
 * `opacity: a` paints (a uniform alpha over the element and its children),
 * while the element's `opacity` stays 1.
 *
 * Why: Lighthouse's accessibility pass (axe) reads `opacity` and samples the
 * page whenever its load settles — on vexon that was mid-way through the
 * 1 s page fade after the preloader, and every label in #mission-intelligence
 * failed contrast at 1.2–3.3:1 though each passes at rest. With the fade in
 * the mask, the check reads the resting colours on every frame; a person sees
 * the same pixels.
 *
 * `none` at rest — a mask left on would make the element a backdrop root and
 * cut the frosted glass inside it (the CTA, the about section, the cards) off
 * from what it blurs.
 */
export const fadeMask = (a: number): string => {
  if (a >= 0.999) return "none";
  const v = Math.max(0, a).toFixed(3);
  return `linear-gradient(rgba(0,0,0,${v}),rgba(0,0,0,${v}))`;
};
