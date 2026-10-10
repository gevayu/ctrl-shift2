// 📖 Docs: obsidian/frontend/content.md

/**
 * Vexon's page copy — the shipped site's strings (vexon-old/src/App.tsx and
 * components/Preloader.tsx), verbatim. Content lives here, never in the view
 * (hard rule #4).
 */

export interface Card {
  index: string;
  title: string;
  body: string;
  /** The cursor-follow pill's label. */
  cursor: string;
  image: string;
  alt: string;
}

export const vexonContent = {
  brand: "VEXON",
  version: "[ V.01.3.N ]",
  nav: [
    { label: "AI INTELLIGENCE", href: "#ai-intelligence" },
    { label: "ABOUT VEXON", href: "#about-vexon" },
    { label: "MISSION INTELLIGENCE", href: "#mission-intelligence" },
  ],
  preloader: {
    status: "[ SYSTEM_READY ]",
    tags: ["DATA INTELLIGENCE", "NEURAL WORKFLOWS", "SYSTEM AUTOMATION", "SCALABLE SIGNALS", "VEXON®"],
    footnote: "Initializing Secure Environment",
  },
  hero: {
    eyebrow: "[ AI INTELLIGENCE ]",
    lines: ["WHERE RAW DATA", "BECOMES YOUR", "UNFAIR ADVANTAGE"],
    mark: "A",
    counter: "[ 001 / 003 ]",
    body: "Vexon AI unifies data, workflows, and signals into one intelligence system so SaaS teams can automate decisions and scale smarter.",
    primary: "building with ai",
    secondary: "Watch Demo",
  },
  about: {
    eyebrow: "/ about vexon",
    heading:
      "Our technology analyzes subtle data cues, emotional patterns, and visual energy signatures to generate a personalized reading just for you.",
    body: "Think of it as a mirror for your inner world—revealing the colors, moods, and energy you project into the universe. Whether you're here for self-discovery, spiritual curiosity, or just for fun.",
    cards: [
      {
        index: "[1]",
        title: "Signal Capture",
        body: "Every click, churn signal, and revenue event — ingested in real time. No SQL. No data team required.",
        cursor: "Read More",
        image: "/assets/card-signal-capture.png",
        alt: "Digital Architecture",
      },
      {
        index: "[2]",
        title: "Pattern Engine",
        body: "AI surfaces what matters: who's about to convert, who's about to leave, and why — before it happens.",
        cursor: "Explore",
        image: "/assets/card-pattern-engine.png",
        alt: "Perception Network",
      },
      {
        index: "[3]",
        title: "Action Layer",
        body: "Triggers that fire automatically. Slack alerts, CRM updates, onboarding flows — driven by data, not gut feeling.",
        cursor: "Deploy",
        image: "/assets/card-action-layer.png",
        alt: "Energy Background",
      },
    ] satisfies Card[],
  },
  mission: {
    brand: "VEXON",
    /** Orbitron has no ®: the old page drew it from the plain system sans (see the view). */
    mark: "®",
    established: "[ established 2024 ]",
    eyebrow: "/ mission intelligence:",
    headingLead: "Figures for any",
    headingAccent: "innovation",
    meta: "propulsion systems for modern workflows.",
    body: "Transform your raw data signatures into high-fidelity patent figures and technical schemas. Our rendering engine produces clean, publication-ready visuals across complex diagrams, UI architecture, and neural mapping patterns.",
    cta: "Read philosophy",
    /** The marquee row — listed twice in the old page so the -50 % loop is seamless. */
    companies: ["Medium", "Outreach", "Adobe", "Framer", "Amazon", "GitHub", "Hopin", "Notion", "Linear", "Vercel"],
  },
} as const;

export type VexonContent = typeof vexonContent;
