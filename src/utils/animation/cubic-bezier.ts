/**
 * A CSS `cubic-bezier(x1, y1, x2, y2)` as an easing function for a
 * duration-based react-spring config — so the old page's motion curves
 * (`ease: [0.16, 1, 0.3, 1]` …) are reproduced exactly, not approximated by
 * the nearest named easing.
 */
export const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const ax = 3 * x1 - 3 * x2 + 1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 3 * y1 - 3 * y2 + 1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveT = (x: number) => {
    // Newton–Raphson, falling back to bisection where the slope is flat.
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return t;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const v = sampleX(t);
      if (Math.abs(v - x) < 1e-6) return t;
      if (x > v) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
      if (hi - lo < 1e-7) break;
    }
    return t;
  };

  return (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : sampleY(solveT(x)));
};

/** The old page's curves, by where they were used. */
export const EASE = {
  /** motion's `[0.16, 1, 0.3, 1]` — every reveal. */
  outExpo: cubicBezier(0.16, 1, 0.3, 1),
  /** motion's default tween for opacity / filter (0.3 s). */
  motionDefault: cubicBezier(0.25, 0.1, 0.35, 1),
  /** motion's `"easeOut"`. */
  out: cubicBezier(0, 0, 0.58, 1),
  /** The preloader's exit, `[0.76, 0, 0.24, 1]`. */
  inOutQuart: cubicBezier(0.76, 0, 0.24, 1),
  /** Tailwind's `animate-pulse` curve. */
  pulse: cubicBezier(0.4, 0, 0.6, 1),
  linear: (t: number) => t,
} as const;

/** motion's default spring for x / y (stiffness 500, damping 25). */
export const MOTION_TRANSLATE_SPRING = { tension: 500, friction: 25 } as const;
/** motion's default tween for opacity / filter. */
export const MOTION_TWEEN = { duration: 300, easing: EASE.motionDefault } as const;
