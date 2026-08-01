# GoEzPz Public UI/UX Refresh Design

**Date:** 2026-08-01
**Status:** Approved design, pending written-spec review
**Scope:** Public customer experience only: shared public navigation and footer, homepage, tournament listing, tournament detail, and partners page. Authentication, profile, and dashboard visual redesigns are excluded from this phase.

## Objective

Refresh the public GoEzPz frontend into a coherent, premium esports experience without removing its orange identity. Improve visual hierarchy, navigation, responsiveness, accessibility, content scanning, loading/empty/error communication, and conversion toward tournament discovery. Preserve all existing backend contracts, authentication behavior, routes, tournament actions, external destinations, and operational identifiers.

## Approved Direction

The selected system is **Immersive Glass** with an **Editorial Split** hero.

The experience uses a midnight navy/charcoal base, translucent dark surfaces, fine light borders, restrained backdrop blur, and atmospheric orange illumination. Orange remains the signature color for primary actions, active states, focus rings, status accents, and selected details. White and cool gray remain the dominant text colors to protect readability.

The design must avoid excessive glow, low-contrast glass, decorative clutter, and orange-filled backgrounds that weaken hierarchy. Glass effects are progressive enhancement: content must remain legible when backdrop filtering is unavailable.

## Design Tokens

The existing orange/`jaffa` palette remains the brand palette. Implementation will consolidate reusable public-facing values into semantic tokens for:

- Page, elevated, glass, and inset surfaces
- Primary, secondary, muted, and inverse text
- Brand, brand-hover, brand-subtle, success, warning, and error states
- Fine borders, strong borders, focus rings, and shadows
- Small, medium, large, and feature radii
- Shared content widths and section spacing

The current Exo and Barlow font setup remains. Typography gains a consistent display, section-heading, card-heading, body, label, and metadata scale. Uppercase labels are used sparingly for short esports-oriented eyebrows and statuses, not for paragraphs or dense navigation.

## Component Architecture

The project already uses strict TypeScript, Tailwind CSS, and the `@/* -> src/*` alias, but it does not use the conventional shadcn structure. This phase establishes a small shadcn-compatible primitive layer:

- `src/components/ui/animated-banner.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/glass-card.tsx`
- `src/components/ui/status-badge.tsx`
- `src/components/ui/section-heading.tsx`
- `src/lib/utils.ts`
- `components.json`

The `cn()` helper will combine the existing `clsx` dependency with `tailwind-merge` to handle conditional classes and resolve conflicting Tailwind utilities. `tailwind-merge` is the only new UI utility dependency required by this structure. Existing components under `src/app/(components)/ui` remain supported and will be migrated only when required by this public refresh; there is no wholesale component rewrite.

Page-specific sections continue to live near the app structure. Reusable visual primitives live in `src/components/ui` so future shadcn-compatible additions have one predictable location.

## Navigation

The public header becomes a floating glass navigation surface with:

- GoEzPz logo linking to the homepage
- Tournaments and Partners links
- Sign-in access and an orange “Let's Play” action for signed-out users
- Existing profile/session behavior for signed-in users
- Clear current-page, hover, pressed, and keyboard-focus states
- A compact mobile menu with focus management, labelled controls, and comfortable touch targets

The header must not obscure anchored content, overflow narrow screens, or change existing destinations. Navigation stays readable over both the hero and regular page backgrounds.

## Homepage Journey

The homepage follows this order:

1. Fixed GoEzPz platform hero
2. Featured tournaments
3. Why GoEzPz
4. Featured games
5. Trusted partners
6. Community call to action
7. Footer

Each section has one primary purpose and a consistent heading pattern. Decorative backgrounds must not interfere with content scanning or produce abrupt transitions between sections.

### Platform Hero

The first hero is a fixed brand message rather than a dynamic tournament promotion.

- Eyebrow: **Play · Compete · Rise**
- Heading: **Your arena. Your legacy.**
- Supporting text: **Discover tournaments, compete with confidence, and make every match count.**
- Primary CTA: **Explore tournaments**, linking to `/tournaments`
- No countdown is rendered

The desktop composition places copy on the left and cinematic esports media on the right. A local, optimized temporary esports video is used, with a local poster fallback and a documented replacement path. No runtime third-party media hotlink is allowed.

On mobile, copy overlays or precedes the media with a stronger contrast gradient. The heading, CTA, and essential message must remain visible without requiring video playback.

### Animated Banner Adaptation

The supplied `AnimatedBanner` concept is integrated as a reusable primitive, adapted to the application rather than copied without modification:

- Uses Next.js `Link` for internal navigation
- Accepts title, subtitle, CTA label, destination, video source, poster source, overlay color, and class name
- Retains an optional deadline/countdown API for future tournament campaigns, but the platform hero leaves it unset
- Provides a useful accessible name and visible focus treatment
- Treats video as decorative and keeps the content accessible without it
- Pauses or suppresses autoplay for `prefers-reduced-motion`
- Falls back to the poster when video loading or playback fails
- Uses responsive aspect/min-height rules instead of forcing `aspect-[5/2]` on every viewport

If a future countdown is used, visible values must have an accessible text equivalent and must stop updating after reaching zero.

## Featured Tournaments

Featured and listing cards share one information hierarchy:

1. Artwork
2. Status label
3. Tournament name
4. Date or phase
5. Platform/game and team format when available
6. Clear details action

Cards use translucent surfaces, restrained orange hover/focus accents, and sufficiently large interactive targets. The entire card may be linked only if nested controls are avoided. Missing optional values are omitted rather than replaced with invented content.

Homepage featured tournaments use the existing API result and availability model. Ready, empty, and error outcomes remain truthful and visually distinct.

## Tournament Listing

The listing page gains a clear title, short orientation copy, search, and filters based only on data that the current frontend can reliably evaluate. Initial implementation should prefer client-side search/status/game filtering over new backend query assumptions.

The grid adapts from one column on narrow screens to a balanced multi-column desktop layout. Filter controls use native semantics, persistent labels, keyboard support, and a visible reset path. An empty filtered result is distinguished from an upstream API error.

## Tournament Detail

The detail page uses a wide event banner followed by a structured summary surface. Essential facts and the join/leave action appear before secondary content. Content areas include only currently supported information, such as overview, schedule/timing, participants, rules/description, and bracket data.

Join/leave behavior, authentication requirements, API requests, and error semantics remain unchanged. The action becomes visually prominent and may become sticky within the summary column on large screens, but it must not cover content on mobile.

Long text receives readable line length and spacing. Bracket content may scroll within a clearly labelled region when its intrinsic width requires it; the page itself must not create unintended horizontal overflow.

## Partners and Footer

Partners use a quieter glass grid with consistent logo containment, accessible names, and truthful empty/error messaging. Partner marks remain secondary to tournament discovery.

The footer uses the same surface, typography, spacing, and interaction tokens as the rest of the public system. Existing legal, support, and social destinations remain unchanged. The GoEzPz logo retains its intrinsic aspect ratio.

## Motion and Interaction

Motion communicates hierarchy and feedback rather than running continuously across the page. Permitted effects include short fades, small translations, restrained surface elevation, and orange highlight changes. All non-essential motion respects `prefers-reduced-motion`.

Hover is never the only way to reveal required information. Keyboard focus is always visible. Controls meet comfortable touch sizing, and status is never communicated by color alone.

## Data and State Boundaries

The refresh consumes the existing server-fetched tournament, game, and partner results. It does not add mock fallback data or reinterpret API failures as valid empty results.

Each public data section must support:

- Loading or transition feedback where client interaction introduces latency
- Ready state using validated API data
- Genuine empty state with a useful next action
- Error state that explains the section could not be loaded without fabricating content

No backend schema, session storage, cookie, security header, API platform identifier, or environment-variable contract changes are part of this work.

## Media and Performance

The temporary hero video and poster are local repository assets. The video should be short, silent, loopable, compressed for web delivery, and sized to avoid waste on common desktop displays. Mobile and reduced-motion users may receive the poster instead of video.

The existing static-asset budget gate remains authoritative. If an acceptable local stock video cannot fit the agreed asset constraints, the release uses the poster with subtle CSS motion until a production video is supplied; quality gates are not weakened to admit oversized media.

Images retain explicit responsive sizing and aspect control. Glass blur and shadow layers are limited to major surfaces to avoid excessive paint cost.

## Responsive Behavior

- **Mobile:** single-column reading order, media behind or below hero copy, horizontally scrollable game row where appropriate, single-column tournament cards, compact navigation, no page-level horizontal overflow.
- **Tablet:** two-column card grids where space permits and a reduced editorial split.
- **Desktop:** editorial split hero, multi-column tournament/game layouts, wider event summary composition, and balanced section whitespace.

Layouts must be verified at representative narrow mobile, large mobile, tablet, laptop, and wide desktop widths.

## Accessibility

The work targets practical WCAG 2.2 AA behavior:

- Semantic headings and landmarks
- Keyboard-operable navigation, filters, cards, and actions
- Visible focus indicators
- Accessible names for icon-only controls and linked logos
- Text/status equivalents for visual state
- Sufficient foreground and interactive-state contrast
- Reduced-motion support
- Decorative media hidden from assistive technology
- No information loss when video, images, blur, or animation is unavailable

## Validation

Automated verification will include:

- Tests for component props, class composition, hero copy/destination, local media policy, and video/poster fallback contracts
- Accessibility source/behavior contracts for labelled controls, focusable navigation, and reduced-motion handling
- Existing tournament, authentication, consent, security, and branding regressions
- ESLint and semantic TypeScript checks
- Static asset reference and size-budget checks
- Source safety checks
- Production Next.js build

Manual verification on the private preview will cover:

- Homepage journey and hero fallback behavior
- Header/menu behavior signed in and signed out where testable
- Tournament listing search/filter/empty/error presentation
- Tournament detail information hierarchy and join/leave placement
- Partners and footer consistency
- Keyboard navigation and visible focus
- Mobile, tablet, and desktop layout behavior
- Browser console and deployment error logs

## Delivery

Implementation will continue on the current GoEzPz feature branch and update the existing draft pull request after verification and review. A new private preview version will be deployed for visual acceptance. The isolated worktree remains available for PR feedback.

## Explicit Non-Goals

- Redesigning authentication pages, profile, or dashboard in this phase
- Changing API contracts, authentication semantics, cookies, headers, or operational identifiers
- Introducing a content-management system or backend filter API
- Creating fictional tournament, game, partner, or player data
- Depending on runtime third-party hero media
- Replacing the orange brand theme
