"use client";

// 📖 Docs: obsidian/frontend/components/animation-springs.md

import { animated, useSpring } from "@react-spring/web";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ArrowUpRight } from "@/components/ui/icons";
import { MOTION_TWEEN } from "@/utils/animation/cubic-bezier";

/**
 * An about-card's interactive layer (was `CursorProvider` + `CursorFollow` +
 * `HoverCardImage` in vexon-old): the image sits at 0.65 scale and springs to
 * 0.95 on hover, drifting ±25 px toward the pointer; a pill label trails the
 * pointer inside the card. The old springs, as react-spring configs — motion's
 * stiffness/damping are react-spring's tension/friction (mass 1):
 *   image scale 60/25 · image drift 80/20 · pill follow 500/50 ·
 *   pill in/out scale 550/30 (critically damped toward 0) + a 0.3 s fade.
 */
export const HoverCard = ({
  src,
  alt,
  label,
  children,
}: {
  src: string;
  alt: string;
  label: string;
  /** The card's caption block, rendered above the image. */
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  // The pill: pointer position relative to the card, and whether it is inside.
  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });
  // The image: hover state and normalised pointer (0–1, centre 0.5).
  const [hovered, setHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    // A tap on a phone fires a synthetic mousemove with no mouseleave after
    // it, which left the pill floating over the card — touch gets no pill.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onMove = (e: MouseEvent) => {
      if (!finePointer.matches) return;
      const rect = parent.getBoundingClientRect();
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    };
    const onLeave = () => setCursor((c) => ({ ...c, active: false }));
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // The old follow offset: align bottom-right, sideOffset 15, plus half the
  // (absent) cursor's 20 px default — 25 px right of and below the pointer.
  const follow = useSpring({ left: cursor.x + 25, top: cursor.y + 25, config: { tension: 500, friction: 50 } });
  const pill = useSpring({
    scale: cursor.active ? 1 : 0,
    opacity: cursor.active ? 1 : 0,
    config: (key: string) =>
      key === "opacity" ? MOTION_TWEEN : { tension: 550, friction: cursor.active ? 30 : 2 * Math.sqrt(550) },
  });
  const drift = useSpring({ x: (pointer.x - 0.5) * 50, y: (pointer.y - 0.5) * 50, config: { tension: 80, friction: 20 } });
  const zoom = useSpring({ scale: hovered ? 0.95 : 0.65, config: { tension: 60, friction: 25 } });

  return (
    <div ref={ref} className="h-full w-full">
      <animated.div style={{ ...follow, ...pill }} className="pointer-events-none absolute z-9998">
        <div className="z-50 flex min-w-max items-center gap-1.5 whitespace-nowrap rounded-full border border-black/10 bg-white px-3 py-1.5 font-mono text-label uppercase tracking-widest text-black shadow-2xl">
          {label}
          <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </div>
      </animated.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-30"
        onMouseEnter={() => setHovered(true)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPointer({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
        }}
        onMouseLeave={() => {
          setPointer({ x: 0.5, y: 0.5 });
          setHovered(false);
        }}
      />
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <animated.div style={{ ...drift, ...zoom }} className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover opacity-60 transition-opacity duration-[var(--duration-slow)] group-hover:opacity-90"
          />
        </animated.div>
      </div>
      {children}
    </div>
  );
};
