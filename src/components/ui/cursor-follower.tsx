"use client";

import { useEffect, useRef, useState } from "react";

import { subscribeToTicker } from "@/lib/animation/ticker";
import { useRobot } from "@/components/common/robot-view";
import { useFinePointer } from "@/hooks/use-fine-pointer";

const INTERACTIVE = "a, button, img, input, textarea, select";
const DOT_SMOOTHNESS = 0.2;
const BORDER_DOT_SMOOTHNESS = 0.1;

/**
 * The shipped page's custom cursor (vexon-old/src/components/ui/
 * cursor-follower.tsx): a 10 px difference-blended dot easing toward the
 * pointer by 0.2 a frame and a 40 px ring by 0.1, the ring growing to 80 px
 * over interactive elements. The old component re-rendered React every frame;
 * this one writes the two positions straight to the elements from the shared
 * ticker — the same per-frame lerp, no re-render. The ring's size change is a
 * discrete hover state, so it stays a CSS transition (hard rule #1 exception).
 * The native cursor is no longer hidden (ADR-0028): dot and ring trail it.
 */
/**
 * No pointer on the robot form (D-016), and none on touch devices: a phone has
 * no cursor to trail, so the dot and ring only sat at the top-left corner and
 * jumped to each tap (owner review, D-033). Not rendered → no ticker loop and
 * no listeners either.
 */
export const CursorFollower = () => {
  const robot = useRobot();
  const finePointer = useFinePointer();
  return robot || !finePointer ? null : <LiveCursorFollower />;
};

const LiveCursorFollower = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const dot = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    // Delegated, where the old page bound mouseenter/leave to every match.
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setIsHovering(!!target?.closest?.(INTERACTIVE));
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    const unsubscribe = subscribeToTicker(() => {
      dot.x += (mouse.x - dot.x) * DOT_SMOOTHNESS;
      dot.y += (mouse.y - dot.y) * DOT_SMOOTHNESS;
      ring.x += (mouse.x - ring.x) * BORDER_DOT_SMOOTHNESS;
      ring.y += (mouse.y - ring.y) * BORDER_DOT_SMOOTHNESS;
      if (dotRef.current) {
        dotRef.current.style.left = `${dot.x}px`;
        dotRef.current.style.top = `${dot.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.x}px`;
        ringRef.current.style.top = `${ring.y}px`;
      }
    }, () => 0);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      unsubscribe();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-300">
      <div ref={dotRef} className="absolute left-0 top-0 size-2.5 -translate-1/2 rounded-full bg-white mix-blend-difference" />
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 -translate-1/2 rounded-full border border-white/30 transition-[width,height] duration-[var(--duration-ring)] ${isHovering ? "size-20" : "size-10"}`}
      />
    </div>
  );
};
