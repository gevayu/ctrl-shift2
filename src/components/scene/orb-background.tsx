"use client";

// 📖 Docs: obsidian/frontend/scene-3d.md

import { animated, useSpringValue } from "@react-spring/web";
import { useEffect, useRef } from "react";

import { useRobot } from "@/components/common/robot-view";
import { useIntro } from "@/components/ui/intro";

/** The orb at rest, captured from the running scene — the robot form's backdrop. */
const ORB_STILL = { desktop: "/assets/robot/orb-desktop.webp", mobile: "/assets/robot/orb-mobile.webp" };

/** scrollY 0 → 800 px scales the orb 1 → 1.2 (the old `useTransform(scrollY, [0, 800], [1, 1.2])`). */
const scaleFor = (y: number) => 1 + Math.min(Math.max(y / 800, 0), 1) * 0.2;

/**
 * The fixed full-viewport particle orb behind the page (was the motion.div +
 * ParticleOrb in App.tsx). Its scale follows the scroll directly — the old
 * transform was scroll-linked with no smoothing — and the scene module (three
 * + shaders) is imported after mount, so it is its own chunk.
 */
export const OrbBackground = () => {
  // The robot form (D-016): a still, no WebGL.
  if (useRobot()) {
    return (
      <picture>
        <source media="(min-width: 640px)" srcSet={ORB_STILL.desktop} />
        <img src={ORB_STILL.mobile} alt="" aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 block h-screen w-screen object-cover" />
      </picture>
    );
  }
  return <LiveOrbBackground />;
};

const LiveOrbBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const control = useRef({ started: false });
  const { done } = useIntro();
  const scale = useSpringValue(1);

  useEffect(() => {
    control.current.started = done;
    if (!done) return;
    const onScroll = () => scale.set(scaleFor(window.scrollY));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done, scale]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    void import("@/lib/scene/particle-orb").then(({ initParticleOrb }) => {
      if (!cancelled) cleanup = initParticleOrb(mount, control.current);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <animated.div style={{ scale }} aria-hidden="true" className="fixed inset-0 z-0 origin-center">
      {/* The hot light plume above the halo, matching the video's top glow. */}
      <div ref={mountRef} className="orb-plume h-full w-full" />
    </animated.div>
  );
};
