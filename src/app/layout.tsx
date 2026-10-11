import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";

import { LazyCookie } from "@/components/common/Cookie";
import { CONSENT_FLAG_SCRIPT } from "@/components/common/Cookie/consent-flag";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { ScrollLayout } from "@/layouts/scroll-layout";

import "@/app/globals.css";

/**
 * One face across the whole site: OZ Kriti Narrow (Omer Zofy, client's
 * licence, 2026-10-11), self-hosted from `src/assets/fonts/`. It carries
 * Hebrew, Latin and digits, so every role uses it. The licence forbids
 * redistributing the font files: they are git-ignored, never committed.
 */
const kriti = localFont({
  variable: "--font-kriti",
  display: "swap",
  // A narrow face reads small at the sizes the layout was set in; scale the
  // glyphs 10% instead of re-tuning every text size.
  declarations: [{ prop: "size-adjust", value: "110%" }],
  src: [
    { path: "../assets/fonts/oz-kriti-narrow/OZKritiNarrow-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../assets/fonts/oz-kriti-narrow/OZKritiNarrow-Light.woff2", weight: "300", style: "normal" },
    { path: "../assets/fonts/oz-kriti-narrow/OZKritiNarrow-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/oz-kriti-narrow/OZKritiNarrow-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/oz-kriti-narrow/OZKritiNarrow-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/oz-kriti-narrow/OZKritiNarrow-Bold.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/oz-kriti-narrow/OZKritiNarrow-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../assets/fonts/oz-kriti-narrow/OZKritiNarrow-Black.woff2", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-consent` is set on <html> by CONSENT_FLAG_SCRIPT before hydration.
    <html suppressHydrationWarning lang="he" dir="rtl">
      <body className={kriti.variable}>
        {/* Before anything is parsed: marks a returning visitor's choice so the
            server-rendered consent banner is hidden before its first paint. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_FLAG_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData()),
          }}
        />
        <ScrollLayout>
          <ReducedMotion />
          <LazyCookie />
          {children}
        </ScrollLayout>
      </body>
    </html>
  );
}
