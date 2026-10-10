import Image from "next/image";
import Link from "next/link";

import { routes } from "@/lib/routes";

/** The light version: the navy wordmark turned white for the black page; the blue swoosh kept. */
const SRC = "/assets/logos/brand/ctrl-shift-light.png";
/** The file is 661 × 240. */
const RATIO = 661 / 240;

/** The Ctrl+Shift logo, linking home. `height` in px. */
export const BrandLogo = ({ height, priority = false }: { height: number; priority?: boolean }) => (
  <Link href={routes.home} className="inline-block shrink-0">
    <Image src={SRC} alt="Ctrl+Shift" width={Math.round(height * RATIO)} height={height} priority={priority} />
  </Link>
);
