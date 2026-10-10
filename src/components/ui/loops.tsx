"use client";

// 📖 Docs: obsidian/frontend/components/animation-springs.md

import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";

import { useIntro } from "@/components/ui/intro";
import { useMotionOff } from "@/hooks/animation/use-motion-off";

import { EASE } from "@/utils/animation/cubic-bezier";

/**
 * The shipped page's endless motions as looping springs (hard rule #1 — no
 * CSS keyframes): the spinning diamond star, the pulsing dot, the logo
 * marquee. Durations and curves are the old ones. Each starts when the
 * preloader hands over — the old page mounted them then, so their phase
 * (the star's angle, the marquee's offset) matches it.
 */

/** The four-point star, spinning on Y once every 3 s, linear (was motion `rotateY: 360, repeat: Infinity`). */
export const DiamondStar = ({ className }: { className?: string }) => {
  const { done } = useIntro();
  // Reduced motion / robot form: react-spring skips animation and a loop
  // would restart every tick — the motion rests instead.
  const motionOff = useMotionOff();
  const style = useSpring({
    pause: !done,
    from: { rotateY: 0 },
    to: { rotateY: 360 },
    loop: !motionOff,
    config: { duration: 3000, easing: EASE.linear },
  });
  return (
    <animated.span aria-hidden="true" style={{ ...style, transformStyle: "preserve-3d" }} className={`block ${className ?? ""}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="currentColor">
        <path d="M50 0C50 35 65 50 100 50C65 50 50 65 50 100C50 65 35 50 0 50C35 50 50 35 50 0Z" />
      </svg>
    </animated.span>
  );
};

/** Tailwind's `animate-pulse` — opacity 1 → 0.5 → 1 over 2 s on cubic-bezier(.4,0,.6,1). */
export const PulseDot = ({ className }: { className?: string }) => {
  const { done } = useIntro();
  // Reduced motion / robot form: react-spring skips animation and a loop
  // would restart every tick — the motion rests instead.
  const motionOff = useMotionOff();
  const style = useSpring({
    pause: !done,
    from: { opacity: 1 },
    to: { opacity: 0.5 },
    loop: motionOff ? false : { reverse: true },
    config: { duration: 1000, easing: EASE.pulse },
  });
  return <animated.span style={style} className={className} />;
};

/**
 * The logo ticker: the row (written twice) slides −50 % every 40 s, linear,
 * and holds while hovered — the old `animation: marquee 40s linear infinite`
 * with `hover:[animation-play-state:paused]`.
 */
export const Marquee = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { done } = useIntro();
  // Reduced motion / robot form: react-spring skips animation and a loop
  // would restart every tick — the motion rests instead.
  const motionOff = useMotionOff();
  const [paused, setPaused] = useState(false);
  const style = useSpring({
    from: { x: "0%" },
    to: { x: "-50%" },
    loop: !motionOff,
    pause: paused || !done,
    config: { duration: 40000, easing: EASE.linear },
  });
  return (
    <animated.div
      style={style}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={className}
    >
      {children}
    </animated.div>
  );
};
