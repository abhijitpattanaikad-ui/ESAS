# GoEzPz Public UI/UX Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a responsive Immersive Glass redesign for the public GoEzPz experience, including the editorial media hero, navigation, homepage journey, tournament discovery/detail, partners, and footer while retaining the orange brand and all existing behavior contracts.

**Architecture:** Add a small shadcn-compatible primitive layer under `src/components/ui`, then compose it from existing public route and landing components. Preserve the current server-fetch/data-result boundary and mutation APIs; this work changes presentation and client-side filtering only. Treat hero video as progressive enhancement with a local poster, reduced-motion handling, and a static fallback.

**Tech Stack:** Next.js 15.5.9 App Router, React 19.2.3, strict TypeScript 5.9.3, Tailwind CSS 4.1.16, Framer Motion 12.23.24, Lucide React 0.553.0, Node test runner, `clsx`, and new dependency `tailwind-merge`.

## Global Constraints

- Keep orange/`jaffa` as the signature brand palette; do not replace it with a different primary color.
- Public scope only: navigation, footer, homepage, tournament listing, tournament detail, and partners. Do not redesign auth, profile, or dashboard.
- Preserve routes, backend contracts, authentication semantics, cookies, headers, environment variables, API platform identifiers, support address, and external destinations.
- Never fabricate tournament, game, partner, bracket, or player data; preserve truthful ready, empty, not-found, and error distinctions.
- Use only local runtime hero media. Do not hotlink stock video or poster assets.
- Respect `prefers-reduced-motion`, keyboard navigation, visible focus, semantic labels, and WCAG 2.2 AA contrast.
- Keep the existing static-asset budget authoritative. Use the static poster fallback if the compressed video cannot pass the gate.
- Use Test-Driven Development: introduce each observable contract in a failing test, verify the failure, then implement the smallest passing change.
- Run `npm run check` before delivery; do not weaken lint, type, source-safety, test, asset, or build gates.

## File Structure

**New shared design-system files**

- `components.json` — shadcn-compatible aliases and Tailwind configuration.
- `src/lib/utils.ts` — canonical `cn(...inputs: ClassValue[]): string` helper.
- `src/components/ui/button.tsx` — link/button visual variants without changing navigation semantics.
- `src/components/ui/glass-card.tsx` — reusable glass surface wrapper.
- `src/components/ui/status-badge.tsx` — readable tournament status presentation.
- `src/components/ui/section-heading.tsx` — consistent public section hierarchy.
- `src/components/ui/animated-banner.tsx` — reusable video/poster banner and optional countdown.
- `src/components/ui/index.ts` — public exports for the new primitive layer.
- `src/test/public-design-system.test.mjs` — source-level design-system and accessibility contracts.
- `src/test/public-experience.test.mjs` — public route/section composition contracts.
- `docs/media-attribution.md` — source and license record for temporary stock media.
- `public/videos/goezpz-hero.mp4` — optimized local temporary stock video when it passes the asset gate.
- `public/images/goezpz-hero-poster.webp` — local hero poster, always present.

**Existing files changed by responsibility**

- `package.json`, `package-lock.json` — exact `tailwind-merge` dependency.
- `src/app/globals.css` — semantic surface, border, shadow, layout, and motion tokens.
- `src/app/(components)/(layout)/ModernHeader.tsx` — floating public navigation and mobile menu.
- `src/app/(components)/landing/HeroSection.tsx` — platform hero composition.
- `src/app/(components)/landing/Landing.tsx` — approved homepage order.
- `src/app/(components)/landing/CoreFeatures.tsx` — “Why GoEzPz” benefit cards.
- `src/app/(components)/landing/FeaturedEvents.tsx` — featured tournament hierarchy.
- `src/app/(components)/landing/FeaturedGames.tsx` — responsive game row/grid.
- `src/app/(components)/landing/TrustedBy.tsx` — quieter partner treatment.
- `src/app/(components)/landing/Advantages.tsx` — community CTA.
- `src/app/(components)/shared/EventCard.tsx` — shared tournament card.
- `src/app/(components)/shared/TournamentList.tsx` — search, game/status filters, reset, filtered-empty state.
- `src/app/(site)/tournaments/page.tsx` — listing introduction and server result states.
- `src/app/(site)/tournaments/[id]/TournamentDetailClient.tsx` — detail hierarchy and glass surfaces.
- `src/app/(site)/tournaments/[id]/page.tsx` — error presentation only; data behavior stays unchanged.
- `src/app/(site)/partners/page.tsx` — partner grid and result states.
- `src/app/(components)/(layout)/Footer.tsx` — unified public footer.
- `scripts/check-asset-budget.mjs` — add a bounded video rule without relaxing existing image limits.

---

### Task 1: Establish the Shadcn-Compatible Public Design System

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/glass-card.tsx`
- Create: `src/components/ui/status-badge.tsx`
- Create: `src/components/ui/section-heading.tsx`
- Create: `src/components/ui/index.ts`
- Create: `src/test/public-design-system.test.mjs`
- Modify: `src/app/globals.css`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string`.
- Produces: `Button` with `variant: "primary" | "secondary" | "ghost"` and `size: "sm" | "md" | "lg"`.
- Produces: `GlassCard({ as?, className?, children })`.
- Produces: `StatusBadge({ status: ApiTournamentStatus })`.
- Produces: `SectionHeading({ eyebrow?, title, description?, action? })`.
- Consumes: existing `ApiTournamentStatus`, `clsx`, Tailwind tokens, and React types.

- [ ] **Step 1: Add failing design-system contracts**

Create `src/test/public-design-system.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("shadcn-compatible aliases point to the src component and utility roots", async () => {
  const config = JSON.parse(await readFile("components.json", "utf8"));
  assert.equal(config.aliases.components, "@/components");
  assert.equal(config.aliases.ui, "@/components/ui");
  assert.equal(config.aliases.utils, "@/lib/utils");
});

test("public primitives use semantic orange glass tokens and visible focus", async () => {
  const css = await readFile("src/app/globals.css", "utf8");
  const files = await Promise.all([
    "button.tsx", "glass-card.tsx", "status-badge.tsx", "section-heading.tsx",
  ].map((name) => readFile(`src/components/ui/${name}`, "utf8")));
  assert.match(css, /--surface-glass:/);
  assert.match(css, /--brand-primary:/);
  assert.match(files.join("\n"), /focus-visible/);
});

test("tailwind-merge is an exact production dependency", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8"));
  assert.match(pkg.dependencies["tailwind-merge"], /^\d+\.\d+\.\d+$/);
});
```

- [ ] **Step 2: Run the contract and verify it fails**

Run: `node --test src/test/public-design-system.test.mjs`

Expected: FAIL because `components.json` and the new primitives do not exist.

- [ ] **Step 3: Install the exact utility dependency and add configuration**

Run: `npm install --save-exact tailwind-merge`

Create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Implement `cn()` exactly as:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Implement focused primitives and semantic tokens**

Add semantic CSS custom properties for `--surface-page`, `--surface-glass`, `--surface-elevated`, `--border-subtle`, `--brand-primary`, `--brand-hover`, and shared public shadows/radii. Build the five primitive files with typed props, `cn()`, semantic elements, and `focus-visible` treatment. `StatusBadge` must map every `ApiTournamentStatus` to both a text label and a non-color-only visual style.

- [ ] **Step 5: Run focused and foundational checks**

Run: `node --test src/test/public-design-system.test.mjs src/test/toolchain.test.mjs src/test/accessibility-contract.test.mjs`

Expected: all tests PASS.

Run: `npm run lint && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add components.json package.json package-lock.json src/lib/utils.ts src/components/ui src/app/globals.css src/test/public-design-system.test.mjs
git commit -m "feat: add immersive public design system"
```

---

### Task 2: Build the Editorial Media Hero and Floating Navigation

**Files:**
- Create: `src/components/ui/animated-banner.tsx`
- Create: `public/images/goezpz-hero-poster.webp`
- Create: `public/videos/goezpz-hero.mp4` when it meets the asset gate
- Create: `docs/media-attribution.md`
- Modify: `src/app/(components)/landing/HeroSection.tsx`
- Modify: `src/app/(components)/(layout)/ModernHeader.tsx`
- Modify: `src/components/ui/index.ts`
- Modify: `scripts/check-asset-budget.mjs`
- Modify: `src/test/public-design-system.test.mjs`
- Modify: `src/test/static-assets.test.mjs`

**Interfaces:**
- Produces: `AnimatedBannerProps` with `title`, `subtitle?`, `ctaLabel?`, `href?`, `videoSrc?`, `posterSrc`, `deadline?`, `overlayColor?`, and `className?`.
- Produces: a platform hero with fixed approved copy and `/tournaments` CTA.
- Consumes: Task 1 `cn()`, `Button` styles, and semantic tokens.

- [ ] **Step 1: Add failing hero, media, and navigation contracts**

Append to `src/test/public-design-system.test.mjs`:

```js
test("platform hero uses approved copy, local media, and tournament CTA", async () => {
  const hero = await readFile("src/app/(components)/landing/HeroSection.tsx", "utf8");
  assert.match(hero, /Your arena\. Your legacy\./);
  assert.match(hero, /Discover tournaments, compete with confidence, and make every match count\./);
  assert.match(hero, /href="\/tournaments"/);
  assert.match(hero, /goezpz-hero-poster\.webp/);
  assert.doesNotMatch(hero, /https?:\/\//);
});

test("animated banner supports reduced motion and poster fallback", async () => {
  const banner = await readFile("src/components/ui/animated-banner.tsx", "utf8");
  assert.match(banner, /useReducedMotion/);
  assert.match(banner, /onError/);
  assert.match(banner, /posterSrc/);
  assert.match(banner, /next\/link/);
});

test("public navigation exposes labelled mobile controls", async () => {
  const header = await readFile("src/app/(components)/(layout)/ModernHeader.tsx", "utf8");
  assert.match(header, /aria-label="Open navigation"/);
  assert.match(header, /aria-expanded=/);
  assert.match(header, /Tournaments/);
  assert.match(header, /Partners/);
});
```

- [ ] **Step 2: Run the new contracts and verify failure**

Run: `node --test src/test/public-design-system.test.mjs`

Expected: FAIL on the missing `AnimatedBanner`, approved copy, and mobile-navigation semantics.

- [ ] **Step 3: Prepare local licensed media**

Use the Pexels clip “Gamers focused on competitive esports play in a dark room” at `https://www.pexels.com/video/men-playing-video-games-9070660/` as the temporary source. Record the page URL, creator `Yan Krukau`, retrieval date, and Pexels license in `docs/media-attribution.md`. Download the smallest suitable HD source, trim a seamless 6–10 second silent segment, remove audio, scale to at most 1920×1080, and encode web-optimized H.264 MP4 at `public/videos/goezpz-hero.mp4`. Export its first representative frame as `public/images/goezpz-hero-poster.webp`.

Extend `scripts/check-asset-budget.mjs` with a dedicated maximum of 4 MiB for `public/videos/goezpz-hero.mp4`; do not change existing image limits. If the encoded file cannot pass 4 MiB without unacceptable artifacts, omit the MP4 and ship the poster-only path supported by `AnimatedBanner`.

- [ ] **Step 4: Implement `AnimatedBanner`**

Implement the approved prop interface. Use `Link` for internal destinations, render the decorative video only when `videoSrc` exists and reduced motion is false, switch to the poster on `onError`, retain the optional accessible countdown API, and stop the interval at zero. Use responsive minimum heights and an editorial left-copy/right-media gradient.

- [ ] **Step 5: Replace the hero and update the header**

Render:

```tsx
<AnimatedBanner
  title="Your arena. Your legacy."
  subtitle="Discover tournaments, compete with confidence, and make every match count."
  ctaLabel="Explore tournaments"
  href="/tournaments"
  videoSrc="/videos/goezpz-hero.mp4"
  posterSrc="/images/goezpz-hero-poster.webp"
  overlayColor="oklch(0.14 0.025 270)"
/>
```

If Task 2 omitted the MP4 under the asset rule, omit `videoSrc` rather than referencing a missing file. Convert `ModernHeader` into a floating glass header with desktop links, signed-out actions, preserved signed-in profile behavior, and a labelled mobile disclosure menu. Close the mobile menu after navigation and on Escape.

- [ ] **Step 6: Verify hero and navigation**

Run: `node --test src/test/public-design-system.test.mjs src/test/static-assets.test.mjs src/test/accessibility-contract.test.mjs`

Expected: all tests PASS.

Run: `npm run assets:check && npm run lint && npm run typecheck`

Expected: all commands exit 0.

- [ ] **Step 7: Commit**

```bash
git add docs/media-attribution.md public/images/goezpz-hero-poster.webp public/videos/goezpz-hero.mp4 scripts/check-asset-budget.mjs src/components/ui src/app/'(components)'/landing/HeroSection.tsx src/app/'(components)'/'(layout)'/ModernHeader.tsx src/test
git commit -m "feat: add editorial GoEzPz media hero"
```

If the video was omitted by the asset gate, remove `public/videos/goezpz-hero.mp4` from the `git add` list.

---

### Task 3: Recompose the Homepage Journey

**Files:**
- Create: `src/test/public-experience.test.mjs`
- Modify: `src/app/(components)/landing/Landing.tsx`
- Modify: `src/app/(components)/landing/CoreFeatures.tsx`
- Modify: `src/app/(components)/landing/FeaturedEvents.tsx`
- Modify: `src/app/(components)/landing/FeaturedGames.tsx`
- Modify: `src/app/(components)/landing/TrustedBy.tsx`
- Modify: `src/app/(components)/landing/Advantages.tsx`

**Interfaces:**
- Consumes: existing `LandingProps` and availability values; Task 1 primitives; Task 2 hero.
- Produces: homepage order `Hero → Featured tournaments → Why GoEzPz → Featured games → Trusted partners → Community CTA`.

- [ ] **Step 1: Write a failing homepage composition contract**

Create `src/test/public-experience.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("homepage follows the approved public journey", async () => {
  const source = await readFile("src/app/(components)/landing/Landing.tsx", "utf8");
  const names = ["HeroSection", "FeaturedEvents", "CoreFeatures", "FeaturedGames", "TrustedBy", "Advantages"];
  const positions = names.map((name) => source.indexOf(`<${name}`));
  assert.ok(positions.every((value) => value >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("homepage sections preserve truthful availability messaging", async () => {
  const sources = await Promise.all([
    "FeaturedEvents.tsx", "FeaturedGames.tsx", "TrustedBy.tsx",
  ].map((name) => readFile(`src/app/(components)/landing/${name}`, "utf8")));
  for (const source of sources) {
    assert.match(source, /availability === "error"/);
    assert.match(source, /length === 0/);
  }
});
```

- [ ] **Step 2: Run the contract and verify the order fails**

Run: `node --test src/test/public-experience.test.mjs`

Expected: FAIL because the current homepage order places benefits before featured tournaments.

- [ ] **Step 3: Reorder and redesign the homepage sections**

Use `SectionHeading`, `GlassCard`, shared container widths, semantic tokens, and the approved copy hierarchy. Rename the visible “Core Features” presentation to “Why GoEzPz” while retaining the component filename. Remove repetitive all-caps gradient headings and invented claims such as global leaderboard/community size when no supporting data exists. Keep API-driven games, tournaments, and partners unchanged.

- [ ] **Step 4: Make games and partners responsive without mandatory autoplay**

On mobile, use scroll-snap rows with labelled content; on desktop, use a balanced grid or controlled carousel. Preserve user control, pause automatic motion on hover/focus when retained, and disable it under reduced motion. Do not duplicate items merely to imply more unique games or partners than the API returned.

- [ ] **Step 5: Verify homepage behavior**

Run: `node --test src/test/public-experience.test.mjs src/test/accessibility-contract.test.mjs`

Run: `npm test`

Expected: all tests PASS.

Run: `npm run lint && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/'(components)'/landing src/test/public-experience.test.mjs
git commit -m "feat: refresh public homepage journey"
```

---

### Task 4: Upgrade Tournament Cards, Search, and Filters

**Files:**
- Modify: `src/app/(components)/shared/EventCard.tsx`
- Modify: `src/app/(components)/shared/TournamentList.tsx`
- Modify: `src/app/(site)/tournaments/page.tsx`
- Modify: `src/test/public-experience.test.mjs`
- Test: `src/features/tournaments/phase.test.ts`

**Interfaces:**
- Produces: exported pure `filterTournaments(tournaments, { query, game, status }): ApiTournament[]` in `TournamentList.tsx` or a focused `src/features/tournaments/filter.ts` if extraction keeps the component readable.
- Consumes: `ApiTournament`, `ApiTournamentStatus`, Task 1 `GlassCard`, `StatusBadge`, `Button`, and `SectionHeading`.

- [ ] **Step 1: Add failing filter and accessibility contracts**

Append to `src/test/public-experience.test.mjs`:

```js
test("tournament discovery exposes labelled search, game, status, and reset controls", async () => {
  const source = await readFile("src/app/(components)/shared/TournamentList.tsx", "utf8");
  assert.match(source, /<label[^>]*htmlFor="tournament-search"/);
  assert.match(source, /id="tournament-game"/);
  assert.match(source, /id="tournament-status"/);
  assert.match(source, /Reset filters/);
  assert.match(source, /aria-live="polite"/);
});

test("tournament cards use shared glass and textual status primitives", async () => {
  const source = await readFile("src/app/(components)/shared/EventCard.tsx", "utf8");
  assert.match(source, /GlassCard/);
  assert.match(source, /StatusBadge/);
  assert.match(source, /View tournament/);
});
```

- [ ] **Step 2: Run the contracts and verify failure**

Run: `node --test src/test/public-experience.test.mjs`

Expected: FAIL on the missing labelled status filter, reset control, shared primitives, and explicit card action.

- [ ] **Step 3: Implement deterministic client-side filtering**

Normalize query text with `trim().toLocaleLowerCase("en")`. Match tournament name or game name; match exact selected game and exact `ApiTournamentStatus`; use `"All"` sentinels for both selects. Derive options from validated input only. Reset all three controls together. Announce the result count with `aria-live="polite"`; distinguish “no API tournaments” at the route level from “no matches” after filters.

- [ ] **Step 4: Rebuild the card hierarchy**

Use a responsive `GlassCard`, local status mapping, explicit game/date/platform/team-format metadata, and one “View tournament” action. Preserve image fallbacks and omit unavailable optional metadata instead of rendering misleading defaults. Keep the existing encoded tournament route.

- [ ] **Step 5: Verify tournament discovery**

Run: `node --test src/test/public-experience.test.mjs`

Run: `npm test`

Expected: all tests PASS.

Run: `npm run lint && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/'(components)'/shared/EventCard.tsx src/app/'(components)'/shared/TournamentList.tsx src/app/'(site)'/tournaments/page.tsx src/test/public-experience.test.mjs src/features/tournaments
git commit -m "feat: improve tournament discovery experience"
```

---

### Task 5: Restructure the Tournament Detail Experience

**Files:**
- Modify: `src/app/(site)/tournaments/[id]/TournamentDetailClient.tsx`
- Modify: `src/app/(site)/tournaments/[id]/page.tsx`
- Modify: `src/test/public-experience.test.mjs`
- Test: `src/features/tournaments/content.test.ts`
- Test: `src/features/tournaments/phase.test.ts`

**Interfaces:**
- Consumes: existing `initialTournament`, `isAuthenticated`, join/leave API routes, phase/content helpers, and Task 1 primitives.
- Produces: accessible detail tabs, prominent preserved join/leave action, readable information surfaces, and contained bracket overflow.

- [ ] **Step 1: Add failing detail-layout contracts**

Append to `src/test/public-experience.test.mjs`:

```js
test("tournament detail preserves mutation flow in an accessible glass layout", async () => {
  const source = await readFile("src/app/(site)/tournaments/[id]/TournamentDetailClient.tsx", "utf8");
  assert.match(source, /role="tablist"/);
  assert.match(source, /role="tab"/);
  assert.match(source, /aria-selected=/);
  assert.match(source, /aria-busy=/);
  assert.match(source, /overflow-x-auto/);
  assert.match(source, /GlassCard/);
  assert.match(source, /clientJson/);
});
```

- [ ] **Step 2: Run the detail contract and verify failure**

Run: `node --test src/test/public-experience.test.mjs`

Expected: FAIL because the existing tab navigation lacks tab semantics and shared glass primitives.

- [ ] **Step 3: Recompose the detail page without changing behavior**

Keep `refreshTournament()` and `mutate()` request paths, auth redirects, toasts, pending guard, and server-derived eligibility unchanged. Move essential facts and join/leave action into a prominent summary surface. Use semantic tabs with `role="tablist"`, `role="tab"`, `aria-selected`, and linked tab panels. Add `aria-busy={pending !== null}` to the action region. Preserve safe-text conversion and safe external rules links.

- [ ] **Step 4: Contain complex content and improve responsive hierarchy**

Wrap the bracket viewer in a labelled `overflow-x-auto` region. Limit long-form text width, keep schedule/countdown labels readable, and make the desktop summary sticky only inside its column. Confirm no sticky control covers content on mobile.

- [ ] **Step 5: Verify detail behavior**

Run: `node --test src/test/public-experience.test.mjs`

Run: `npm test`

Expected: all tests PASS.

Run: `npm run lint && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/'(site)'/tournaments/'[id]' src/test/public-experience.test.mjs
git commit -m "feat: refine tournament detail hierarchy"
```

---

### Task 6: Unify Partners and Footer

**Files:**
- Modify: `src/app/(site)/partners/page.tsx`
- Modify: `src/app/(components)/(layout)/Footer.tsx`
- Modify: `src/test/public-experience.test.mjs`
- Test: `src/test/branding-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1 primitives and current `brandService` result.
- Produces: quieter partner grid and unified footer while preserving every legal/support/social destination.

- [ ] **Step 1: Add failing partners/footer contracts**

Append to `src/test/public-experience.test.mjs`:

```js
test("partners and footer use the public glass system without changing destinations", async () => {
  const partners = await readFile("src/app/(site)/partners/page.tsx", "utf8");
  const footer = await readFile("src/app/(components)/(layout)/Footer.tsx", "utf8");
  assert.match(partners, /GlassCard/);
  assert.match(partners, /role="alert"/);
  assert.match(footer, /GlassCard|surface-glass/);
  assert.match(footer, /support@xesports\.pro/);
  assert.match(footer, /Visit GoEzPz on/);
});
```

- [ ] **Step 2: Run the contracts and verify failure**

Run: `node --test src/test/public-experience.test.mjs src/test/branding-contract.test.mjs`

Expected: the new partners/footer glass contract FAILS while existing brand contracts remain green.

- [ ] **Step 3: Redesign partners and footer**

Use a restrained partner grid with contained logos, accessible names, explicit ready/empty/error presentation, and no grayscale-only affordance. Apply the shared surface and typography tokens to the footer. Preserve all route, mail, legal, and social URLs byte-for-byte. Preserve the logo aspect ratio and linked-home accessible name.

- [ ] **Step 4: Verify partners, footer, and branding**

Run: `node --test src/test/public-experience.test.mjs src/test/branding-contract.test.mjs src/test/accessibility-contract.test.mjs`

Expected: all tests PASS.

Run: `npm run lint && npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/app/'(site)'/partners/page.tsx src/app/'(components)'/'(layout)'/Footer.tsx src/test/public-experience.test.mjs
git commit -m "feat: unify partners and public footer"
```

---

### Task 7: Full Verification, Responsive QA, Preview, and PR Update

**Files:**
- Modify if findings require it: public-scope files listed in Tasks 1–6
- Modify: `docs/release-checklist.md` only if a new repeatable media/responsive check is absent
- Do not commit: `.superpowers/brainstorm/**`, `.next/**`, or local screenshots

**Interfaces:**
- Consumes: completed Tasks 1–6 and the existing private Sites project.
- Produces: verified branch, updated draft PR, and a private preview ready for user acceptance.

- [ ] **Step 1: Run the complete local quality gate**

Run: `npm run check`

Expected: lint, semantic typecheck, all unit/source/static-asset tests, source-safety checks, asset budgets, and production build PASS with exit code 0.

- [ ] **Step 2: Inspect the complete public UI diff**

Run:

```bash
git diff --check 5ddcfde..HEAD
git diff --stat 5ddcfde..HEAD
git status -sb
```

Expected: no whitespace errors, only intended public UI/design-system/media/test/docs files, and a clean tracked worktree. `.superpowers/` remains untracked local brainstorming output and must not be staged.

- [ ] **Step 3: Run manual responsive and interaction QA**

Start the production build or development server and verify at widths 375, 430, 768, 1024, 1440, and 1920 pixels:

- Header and mobile menu; keyboard open/close/Escape/focus behavior
- Hero video, poster fallback, reduced-motion behavior, CTA, contrast, and no layout shift
- Homepage section order and truthful ready/empty/error states
- Tournament search, game filter, status filter, reset, result announcement, and filtered-empty state
- Tournament detail tabs, join/leave pending state, long text, and bracket overflow
- Partner grid, footer links, logo containment, and page-level horizontal overflow
- Browser console contains no new errors or hydration warnings

- [ ] **Step 4: Request final code review and fix findings**

Use `superpowers:requesting-code-review` over `5ddcfde..HEAD`. Fix every Critical and Important finding. Fix Minor findings that contradict the approved design or accessibility requirements. Rerun the scoped test after each fix, then rerun `npm run check` once the review is clean.

- [ ] **Step 5: Push the reviewed branch and wait for CI**

Push local `HEAD` to the existing remote PR branch `agent/security-reliability-hardening`. Confirm draft PR #3 points to the exact local SHA. Run:

```bash
gh pr checks 3 --repo abhijitpattanaikad-ui/ESAS --watch --interval 5
```

Expected: the `quality` check reaches `pass` for the exact pushed head.

- [ ] **Step 6: Deploy and inspect the private preview**

Use the existing Sites project from `.openai/hosting.json`. Save and deploy a version from the exact pushed commit. Verify the returned deployment reaches a terminal ready state, inspect error-only logs, and repeat the responsive/interaction smoke checks against the private URL. Do not change site access unless the user requests it.

- [ ] **Step 7: Record delivery evidence**

Report the final commit SHA, draft PR URL, CI check URL/state, local `npm run check` result and test count, private preview URL, responsive widths checked, reduced-motion result, and any poster-only fallback decision. Keep the isolated worktree for PR feedback.
