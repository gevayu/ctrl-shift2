"use client";

import { useSyncExternalStore } from "react";

/** A mouse or trackpad that can hover — false on phones and tablets. */
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * Whether the primary pointer is a fine, hovering one. `false` on the server
 * and during hydration, so pointer-only decorations mount after hydration and
 * never at all on touch devices.
 */
export const useFinePointer = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
