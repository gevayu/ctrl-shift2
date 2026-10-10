"use client";

// 📖 Docs: obsidian/frontend/components/animation-springs.md

import { animated, useSpring } from "@react-spring/web";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useRobot } from "@/components/common/robot-view";
import { useIntro } from "@/components/ui/intro";
import { useDynamicInView } from "@/hooks/animation/use-dynamic-in-view";
import { EASE, MOTION_TRANSLATE_SPRING, MOTION_TWEEN } from "@/utils/animation/cubic-bezier";
import { fadeMask } from "@/utils/animation/fade-mask";

/**
 * The shipped page's staggered reveals (App.tsx `containerVariants` /
 * `itemVariants` / `cardVariants`) as springs (hard rule #1). A group fades
 * in when it enters the viewport — on the same `amount` the old
 * `viewport={{ once: true, amount }}` used — and releases its items at
 * `delayChildren 0.2 s + index × staggerChildren 0.1 s`, each rising 100 px
 * out of a 10 px blur with motion's exact curve. Plays once, and only after
 * the preloader (the old content mounted then).
 */
const GroupContext = createContext({ active: false, mask: false });

/** Latches true the first time `when` is — `viewport={{ once: true }}`. */
const useOnce = (when: boolean) => {
  const [latched, setLatched] = useState(false);
  useEffect(() => {
    if (when) setLatched(true);
  }, [when]);
  return latched || when;
};

type RevealTag = "div" | "ul" | "li" | "p" | "h1";

export const RevealGroup = ({
  children,
  amount = 0,
  tag = "div",
  className,
  maskFade = false,
}: {
  children: React.ReactNode;
  /** The old `viewport.amount` (0 = "some"). */
  amount?: number;
  tag?: RevealTag;
  className?: string;
  /**
   * Fade the group and its items as a mask (fade-mask.ts) rather than
   * `opacity` — for the first screen only, whose entrance plays while
   * Lighthouse samples contrast. Below the fold the reveal plays mid-scroll,
   * where a mask changing every frame repaints the whole block (glass and
   * all: 250–490 ms frames in #about-vexon); and Lighthouse never scrolls, so
   * it only ever sees those at 0 (skipped).
   */
  maskFade?: boolean;
}) => {
  const { done } = useIntro();
  const robot = useRobot();
  const [ref, inView] = useDynamicInView({ threshold: amount });
  const active = useOnce(done && inView);
  const settled = useSettled();
  const { o } = useSpring({
    from: { o: robot ? 1 : 0 },
    to: { o: active || robot ? 1 : 0 },
    config: MOTION_TWEEN,
    onRest: () => active && settled.set(),
  });
  const shown = active || robot;
  const group = useMemo(() => ({ active: shown, mask: maskFade }), [shown, maskFade]);
  const Tag = animated[tag];
  return (
    <GroupContext.Provider value={group}>
      <Tag ref={ref} className={className} style={robot ? undefined : maskFade ? { maskImage: o.to(fadeMask) } : { opacity: o, willChange: settled.done ? undefined : PROMOTE }}>
        {children}
      </Tag>
    </GroupContext.Provider>
  );
};

/**
 * A below-the-fold reveal is promoted to its own layer from mount until its
 * entrance has played, then released. Promoted at load, the first frame of
 * the reveal is a composite; unpromoted, the browser builds and rasterises the
 * block's layer (glass and all) in the very frame the reveal starts — the
 * cold-only drops in #about-vexon (9 % there on PC). Ascend's fix (Fix
 * Catalog: "Pre-promote a hidden layer"). Released at rest, so nothing stays
 * a layer for the rest of the visit.
 */
const PROMOTE = "opacity, transform";

/** Latches once a reveal has played to its end (its spring's `onRest`). */
const useSettled = () => {
  const [done, setDone] = useState(false);
  return useMemo(() => ({ done, set: () => setDone(true) }), [done]);
};

const HIDDEN = { o: 0, y: 100, rotateX: 15, scale: 0.9, filter: "blur(10px)" };
const SHOWN = { o: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" };

export const RevealItem = ({
  children,
  index,
  duration = 800,
  tag = "div",
  className,
}: {
  children: React.ReactNode;
  /** Position among the group's items — the stagger slot. */
  index: number;
  /** 800 ms for `itemVariants`, 1600 ms for `cardVariants`. */
  duration?: number;
  tag?: RevealTag;
  className?: string;
}) => {
  const { active, mask } = useContext(GroupContext);
  const robot = useRobot();
  const settled = useSettled();
  const { o, ...motion } = useSpring({
    from: robot ? SHOWN : HIDDEN,
    to: active ? SHOWN : HIDDEN,
    config: { duration, easing: EASE.outExpo },
    delay: active ? 200 + index * 100 : 0,
    onRest: () => active && settled.set(),
  });
  // The robot form (D-016) renders the item at rest, no spring.
  if (robot) {
    const Plain = tag;
    return <Plain className={className}>{children}</Plain>;
  }
  const Tag = animated[tag];
  return (
    <Tag className={className} style={mask ? { ...motion, maskImage: o.to(fadeMask) } : { ...motion, opacity: o, willChange: settled.done ? undefined : PROMOTE }}>
      {children}
    </Tag>
  );
};

/** motion's default enter — x/y spring, opacity tween — per key. */
const enterConfig = (key: string) => (key === "o" ? MOTION_TWEEN : MOTION_TRANSLATE_SPRING);

/**
 * A one-off mount entrance with motion's default transition (the nav's
 * `initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}`), started
 * when the preloader hands over.
 */
export const EnterOnIntro = ({
  children,
  x = 0,
  y = 0,
  className,
}: {
  children: React.ReactNode;
  x?: number;
  y?: number;
  className?: string;
}) => {
  const { done } = useIntro();
  const robot = useRobot();
  const style = useSpring({
    // The robot form starts at rest (D-016) — the server HTML must too.
    from: robot ? { o: 1, x: 0, y: 0 } : { o: 0, x, y },
    to: done ? { o: 1, x: 0, y: 0 } : { o: 0, x, y },
    config: enterConfig,
  });
  const { o, ...move } = style;
  return (
    <animated.div style={{ ...move, maskImage: o.to(fadeMask) }} className={className}>
      {children}
    </animated.div>
  );
};

/**
 * The whole page fading in over 1 s once the preloader is gone (`duration: 1,
 * ease: "easeOut"`) — as a mask (fade-mask.ts): the same pixels, `opacity` 1.
 */
export const IntroFade = ({ children }: { children: React.ReactNode }) => {
  const { done } = useIntro();
  const robot = useRobot();
  const { o } = useSpring({
    from: { o: robot ? 1 : 0 },
    to: { o: done ? 1 : 0 },
    config: { duration: 1000, easing: EASE.out },
  });
  if (robot) return <div>{children}</div>;
  return <animated.div style={{ maskImage: o.to(fadeMask) }}>{children}</animated.div>;
};
