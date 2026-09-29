# ngrok-style UI redesign (blue-only) — Design Spec

**Date:** 2026-09-29
**Status:** Approved (design validated through Q&A on 2026-09-29)
**Scope:** Whole public site — homepage, project detail pages, chat widget. Admin panel untouched.

## 1. Goal

Redesign semadotdev's public UI using ngrok.com as the design basis — its section architecture and visual language (big confident type, gradient glows, blurred color wash, clean cards, lowercase brand) — rendered strictly in blues. All content stays dynamic via ContentContext; all signature interactive features survive.

## 2. Approved decisions

| Decision | Choice |
|---|---|
| "Blue theme" meaning | ngrok visual language, blue-only — no rainbow or multi-hue in site chrome |
| Scope | Homepage + project detail pages + chat widget; admin untouched |
| Surviving features | 3D logo, Preloader + encrypted-text intro, per-project hover themes |
| Section flow | ngrok flow adapted: Hero → ticker → Projects → Skills → Timeline → About → Contact CTA |
| Execution | Hybrid rebuild: new tokens/primitives; rebuild hero/projects/contact moments; token-restyle surviving sections |
| Project accent colors | Chrome strictly blue-only; per-project hover/detail themes keep identity colors (cyan, violet/rose) |

## 3. Design tokens

### 3.1 Palette (`globals.css` — `@theme inline` + `:root`)

| Token | Current | New |
|---|---|---|
| `--background` | `#0f0f0f` | `#0a0c12` (cold blue-black) |
| `--surface` | `#1a1a2e` | `#10141c` |
| `--card` | `#16213e` | `#141a24` |
| `--accent` | `#3b82f6` | `#3b82f6` (unchanged anchor) |
| `--accent-secondary` | `#6366f1` (indigo) | `#38bdf8` (sky-400 — indigo removed) |
| `--muted` | `#9ca3af` | `#9ca3af` |
| `--foreground` | `#fafafa` | `#fafafa` |

Chrome gradient (gradient text, progress bar, photo frame, focus): `linear-gradient(to right, #38bdf8, #3b82f6, #2563eb)` — sky-400 → blue-500 → blue-600. No indigo (`#6366f1`, `#818cf8`) and no cyan (`#22d3ee`) in chrome gradients. Per-project themes are exempt (§5).

### 3.2 Blue-blur (ngrok's rainbow-blur, blue-only)

2–3 absolutely-positioned blurred orbs in the hero: radial gradients `rgba(37,99,235,0.25)` / `rgba(56,189,248,0.20)` fading to transparent, `filter: blur(120px)`, placed at the hero's top corners/edges — not centered behind the headline. Effective alpha over text areas ≤ 0.04 (legibility budget, §8).

### 3.3 Typography

- Fonts: Geist Sans + Geist Mono (unchanged)
- Hero H1: `clamp(3rem, 8vw, 5.5rem)`, line-height `1.05`, letter-spacing `-0.025em`, bold. Line 1 blue-gradient text (§3.1 ramp), line 2 solid white
- Section H2: `text-3xl sm:text-4xl lg:text-5xl`, `tracking-tight`
- Eyebrow: `font-mono text-sm uppercase tracking-widest` in `text-blue-400` (existing pattern, kept)
- Brand: lowercase "semadotdev" in all text contexts (ngrok brand rule)

### 3.4 Cards (chrome)

- Resting: `rounded-xl border border-white/[0.08] bg-white/[0.03]`
- Hover: `border-blue-400/40`, `box-shadow: 0 0 24px rgba(59,130,246,0.15)`, lift `y: -2px` (framer `whileHover`; optional per card type)
- Section container: keep `max-w-6xl`

### 3.5 Buttons

- Primary: `bg-blue-500 hover:bg-blue-400 text-white rounded-full`, hover glow `shadow-lg shadow-blue-500/25`
- Ghost/secondary: `border border-white/[0.10] hover:border-blue-400/40 text-zinc-300 hover:text-white`
- Focus: `focus-visible:ring-blue-500/50`

### 3.6 Motion

Existing framer-motion patterns (fade-up, stagger, `whileInView once`) kept; only color/surface values change. Existing `prefers-reduced-motion` rules untouched.

## 4. Homepage flow (`src/app/page.tsx`)

Order: Header → Hero → LogoTicker (moved here) → SectionDivider → Projects → SectionDivider → Skills → SectionDivider → Timeline → SectionDivider → About → SectionDivider → Contact → Footer.

### 4.1 Header

Links reordered to match flow: Projects, Skills, Experience, About, Contact. Scroll progress bar: blue-only gradient (§3.1). Mobile menu behavior unchanged. Admin indicator dot stays.

### 4.2 Hero

Keeps: InteractiveGridPattern, Logo3D (+ click easter egg), PasswordModal, all dynamic content, scroll-down arrow.
Changes: blue-blur orbs behind content (z-0); H1 scale/tracking per §3.3; line 1 gradient in blue ramp; CTAs "View My Work" (primary) + "Get In Touch" (ghost).

### 4.3 LogoTicker

Moved directly under the hero (ngrok's customer-logo placement). Chips: mono text, `border-white/[0.08]`, hover `border-blue-400/40`. Duplicated-array marquee behavior unchanged.

### 4.4 Projects — the ngrok product moment

Section header rebuilt as a `SectionHeader` primitive (mono eyebrow + big heading) using existing dynamic copy. BentoGrid/BentoCell structure and ProjectHoverEffect hover themes untouched (as refined 2026-09-29). Card chrome → §3.4. Each card gains a "Learn more →" ghost-link affordance to `/projects/[slug]` (ngrok product-card pattern).

### 4.5 Skills

TiltCards keep tilt behavior; chrome → §3.4; skill pills `border-white/[0.08]`, hover `border-blue-400/40 text-white`. LogoTicker removed from this section (moved to §4.3).

### 4.6 Timeline

Entries as ngrok-style cards (§3.4); dates/roles in mono eyebrow style; blue-500 markers/rail.

### 4.7 About

Two-column composition unchanged; gradient photo frame → blue ramp (§3.1); glow rings → `border-blue-500/20`; corner blur orbs → blue-only. "Download CV" button → primary style.

### 4.8 Contact — ngrok final CTA

Big two-line headline (existing dynamic copy) + primary CTA; form inputs `border-white/[0.08] bg-white/[0.03] focus:border-blue-500`; submit → primary button; social icon tiles → §3.4 hover glow. Form logic and `/api/contact` untouched.

### 4.9 Footer

Structure unchanged; accents blue-only.

## 5. Project detail pages

Chrome-only restyle: BentoCell/cell borders → §3.4; mono eyebrows; back-link styled as ngrok ghost link ("← All projects"). `ProjectBackground` and per-project hover/detail theme colors untouched — cyan (EM-Andor) and violet/rose (UNI-verse) identity colors survive.

## 6. Chat widget

ChatButton + ChatModal: header accent → blue-500; message bubbles → §3.4 chrome; input focus → blue; send button → primary style. Behavior and `/api/chat` untouched.

## 7. Untouched surfaces

Preloader, AnimatedEncryptedText, PasswordModal, ConfirmModal, AdminPanel, Toast, all `/api/*` routes, ContentContext data flow, `src/lib/projects.ts`.

## 8. Legibility budget (carried over from hover-themes work)

- Full-surface textures ≤ 0.035 effective alpha over text
- No translucent masses over text columns — outline/speck decoration only (established house pattern)
- Blue-blur orbs: edges/corners only, effective ≤ 0.04 over text areas
- Animated accents over text ≤ 0.12 effective alpha
- Content stays `relative z-10` above all decoration layers

## 9. Verification

1. `npm run build` passes
2. `npx tsc --noEmit` clean
3. `npx eslint` on all touched files — 0 new problems
4. SSR checks (curl): all sections mount; all 5 hover themes + 5 detail backgrounds present; `/projects/does-not-exist` → 404; `prefers-reduced-motion` rules intact
5. Source audit: no indigo/cyan values in chrome components (outside per-project themes); blue-blur within §8 budget
6. Visual pass on `localhost:3000` dev server; visual companion mockups validated before code (phase order)

## 10. Constraints

- Next.js 16 differs from expected APIs — consult `node_modules/next/dist/docs/` before app-router/layout changes (per AGENTS.md)
- Only files named in the implementation plan are touched; the working tree carries unrelated WIP (~28 dirty paths) that must never be staged
- Commit only the spec doc now; implementation commits only when explicitly requested
- All section copy stays dynamic via ContentContext — no hardcoded copy replacing dynamic content
