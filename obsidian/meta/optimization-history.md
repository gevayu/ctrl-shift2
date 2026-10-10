---
tags: [meta, performance, seo]
updated: 2026-10-06
---

# Optimization history — Vexon

What the optimization pipeline did to this project, why, and what must not be
undone. Maintained by the optimization pipeline
(`getlayers-pipeline/optimization-pipeline`, full record with every run in
`obsidian/Projects/vexon.md` there; D-numbers refer to its
`obsidian/Meta/decisions-log.md`). This file is the condensed version for an
agent editing the project. The narrative per change is in [[changelog]]; the
architecture decisions (ADR-0026 rem grid off, ADR-0027 three pinned to
0.169.0, ADR-0028 native cursor) are in [[decisions-log]]. Last updated
2026-10-06.

Vexon is a **rebuild**: the published template was a Vite + React site
(`vexon-old`), ported 1:1 onto the Next 16 starter on 2026-10-01 (D-021/D-022/
D-023), then optimized.

## Current state

| | value | date / source |
|---|---|---|
| Status | **optimized** | 2026-10-03 (hosted record after the scroll wave) |
| Lighthouse mobile | **99** / A11y 100 / BP 100 / SEO 100 | 2026-10-04, D-029 production sweep |
| Lighthouse desktop | **99** / 100 / 100 / 100 | 2026-10-04, same |
| Robot form (PSI UA) | 100/100/100/100 desktop and mobile | 2026-10-04, same |
| Scroll PC / mobile | **ideal** (0.64 %, max 26 ms) / **ideal** (0.25 %, max 33 ms) | 2026-10-06, D-031 production sweep |
| After pass-2 (D-033) | local only: mobile 95 / desktop 100, 100s — no hosted record yet | 2026-10-06 |
| Live URL | https://getlayers-vexon-uyisdagfvuhbskjflna.vercel.app (Vercel, textura-agency) | `main` |

## Invariants — do not undo

- **Consent banner is server-rendered** (`src/components/common/Cookie/`). Its
  paragraph was the phone LCP: LCP 3.70 → 1.40 s, mobile 74 → 87.
- **Robot form** — `src/proxy.ts` rewrites bot UAs (`src/utils/bot-ua.ts`,
  incl. GPTBot/ClaudeBot/PerplexityBot…) to `src/app/robot-view/` (D-016): no
  preloader (intro starts done), the orb as a still, TextEffect / EnterOnIntro
  / reveals at rest, no cursor. Same content as people.
- **No empty `loading.tsx`** — with it, GPTBot read the `<h1>` inside
  `<div hidden>` (1,619 chars hidden → 0 after deletion, verified in prod).
- **Orb geometry is built in a module Worker**
  (`src/lib/scene/orb-geometry.worker.ts`, `orb-geometry.ts`,
  `particle-orb.ts`); `frustumCulled = false`; `compileAsync` before the
  points join. Removed ~120 ms of orb init from the main thread.
- **One clock per TextEffect** (`src/components/ui/text-effect.tsx`) instead
  of one spring per character — the preloader hand-over re-rendered ~110
  springs: hand-over task 403 → 103 ms, mobile TBT 359–380 → 80–101 ms.
- **TextEffect's accessible name is an `sr-only` copy**, not `aria-label` on a
  span (`aria-prohibited-attr`; A11y 92 → 96).
- **Letters are grouped per word in a `whitespace-nowrap` box** (TextEffect
  `per="char"`), and the phone hero uses `--text-hero-fit:
  calc((100vw - 3rem) / 9.2)` (`globals.css`, `views/home.tsx`) — otherwise
  titles break mid-word on phones ("DA/TA", "ADVANT/AGE") (D-033).
- **First-screen fades are a `fadeMask`** (`src/utils/animation/fade-mask.ts`,
  used by `reveal.tsx`, `preloader.tsx`), removed at rest, opacity stays 1 —
  axe sampled the 1 s page fade at 1.12–3.33:1. **Not on the TextEffect
  container** (flattens the headline gradient) and **not below the fold**
  (glass repaint, 250–490 ms frames).
- **Below-fold reveals are pre-promoted** (`will-change: opacity, transform`
  from mount until they finish, then released; `components/ui/reveal.tsx`).
  PC cold dropped 0.77 → 0.34 %, `#about-vexon` glass 4.6 → 1.7 %. No mask on
  the glass.
- **Contrast floors** — labels at 46 % white (`text-white/46`, was 20–40 %),
  eyebrow + nav version tag `opacity-52` (was 50), preloader status 46 %.
  The 20 % marquee words are CSS generated content + an `sr-only` list of the
  names. Robot A11y 96 → 100.
- **Cursor follower only on `(hover: hover) and (pointer: fine)`**
  (`src/components/ui/cursor-follower.tsx`, `useSyncExternalStore`, mounts
  after hydration). The about cards' hover pill is gated too. **Native cursor
  is never hidden** (D-024 / ADR-0028).
- **Lenis options are the old page's** (duration 1.2, expo-out,
  touchMultiplier 2) — 1:1 scroll feel (rebuild acceptance, D-023).
- **"®" in VEXON® uses the system font** (Orbitron has no ® glyph).
- **Origin** — `siteConfig.url` = `NEXT_PUBLIC_SITE_URL` → Vercel production
  domain → localhost (D-019).

## Owner decisions

- **D-021 / D-022 / D-023** (2026-09-30 → 10-01) rebuild from `vexon-old` on
  the starter; accepted on 1:1 visuals + motion (`compare-rebuild` "=" at
  1440/1024/390, `compare-motion` strips). Owner: "all good" (2026-10-01).
- **D-024** (2026-10-01) native cursor stays; the custom one floats as a
  follower; zero console errors (→ `/privacy-policy` added, banner link 404'd).
- **D-016** robots get a static page.
- **D-026 / D-028 / D-029** A11y/BP/SEO 100 everywhere; perf ≥ 90 both.
  Two labels are slightly brighter for contrast — flagged for the owner.
- **D-031** scroll ideal on both devices.
- **D-033** (2026-10-06) owner: remove the floating pointer on mobile, fix
  the title wrap on mobile, favicon + OpenGraph. Done in `b76baf5`.
- **D-034** (2026-10-06) pass-2 merged to main; iOS toolbar / phone caps only
  when the owner notices.

## History by pass

- **Rebuild** (2026-10-01, `main`): `19395d8` port (orb `particle-orb.ts` line
  for line, `preloader-sphere.ts`, card images moved into `public/assets/`,
  semantics only: `<main>`, `ul/li`, `h2/h3`); `3e4c0e6` Lenis options;
  `a70be3f` native cursor; `4622d93` privacy page (console clean).
- **Pass 1** (2026-10-01, `25342fe`) — hosted baseline PC 98 / mobile 74,
  A11y 92, scroll smooth/smooth.
  - banner SSR + D-019 origin + robot form → mobile 74 → 87, LCP 3.70 → 1.40 s;
    scroll → ideal both
  - TextEffect `sr-only` name → A11y 92 → 96
  - labels 46 %, marquee as generated content → robot A11y 100
  - orb geometry in a Worker → orb script gone from the busiest runs (score flat)
  - after: PC 100 / mobile 87, A11y 96 (people; fade sampling), scroll ideal both
- Fleet: `fb8374c` AI crawlers → robot form (2026-10-02); `62486fc` empty
  `loading.tsx` deleted (2026-10-03).
- **D-028** (2026-10-03, `fa49591`) — fadeMask on the first screen, one clock
  per TextEffect, contrast bumps. Mobile 83–88 → 93 local; hosted PC 100 /
  mobile 98, A11y 100, axe-sweep 0; desktop scroll smooth (2.09 % cold at the
  about glass).
- **Scroll wave** (2026-10-03, `5e28647`) — below-fold reveals pre-promoted.
  Hosted PC 99 / mobile 98, scroll ideal both (0.68 % / 0.21 %). Optimized.
- **D-029 sweep** (2026-10-04) 99/99, robot 100; **D-031 sweep** (2026-10-06)
  scroll ideal both.
- **Pass 2 / D-033** (2026-10-06, `optimize/pass-2`, `b76baf5`, on main) —
  cursor off on touch; whole-word title wrap + `text-hero-fit`; brand kit
  (Orbitron "V" mark, title "Vexon — AI intelligence platform", author
  Vexon (was "New Project"), `@newproject` removed, OG 1200×630). Local mobile
  95 / desktop 100, 100s. Not verified on a real iPhone.

## Tried and reverted / didn't help

- `fadeMask` on the TextEffect container — flattened the headline's gradient.
- Masks on below-fold reveals — the glass repainted (250–490 ms frames); the
  fix there is pre-promotion.
- Orb Worker did not move the Lighthouse score (Lantern TBT 486 → 450–470);
  kept for the main-thread work it removes.

## Open items / leads

- No hosted record after pass-2 (D-033); local mobile 95.
- Robot mobile Lighthouse read 86 in D-028 local runs (people 98); the
  2026-10-04 production sweep read robot mobile 100.
- QA vs live diffs (28 % / 17 %) are the particles' random positions and the
  headline mid-reveal — looked at, not a defect.

## How to measure

```sh
cd getlayers-pipeline/optimization-pipeline
node tools/measure.mjs vexon                  # local build: Lighthouse + scroll, PC + mobile ×3
node tools/measure.mjs vexon --hosted         # production URL (+ --psi when public)
node tools/axe-sweep.mjs <url> --device both  # contrast through the entrance fades
node tools/compare-motion.mjs …               # entrance/reveal strips vs the old page (rebuild fidelity)
node tools/resize-check.mjs vexon --out <dir>
```
Probes: set a real browser UA — puppeteer's default HeadlessChrome UA gets the
robot form (no cursor). `tools/verify.sh` must stay at 0 FAIL.
