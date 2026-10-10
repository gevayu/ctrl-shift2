import { OrbBackground } from "@/components/scene/orb-background";
import { Preloader } from "@/components/scene/preloader";
import { RobotProvider, RobotView } from "@/components/common/robot-view";
import { CursorFollower } from "@/components/ui/cursor-follower";
import { IntroProvider } from "@/components/ui/intro";
import { IntroFade } from "@/components/ui/reveal";

import { MobileBar } from "./mobile-bar";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * The frame every page shares: header, footer, the phone bar, the cursor, and
 * the particle orb behind it all.
 *
 * `intro` is the home page's entrance — the preloader, then the page fading
 * in. Inner pages skip it: the intro is handed over at once (IntroProvider's
 * `robot` flag means exactly that), so their scroll reveals run from the first
 * frame and the server HTML is the page at rest, no hidden first screen.
 * `robot` is the home page's crawler form (D-016).
 */
export const SiteShell = ({
  children,
  intro = false,
  robot = false,
}: {
  children: React.ReactNode;
  intro?: boolean;
  robot?: boolean;
}) => {
  const frame = (
    <>
      <SiteHeader />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
      <MobileBar />
    </>
  );
  return (
    <RobotProvider robot={robot}>
      {robot && <RobotView />}
      <IntroProvider robot={robot || !intro}>
        <div className="relative min-h-screen bg-page font-sans text-ink">
          {intro && <Preloader />}
          <OrbBackground />
          {intro ? <IntroFade>{frame}</IntroFade> : frame}
          <CursorFollower />
        </div>
      </IntroProvider>
    </RobotProvider>
  );
};
