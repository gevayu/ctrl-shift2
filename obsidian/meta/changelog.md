---
tags: [meta, changelog]
updated: 2026-10-10
---

# Changelog

Chronological log of notable changes to **this project**. Newest first.
Human-curated — not a mirror of `git log`.

Log a change here when it would surprise someone returning in six months: a new
dependency, a new route or section, a convention bent, a bug whose cause is worth
remembering. Routine commits do not need an entry.

For *why* the conventions are what they are, see [[decisions-log]].

---

## 2026-10-10 — Ctrl+Shift site (Hebrew, RTL) replaces the Vexon demo

- **Content.** The Vexon demo copy is gone; the site is Ctrl+Shift's, from the
  client's copy doc: home, services (+3 service pages), client stories (+2),
  blog (+6 articles as Markdown in `src/content/blog/`), process library (+5),
  FAQ, contact (+2 thank-you pages), 404. Copy lives in `src/data/*`.
- **RTL.** `<html lang="he" dir="rtl">`; logical `start/end` utilities only.
  `TextEffect` sets `dir="auto"` so split characters keep their reading order.
- **One font.** Noto Sans Hebrew for every role (sans, display, mono tokens).
- **Links to unbuilt pages** are `href: null` and render as plain text
  (`SmartLink`), so nothing points at a 404. `src/lib/routes.ts` lists every route.
- **Forms.** `/api/contact` (shared zod schema in `src/lib/contact-schema.ts`,
  honeypot) and `/api/newsletter` forward to `CONTACT_ENDPOINT` /
  `NEWSLETTER_ENDPOINT`; unset, the payload is logged server-side.
- **Logos.** Client and partner logos are white silhouettes
  (`public/assets/logos/`), sized by equal visual area in `LogoMarquee`.

## 2026-10-06 — owner review (D-033), branch `optimize/pass-2`

- **No floating pointer on touch.** `CursorFollower` renders only when
  `(hover: hover) and (pointer: fine)` matches (`src/hooks/use-fine-pointer.ts`,
  `useSyncExternalStore`, false on the server) — on a phone the dot and ring
  sat at the top-left corner and jumped to each tap; now neither they, their
  ticker loop nor their listeners exist on touch. The about cards' hover pill
  (`hover-card.tsx`) also ignores the synthetic mousemove a tap fires (it was
  left floating with no mouseleave). Desktop unchanged (cursor follows).
- **Hero title on phones.** At `12vw` the three lines broke mid-word ("DA /
  TA", "YO / UR", "ADVANT / AGE"): `TextEffect per="char"` made every letter
  its own inline-block, so any letter was a break point. Two fixes:
  `TextEffect` now groups a word's letters in a `whitespace-nowrap` box (lines
  break only between words — also fixes the mission heading), and the phone
  hero uses `--text-hero-fit` = `calc((100vw - 3rem) / 9.2)`, sized so the
  widest line ("UNFAIR ADVANTAGE", 8.92 em) fits the content box: three
  whole lines at 360/390/414/430 like the desktop composition (34–42 px).
  `md`/`lg` sizes unchanged; `--text-hero` (12vw) still drives the mission h2.
- **Brand kit + all required meta.** Mark `src/assets/brand/mark.svg` — the
  wordmark's Orbitron Bold "V" (outlined) on black with a faint blue orb halo;
  `tools/scaffold-brand.mjs` → icon.svg, favicon.ico (public + app), PNG set,
  manifest ("Vexon", #000000), `open-graph.jpg` (1200×630 hero capture, the
  cursor layer hidden). `open-graph.png` removed. `site.ts`: title "Vexon — AI
  intelligence platform", description = the hero body, keywords, OG alt,
  author Vexon (was "New Project"), no Twitter handle (was `@newproject`);
  generator: applicationName, keywords, OG 1200×630 + alt, icon.svg first;
  JSON-LD logo → `/icon-512.png`; the home view uses the site title.

## 2026-10-03 — Below-fold reveals promoted until they have played (scroll pass)

- **`RevealGroup` / `RevealItem`** (`src/components/ui/reveal.tsx`): a reveal
  that fades with `opacity` (below the fold — the first screen's `maskFade`
  ones are untouched) carries `will-change: opacity, transform` from mount
  until its spring rests on the shown state (`onRest`), then drops it. The
  browser builds and rasterises each block's layer at load instead of in the
  frame the reveal starts. Blamed by: the hosted record — desktop **cold**
  smooth at 2.09 % dropped, `#about-vexon` 9 % (its glass cards rise out of
  a 10 px blur), warm ideal: first-visit work in the reveal frames. Ascend's
  fix (Fix Catalog, "Pre-promote a hidden layer"). No mask on the glass —
  masks there repaint every frame (Pitfalls).
- **Measured** (local `next start`, `main` build vs this, back to back, the
  pipeline's scroll test, 3 runs): desktop cold dropped 0.77 → **0.34 %**
  (worst run 2.58 → 1.0 %), `#about-vexon` 4.6 → **1.7 %**, max 34 → 27 ms;
  warm 0.34 → **0 %**. Ideal → ideal locally (the host's 2 % is not reproduced
  here; the share in `#about-vexon` falls by ~2/3). Phone: **ideal** (cold
  0.21 %, max 25 ms; warm 0 %).
- **Lighthouse** (local, mobile, 6 runs each, interleaved): 93 on 5/6 for
  both builds (one 97 each — the LCP's known 2.5 / 3.2 s bimodality), TBT
  ~80–89 ms both; PC 100 → 100; A11y/BP/SEO 100.
- **Look:** `#about-vexon` at rest and 0.7 s into its reveal, `main` vs this —
  identical (the glass blurs the orb behind it the same way).

## 2026-10-03 — Entrance fades drawn as masks; one clock per TextEffect (D-028)

- **`fadeMask(a)`** (`src/utils/animation/fade-mask.ts`): an opacity fade
  painted as a uniform mask alpha, `none` at rest. `IntroFade`, `EnterOnIntro`
  (nav), the hero's `RevealGroup maskFade` + its items
  (`src/components/ui/reveal.tsx`) and the preloader's tag line now fade
  through it — the first screen only. Below the fold the groups keep
  `opacity`: a mask changing every frame repainted the about section's glass
  blocks mid-scroll (250–490 ms frames, mobile scroll ideal → janky — measured,
  then made opt-in; back to ideal), and Lighthouse never scrolls, so it only
  sees those reveals at 0. The pixels are the same and `opacity`
  stays 1. Why: Lighthouse's axe reads `opacity` and sampled the page during
  the 1 s page fade after the preloader, so every #mission-intelligence label failed
  at 1.12–3.33:1 (people A11y 96 on every run). Because the mask is cleared at rest,
  the frosted glass (CTA, about section, cards) still blurs. `RevealGroup`/`RevealItem` now
  use `useSpring` directly (the robot form still renders them plain, at rest).
- **TextEffect: one clock per text** (`src/components/ui/text-effect.tsx`)
  instead of one spring per character/word. Each piece derives its own 300 ms
  tween (MOTION_TWEEN's curve) from the clock at `delay + i × 50 ms`, the same
  timeline. The container keeps `opacity`: a mask there would override
  the headline's own `mask-fade-in/out` classes (caught by looking: the
  gradient lines rendered flat white). The hand-over task fell from 403 ms to 103 ms (mobile, 4× CPU).
- **Contrast at rest:** the preloader's `[ SYSTEM_READY ]` went from 40 % to 46 % white
  (3.65 → 4.6:1). The about eyebrow and nav version (`text-soft opacity-50`, 4.42:1)
  went to `opacity-52` (≈ 4.7:1). Both were exposed by an axe sweep across the entrance;
  the eyebrow sat at opacity 0 whenever Lighthouse sampled before.
- Local A/B (production builds, interleaved, 4 runs each): mobile perf 78–84
  → 89–93 (TBT 393–507 → 94–210 ms), desktop 99–100 → 100; A11y 96 in 6/8 runs
  → 100 in 8/8.

## 2026-10-01 — Native cursor kept

- `cursor: none` removed from body, links/buttons (`globals.css`) and the
  preloader; the custom dot + ring now float behind the native cursor,
  unchanged otherwise (ADR-0028, owner's call).

## 2026-10-01 — Vexon rebuilt on the starter

- The shipped Vite page (vexon-old/src) ported: the same preloader (counter,
  rotating tags, 2D particle sphere, blur-out), the fixed three.js particle
  orb, the three sections (hero, about + cards, mission grid + logo marquee),
  the empty blur footer and the custom cursor; same copy, palette, type and
  scale. Content in `src/data/mocks/home.ts`, view in `src/views/home.tsx`.
- The orb in `src/lib/scene/particle-orb.ts` (loaded lazily by
  `components/scene/orb-background.tsx`); the preloader sphere in
  `src/lib/scene/preloader-sphere.ts`.
- Motion: motion/react → springs. Reveals (`components/ui/reveal.tsx`) keep the
  old stagger (0.2 s + 0.1 s × i), 100 px / 10 px-blur rise and the exact
  `[0.16, 1, 0.3, 1]` curve (`utils/animation/cubic-bezier.ts`); the blur text
  effect is `components/ui/text-effect.tsx`; the star spin, pulse dot and
  marquee are looping springs (`components/ui/loops.tsx`) — no CSS keyframes.
  The content is server-rendered and its entrances wait for the preloader
  (`components/ui/intro.tsx`), where the old page only mounted it then.
- The preloader's counter (1 per 20 ms) and tag rotation (every 400 ms) are
  read off the clock since DOMContentLoaded — when the old bundle started
  them — not counted from hydration, so the hand-over lands when it did
  (100 % at 2 s, blur-out +0.4 s, page +1 s); measured within ~50 ms of the
  old build. The star, pulse and marquee loops start at the hand-over, so
  their phase matches too.
- "VEXON®": Orbitron has no ®; the old page drew it from the system sans.
  next/font's metric-adjusted fallback drew it ~25 % larger, so the ® is its
  own `font-system` span.
- Card images were hot-linked from lh3.googleusercontent.com; now in
  `public/assets/` and served through next/image.
- Fonts: Inter 300–500, JetBrains Mono 400–500, Space Grotesk 700, Orbitron 700
  via next/font — the exact weights the old index.css imported (ADR-0026 has
  the grid; Playfair Display was imported but unused, dropped).
- Dependencies: `three@0.169.0`, `@types/three@0.169.0` (ADR-0027). No icon
  library — the one lucide icon is inlined (`components/ui/icons.tsx`).
- The adaptive rem grid off (ADR-0026).

## Baseline — built from `next16-claude-starter` v0.1.0

What the starter ships, so the first project entry has something to diff against:

| Area | What is there |
|------|---------------|
| Framework | Next.js 16 App Router · React 19 · TypeScript · Yarn · Node ≥ 20.19 |
| Styling | Tailwind v4, CSS-only config, three-tier design tokens ([[design-system]]) |
| Motion | Vendored spring engine + `spring-text-engine`, shared rAF ticker, reduced-motion ([[animation-system]]) |
| Layout | Adaptive scaling grid — root font-size tracks the viewport ([[design-system]]) |
| Scroll | Lenis smooth scroll + Zustand scroll store ([[smooth-scroll]]) |
| Server | `app/api` route handlers, zod-validated env, `{ data }`/`{ error }` envelope ([[api-architecture]]) |
| SEO | Metadata generator, `robots.ts`, `sitemap.ts`, JSON-LD ([[seo-metadata]]) |
| Agent harness | 8 commands, 7 path-scoped rules, 11 skills, 4 subagents, `verify.sh` ([[agent-harness]]) |
| Not included | CMS, database, auth, payments, i18n, tests — added per project ([[backend/README]]) |

The home view (`src/views/home.tsx`, route `/`) ships empty on purpose — start
there ([[new-page]]).

<!-- Log this project's changes below, newest first, under a `## YYYY-MM-DD` heading. -->

## 2026-09-30 — Dependency refresh: Next 16.3.7, React 19.3

Bumped to pick up upstream Turbopack fixes in the 16.3.x patch line.

- `next` + `eslint-config-next` 16.3.1 → 16.3.7
- `react` / `react-dom` 19.2.8 → 19.3.0 (and `@types/react*` → 19.3.0)
- `zod` 4.4.3 → 4.6.5 · `@types/node` → 24.19.0
- Still held back (see [[tech-stack]] § Deliberately held back): ESLint 10,
  TypeScript 7, `@types/node` 26.
- Installs must run on the `.nvmrc` Node (24.16.0); Yarn rejects Node < 20.19
  via `engines`.

## 2026-09-18 — `optimize-load`: Lighthouse as a measured workflow

- **New skill `optimize-load`** + `/load` command + [[optimize-load]]. Audits all
  four Lighthouse categories across **laptop, tablet and mobile**, medians of 3+
  runs, then fixes what the audit blames and re-measures. Hard rule 13 now routes
  by *which half* is slow — load → `optimize-load`, scroll jank after load →
  `optimize-performance` — because Lighthouse never scrolls and cannot see the
  second.
- **`references/runner.md`** carries the Lighthouse Node-API runner (three form
  factors, medians, per-audit failures by weight), a `PerformanceObserver` CLS
  probe — Lighthouse routinely reports shifts with **no node attached** — and the
  WCAG contrast arithmetic.
- **`references/fixes.md`** carries the fixes by weight (TBT 30 · LCP 25 · CLS 25),
  the LCP phase-breakdown table that names which fix applies, the measured
  contrast floors (**0.55 black on light, 0.46 white on black**), and the
  width-reservation pattern for figures that count up.
- **Findings worth carrying between projects**, all recorded: a single run is an
  anecdote (LCP swung 2.7→4.6s on an unchanged build); axe samples animated pages
  mid-reveal and reports artifacts; CLS sums distance, not frames, so speeding an
  animation up does nothing; and a CLS of 0 may just mean the trace ended early.
- **Ownership tidied so the skills cannot drift** — `seo-audit` §5 and
  [[seo-aeo]] now delegate Core Web Vitals to `optimize-load` instead of
  restating them (they were still advising a single Lighthouse run on one
  profile).
- **The ship gate now routes through it** — [[ship]] and the `ship-check` skill
  ask for all four categories ≥ 90 on all three profiles, medians of 3+, and name
  `optimize-performance` as the second pass Lighthouse cannot do.
- **No new dependency** — both scripts install into a scratch directory.
- See [[decisions-log]] ADR-0025 for why this is a second skill rather than an
  extension of the first.


## 2026-09-17 — performance becomes a measured workflow

- **New skill `optimize-performance`** + `/perf` command + [[optimize-performance]].
  Performance work now runs a loop — build, measure in real Chrome, attribute,
  fix one thing, re-measure — instead of applying a checklist. Hard rule 13 in
  `AGENTS.md` routes any "it's slow / janky / stutters" request into it; the old
  3D rule moved to 14.
- **The diagnostic it adds:** scroll the whole page twice and compare cold
  against warm. A page that stutters on the *first* pass and is smooth after is
  not slow — it is fetching and decoding lazy media inside the frames a reveal
  animation is running in. Lighthouse cannot see this (it never scrolls), and
  neither can you by hand, because you have already warmed the page.
- **References:** `references/measuring.md` carries the scroll bench (real wheel
  events over CDP, `requestAnimationFrame` deltas, long tasks, resource timing)
  and how to read it; `references/fixes.md` carries the fixes, most-likely first,
  including a `warmMedia` implementation with the four traps that make a naive
  version silently do nothing.
- **No new dependency** — the bench uses `playwright-core` installed in a scratch
  directory, not in the project.
- See [[decisions-log]] ADR-0024 for why this is a loop rather than a checklist.


## 2026-09-08

**`optimize-3d-scene` skill — resize no longer switched off on touch.** §13 of
the skill (and `patterns.md` §5 / §14) told agents to attach *no* `resize`
listener on the mobile tier, to dodge the iOS URL bar. That also removed the
only path that could react to a breakpoint drag, a rotation or DevTools
emulation being turned off, so a scene loaded as a phone kept its phone
framebuffer, frame budget, parked pointer and hidden desktop passes on a desktop
viewport and rendered skewed. The skill now listens on every tier, ignores
height-only changes on a coarse pointer, and re-reads the tier on a width
change or a pointer-media-query flip, with a `retune()` that re-applies DPR,
budget, visibility, draw range and pointer binding without compiling a program.
§2 and §11 of `SKILL.md` and the [[optimize-3d-scene]] workflow note were
updated to match; §14 gained a tier-switch round-trip check. Reasoning in
[[decisions-log]] ADR-0023. Measured on the project that surfaced it: phone
390×844 / 3 draws ↔ desktop 2160×1350 / 4 draws, program count unchanged.
