"use client";

// 📖 Docs: obsidian/frontend/components/animation-springs.md

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useMemo, useState } from "react";

import { useRobot } from "@/components/common/robot-view";
import { useIntro } from "@/components/ui/intro";
import { useDynamicInView } from "@/hooks/animation/use-dynamic-in-view";
import { EASE, MOTION_TWEEN } from "@/utils/animation/cubic-bezier";

/**
 * The shipped page's `TextEffect preset="blur"` (vexon-old/src/components/ui/
 * text-effect.tsx) as springs: the text split per character or per word, each
 * piece fading in out of a 12 px blur, 50 ms apart (the container's
 * `staggerChildren: 0.05` overrode the per-mode default), after `delay`
 * seconds; triggered once on the old `viewport={{ once, margin: "-50px" }}`.
 * The same span structure, so it wraps exactly as before.
 */
const STAGGER = 50;
/** Each piece's tween — MOTION_TWEEN's duration. */
const PIECE_MS = MOTION_TWEEN.duration;
const OBSERVER = { rootMargin: "-50px" };

/** Characters split into runs: each word, and each space on its own. */
const wordsOf = (chars: string[]) => {
  const runs: { start: number; chars: string[] }[] = [];
  chars.forEach((char, i) => {
    const last = runs[runs.length - 1];
    const space = /\s/.test(char);
    if (last && !space && !/\s/.test(last.chars[0])) last.chars.push(char);
    else runs.push({ start: i, chars: [char] });
  });
  return runs;
};

type Tag = "div" | "span" | "h2";

export const TextEffect = ({
  children,
  per = "word",
  as = "p",
  delay = 0,
  className = "",
}: {
  children: string;
  per?: "word" | "char";
  as?: Tag | "p";
  /** Seconds, as the old prop. */
  delay?: number;
  className?: string;
}) => {
  const { done } = useIntro();
  const [ref, inView] = useDynamicInView(OBSERVER);
  const [latched, setLatched] = useState(false);
  useEffect(() => {
    if (done && inView) setLatched(true);
  }, [done, inView]);
  const robot = useRobot();
  const active = robot || latched || (done && inView);

  const segments = per === "word" ? children.split(/(\s+)/) : children.split("");

  // One clock per text (ms since it started), not one spring per piece: the
  // hand-over re-rendered every TextEffect's springs (~110 controllers) in one
  // ~430 ms task on a phone. Each piece reads the same clock — its own 300 ms
  // tween (MOTION_TWEEN's curve) starting `delay + i × 50 ms` in, exactly the
  // old timeline. The container's fade rides the same clock and stays
  // `opacity`: a mask here would override the design's own `mask-fade-in/out`
  // classes, and the container's only text is the sr-only copy (the pieces
  // are aria-hidden), so axe has nothing of it to sample mid-fade.
  const startMs = delay * 1000;
  const total = startMs + (segments.length - 1) * STAGGER + PIECE_MS;
  const { t } = useSpring({
    from: { t: robot ? total : 0 },
    to: { t: active ? total : 0 },
    config: { duration: total, easing: EASE.linear },
    immediate: !active,
  });
  // Built once per text: the hand-over re-render must not rebuild them.
  const containerOpacity = useMemo(() => t.to((v) => EASE.motionDefault(v / PIECE_MS)), [t]);
  const pieceStyles = useMemo(
    () =>
      Array.from({ length: segments.length }, (_, i) => {
        const p = t.to((v) => EASE.motionDefault((v - startMs - i * STAGGER) / PIECE_MS));
        return { opacity: p, filter: p.to((v) => `blur(${12 * (1 - v)}px)`) };
      }),
    [t, segments.length, startMs],
  );

  const Tag = animated[as];
  return (
    // The text's name is the sr-only copy below: `aria-label` is prohibited on
    // a generic element (span/div/p — axe aria-prohibited-attr), and the split
    // pieces are aria-hidden. `dir="auto"`: the pieces are inline-blocks, which
    // the bidi algorithm orders by the paragraph's direction, so on the RTL page
    // a Latin word came out mirrored ("ATAD"). The text's first strong character
    // now sets the order: Hebrew runs right to left, Latin left to right.
    <Tag ref={ref} dir="auto" style={{ opacity: containerOpacity }} className={`whitespace-pre-wrap ${className}`}>
      <span className="sr-only">{children}</span>
      {per === "word"
        ? segments.map((segment, i) => (
            <animated.span key={`word-${i}-${segment}`} aria-hidden="true" style={pieceStyles[i]} className="inline-block whitespace-pre">
              {segment}
            </animated.span>
          ))
        : // Characters grouped per word in a no-wrap box: a line may only
          // break between words — never inside one ("DA / TA").
          wordsOf(segments).map(({ start, chars }) => (
            <span key={`w-${start}`} className="inline-block whitespace-nowrap">
              {chars.map((segment, j) => (
                <span key={`char-${start + j}-${segment}`} className="inline-block whitespace-pre">
                  <animated.span aria-hidden="true" style={pieceStyles[start + j]} className="inline-block whitespace-pre">
                    {segment}
                  </animated.span>
                </span>
              ))}
            </span>
          ))}
    </Tag>
  );
};
