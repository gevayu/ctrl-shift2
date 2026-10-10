"use client";

// 📖 Docs: obsidian/frontend/components/animation-springs.md

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

import { useRobot } from "@/components/common/robot-view";
import { useIntro } from "@/components/ui/intro";
import { vexonContent } from "@/data/mocks/home";
import { initPreloaderSphere } from "@/lib/scene/preloader-sphere";
import { EASE, MOTION_TRANSLATE_SPRING, MOTION_TWEEN } from "@/utils/animation/cubic-bezier";
import { fadeMask } from "@/utils/animation/fade-mask";

const { preloader: copy } = vexonContent;

/** motion's default enter — x/y spring, opacity tween — per key. */
const enterConfig = (key: string) => (key === "o" ? MOTION_TWEEN : MOTION_TRANSLATE_SPRING);

/** A rotating tag line; keyed by index, so each tag enters afresh (was motion `key={tagIndex}`). */
const TagLine = ({ text, first }: { text: string; first: boolean }) => {
  // The first tag entered at DOMContentLoaded on the old page — done before
  // this hydrates — so it is served at rest; later tags enter afresh.
  const [atRest] = useState(first);
  const { o, y } = useSpring({ from: atRest ? { o: 1, y: 0 } : { o: 0, y: 10 }, to: { o: 1, y: 0 }, config: enterConfig });
  // The fade as a mask (fade-mask.ts): same pixels, read at rest by axe.
  return (
    <animated.div style={{ y, maskImage: o.to(fadeMask) }} className="font-mono text-sm tracking-[0.5em] text-white">
      / {text}
    </animated.div>
  );
};

/**
 * The shipped preloader (vexon-old/src/components/Preloader.tsx): a 000→100
 * counter (1 per 20 ms), tag lines rotating every 400 ms, the 2D particle
 * sphere, then a 0.6 s blur-out — and the page's entrances begin 600 ms later.
 * motion's enter/exit are springs and tweens here (hard rule #1).
 */
/** No preloader on the robot form (D-016). */
export const Preloader = () => (useRobot() ? null : <LivePreloader />);

const LivePreloader = () => {
  const { finish } = useIntro();
  const [progress, setProgress] = useState(0);
  const [tagIndex, setTagIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [gone, setGone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  // Counter & Tag Switcher. The old page started its 20 ms counter and 400 ms
  // tag rotation the moment its bundle ran — at DOMContentLoaded. This one
  // hydrates later, so both are read off the clock since DOMContentLoaded
  // rather than counted from mount: the counter shows what the old one would
  // at that instant, and the hand-over lands at the same time (100 % at 2 s,
  // blur-out +400 ms, page +600 ms).
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const origin = nav?.domContentLoadedEventStart || performance.now();
    const timeouts: number[] = [];
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - origin;
      const next = Math.max(progressRef.current, Math.min(Math.floor(elapsed / 20), 100));
      progressRef.current = next;
      setProgress(next);
      setTagIndex(Math.floor(elapsed / 400) % copy.tags.length);
      if (next >= 100) {
        window.clearInterval(interval);
        const exitAt = origin + 2000 + 400;
        timeouts.push(
          window.setTimeout(() => {
            setIsVisible(false);
            timeouts.push(
              window.setTimeout(() => {
                setGone(true);
                finish();
              }, 600),
            );
          }, Math.max(0, exitAt - performance.now())),
        );
      }
    }, 20);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [finish]);

  // Particle Sphere Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return initPreloaderSphere(canvas, () => progressRef.current);
  }, []);

  const exit = useSpring({
    opacity: isVisible ? 1 : 0,
    scale: isVisible ? 1 : 1.05,
    filter: isVisible ? "blur(0px)" : "blur(40px)",
    config: { duration: 600, easing: EASE.inOutQuart },
  });

  if (gone) return null;

  return (
    <animated.div
      style={exit}
      aria-hidden={!isVisible}
      className="fixed inset-0 z-200 flex flex-col items-center justify-between bg-black p-10"
    >
      {/* Top Counter */}
      {/* Its 0.15 s enter ran at DOMContentLoaded on the old page — served at rest.
          46 % white, not 40 %: 40 % is 3.65:1 on black (the labels' tier, ≥ 4.5:1). */}
      <div className="flex w-full items-center justify-between font-mono text-xs tracking-[0.4em] text-white/46">
        <span>{copy.status}</span>
        <span className="text-white">{progress.toString().padStart(3, "0")}%</span>
      </div>

      {/* Central Sphere Overlay */}
      <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="z-0 h-full w-full" />
      </div>

      {/* Bottom Tags */}
      <div className="flex w-full flex-col items-center gap-6">
        <TagLine key={tagIndex} first={tagIndex === 0 && progress < 20} text={copy.tags[tagIndex]} />
        <div className="font-mono text-label uppercase tracking-[0.2em] text-white/46">{copy.footnote}</div>
      </div>
    </animated.div>
  );
};
