import Image from "next/image";

import { Marquee } from "@/components/ui/loops";
import type { Logo } from "@/data/logos";

/** Every logo gets the same visual area (px²), within these bounds. */
const AREA = 4200;
const MAX_H = 64;
const MAX_W = 180;

/**
 * The marquee slides one half of its row; each half must outrun the widest
 * screen or a gap opens on the left. Short lists (the four partners) repeat.
 */
const MIN_PER_HALF = 12;

/**
 * Equal-area sizing: a wide wordmark and a round badge read at the same
 * weight, which equal heights never do (the wordmark would dwarf the badge).
 */
const sizeOf = ({ w, h }: Logo) => {
  const ratio = w / h;
  let height = Math.min(MAX_H, Math.sqrt(AREA / ratio));
  let width = ratio * height;
  if (width > MAX_W) {
    width = MAX_W;
    height = width / ratio;
  }
  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * A row of logos sliding on the template's spring marquee (written twice for a
 * seamless loop, held on hover). Grey at rest, white under the pointer. The
 * moving row is decoration; the names are listed once for screen readers.
 */
export const LogoMarquee = ({ dir, items }: { dir: string; items: readonly Logo[] }) => {
  const half = Array.from({ length: Math.ceil(MIN_PER_HALF / items.length) }, () => items).flat();
  return (
    <>
      <ul className="sr-only">
        {items.map((logo) => (
          <li key={logo.slug}>{logo.name}</li>
        ))}
      </ul>
      <div dir="ltr" aria-hidden="true" className="-mx-6 overflow-hidden md:-mx-10">
        <Marquee className="flex w-max items-center">
          {[...half, ...half].map((logo, i) => {
            const { width, height } = sizeOf(logo);
            return (
              <span key={i} className="mx-8 flex h-20 shrink-0 items-center md:mx-12">
                <Image
                  src={`${dir}/${logo.slug}.png`}
                  alt=""
                  width={width}
                  height={height}
                  sizes={`${width}px`}
                  className="opacity-50 transition-opacity duration-[var(--duration-fast)] ease-entrance hover:opacity-100"
                />
              </span>
            );
          })}
        </Marquee>
      </div>
    </>
  );
};
