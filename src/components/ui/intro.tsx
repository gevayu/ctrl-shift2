"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useScroll } from "@/hooks/smooth-scroll/use-scroll";

/**
 * The preloader → page handshake. The shipped page mounted its content only
 * once the preloader finished (`loading` in App.tsx), so every entrance — the
 * nav, the hero's in-view reveals, the orb's fly-in — started then. Here the
 * content is server-rendered (crawlable, no layout jump) and every entrance is
 * gated on `done` instead. While the preloader runs, scrolling is locked and
 * the page held at the top, as the old page did.
 */
const IntroContext = createContext<{ done: boolean; finish: () => void }>({ done: true, finish: () => {} });

export const IntroProvider = ({ children, robot = false }: { children: React.ReactNode; robot?: boolean }) => {
  // The robot form (D-016) has no preloader: the page is handed over at once.
  const [done, setDone] = useState(robot);
  const stop = useScroll((s) => s.stop);
  const start = useScroll((s) => s.start);

  useEffect(() => {
    if (done) {
      start();
      return;
    }
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    stop();
  }, [done, start, stop]);

  const finish = useCallback(() => setDone(true), []);
  const value = useMemo(() => ({ done, finish }), [done, finish]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
};

export const useIntro = () => useContext(IntroContext);
