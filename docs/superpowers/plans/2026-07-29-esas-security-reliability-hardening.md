# ESAS Security and Reliability Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the uploaded XeSports frontend prototype into a reproducible, test-gated Next.js application with server-managed authentication, trustworthy tournament data, safe rendering, consent-aware analytics, accessible controls, and a reviewable GitHub delivery path.

**Architecture:** Keep the existing Next.js 15 App Router application and upstream XeSports API. Add a thin same-origin BFF through Next route handlers so bearer tokens remain in `Secure`, `HttpOnly`, `SameSite=Lax` cookies and browser code never receives them. Public reads remain server-side and cached; authenticated reads and mutations are proxied server-side, with typed errors and explicit UI states rather than fake or empty fallbacks.

**Tech Stack:** Next.js 15.5.7, React 19, TypeScript strict mode, Tailwind CSS 4, native `fetch`, Vitest, Testing Library, Playwright smoke coverage, GitHub Actions.

## Global Constraints

- Do not expose bearer tokens, user IDs, reset tokens, or verification tokens to analytics or browser storage.
- Never fabricate brackets, standings, scores, tournament status, or API success in production.
- Backend authorization remains authoritative; the frontend must not send a user identity for authorization.
- Preserve the existing visual identity unless a change is required for accessibility, security, or performance.
- Do not introduce microservices, agents, realtime infrastructure, or a new database.
- Every behavior change starts with a failing automated test where technically feasible.
- All pull requests must pass install, lint, typecheck, unit tests, and production build.

---

### Task 1: Reproducible Toolchain and Quality Gate

**Files:**
- Modify: `package.json`
- Regenerate: `package-lock.json`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `.github/workflows/quality.yml`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run check`, the single local/CI validation command used by every later task.

- [ ] **Step 1: Add a failing quality-gate smoke test**

Create `src/test/toolchain.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import packageJson from "../../package.json";

describe("toolchain contract", () => {
  it("keeps Next and eslint-config-next on the same major and minor", () => {
    expect(packageJson.devDependencies["eslint-config-next"]).toBe("15.5.7");
    expect(packageJson.dependencies.next).toBe("15.5.7");
  });

  it("defines the complete quality gate", () => {
    expect(packageJson.scripts.check).toBe(
      "npm run lint && npm run typecheck && npm run test && npm run build",
    );
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/test/toolchain.test.ts`

Expected: FAIL because Vitest/scripts are not configured and package versions are mismatched/ranged.

- [ ] **Step 3: Align dependencies and scripts**

Set exact versions for `next` and `eslint-config-next` to `15.5.7`; add `lint`, `typecheck`, `test`, `test:watch`, `test:e2e`, and `check`. Add Vitest, jsdom, Testing Library, Playwright, and `libphonenumber-js`. Remove Axios after all services use the shared fetch layer.

- [ ] **Step 4: Add flat ESLint, Vitest, and CI configuration**

CI runs Node 22, `npm ci`, `npm run check`, and uploads Playwright output only when smoke tests fail.

- [ ] **Step 5: Regenerate lockfile and verify GREEN**

Run:

```bash
rm -rf node_modules package-lock.json
npm install
npm test -- src/test/toolchain.test.ts
```

Expected: PASS with no invalid dependency tree.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json eslint.config.mjs vitest.config.ts vitest.setup.ts .github/workflows/quality.yml .gitignore src/test/toolchain.test.ts
git commit -m "build: add reproducible quality gate"
```

### Task 2: Shared HTTP, Error, Environment, and Session Boundary

**Files:**
- Create: `src/lib/env.ts`
- Create: `src/lib/http/response.ts`
- Create: `src/lib/http/errors.ts`
- Create: `src/lib/http/upstream.ts`
- Create: `src/lib/auth/session.ts`
- Test: `src/lib/http/response.test.ts`
- Test: `src/lib/auth/session.test.ts`

**Interfaces:**
- Produces: `readResponseBody(response)`, `UpstreamError`, `upstreamFetch(path, init)`, `SESSION_COOKIE`, `getSessionToken()`, `setSessionCookie(token)`, and `clearSessionCookie()`.

- [ ] **Step 1: Write response parsing tests**

```ts
import { describe, expect, it } from "vitest";
import { readResponseBody } from "./response";

describe("readResponseBody", () => {
  it("parses JSON from one body read", async () => {
    const response = new Response('{"message":"ok"}', {
      headers: { "content-type": "application/json" },
    });
    await expect(readResponseBody(response)).resolves.toEqual({ message: "ok" });
  });

  it("wraps plain text without attempting a second body read", async () => {
    const response = new Response("expired token");
    await expect(readResponseBody(response)).resolves.toEqual({ message: "expired token" });
  });
});
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/lib/http/response.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement one-read response parsing and normalized upstream errors**

`readResponseBody` reads `response.text()` once, returns parsed JSON when valid, `{ message: text }` otherwise, and `{}` for an empty response.

- [ ] **Step 4: Write session-cookie option tests**

Assert cookie name is `xesports_session`, `httpOnly=true`, `sameSite="lax"`, `path="/"`, and `secure` outside development.

- [ ] **Step 5: Implement environment and cookie helpers**

`XESPORTS_API_URL` is server-only, defaults to `https://apis.xesports.pro`, and is never exposed through `NEXT_PUBLIC_*`. `upstreamFetch` adds a 10-second abort timeout and accepts an optional bearer token.

- [ ] **Step 6: Verify GREEN**

Run: `npm test -- src/lib/http/response.test.ts src/lib/auth/session.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib
 git commit -m "feat: add secure upstream and session boundary"
```

### Task 3: Same-Origin Authentication BFF

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/signup/route.ts`
- Create: `src/app/api/auth/forgot-password/route.ts`
- Create: `src/app/api/auth/reset-password/route.ts`
- Create: `src/app/api/auth/verify-email/route.ts`
- Create: `src/app/api/auth/session/route.ts`
- Create: `src/app/api/profile/route.ts`
- Create: `src/app/api/profile/image/route.ts`
- Test: `src/app/api/auth/login/route.test.ts`

**Interfaces:**
- Browser endpoints: `/api/auth/*` and `/api/profile`.
- The login response contains only non-sensitive presentation data; the upstream token is written to the session cookie and removed from JSON.

- [ ] **Step 1: Write a failing login route test**

Mock `upstreamFetch` to return `{ token: "secret", username: "Player" }`; assert response JSON is `{ username: "Player" }` and `Set-Cookie` contains `HttpOnly` but not the token in the body.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/app/api/auth/login/route.test.ts`

Expected: FAIL because the route does not exist.

- [ ] **Step 3: Implement login/logout/session routes**

Reject malformed input with 400. Login proxies `/v1/user/login`, stores the token server-side, and returns a safe user summary. Logout clears the cookie. Session returns `{ authenticated: boolean }` without exposing the token.

- [ ] **Step 4: Implement signup, forgot, reset, and verify proxies**

Reset/verify tokens are accepted in the request body only, sent to upstream authorization headers where required, and never logged.

- [ ] **Step 5: Implement profile GET/POST/image proxy**

All profile endpoints require the session cookie. Return 401 when missing and preserve upstream status/message without collapsing it to `null`.

- [ ] **Step 6: Verify GREEN**

Run: `npm test -- src/app/api/auth/login/route.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/api
 git commit -m "feat: proxy authentication through http-only sessions"
```

### Task 4: Auth Forms, Token State Machines, Terms Evidence, and International Phone Validation

**Files:**
- Create: `src/features/auth/validation.ts`
- Create: `src/features/auth/token-state.ts`
- Test: `src/features/auth/validation.test.ts`
- Test: `src/features/auth/token-state.test.ts`
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/signup/page.tsx`
- Modify: `src/app/(auth)/forgot-password/page.tsx`
- Modify: `src/app/reset/password/ResetPasswordInner.tsx`
- Modify: `src/app/(auth)/verify/email/VerifyMailInner.tsx`

**Interfaces:**
- Produces: `validateSignup`, `normalizePhoneNumber`, `TERMS_VERSION`, and explicit reset/verification states.

- [ ] **Step 1: Write phone and signup validation tests**

Cover UAE `+971 50 123 4567`, India `+91 98765 43210`, invalid short numbers, password mismatch, and terms rejection. Assert the payload contains `termsVersion` and `termsAcceptedAt`.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/features/auth/validation.test.ts`

Expected: FAIL because validation helpers do not exist.

- [ ] **Step 3: Implement validation using `libphonenumber-js`**

Default country is `AE`, output is E.164, and the terms version is a fixed release value rather than the current date.

- [ ] **Step 4: Write reset and verification state tests**

Assert success has one login destination, expired has one request-new-link destination, missing token allows manual entry, and no state schedules competing redirects.

- [ ] **Step 5: Rewrite auth pages to same-origin endpoints**

Remove `NEXT_PUBLIC_MOCK_AUTH`, all auth `localStorage`, all client-supplied user IDs, and direct upstream URLs. Disable submit buttons during requests and add dynamic password-toggle labels.

- [ ] **Step 6: Remove sensitive query values immediately**

Read the token once on mount, call `history.replaceState({}, "", pathname)`, then send it to the same-origin route. Do not render or log it.

- [ ] **Step 7: Verify GREEN**

Run: `npm test -- src/features/auth/validation.test.ts src/features/auth/token-state.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/features/auth src/app/'(auth)' src/app/reset
 git commit -m "fix: harden authentication and recovery flows"
```

### Task 5: Server-Side Route Protection and Auth-Aware Shell

**Files:**
- Create: `src/middleware.ts`
- Create: `src/app/(components)/(layout)/SiteShellClient.tsx`
- Modify: `src/app/(site)/layout.tsx`
- Modify: `src/app/(components)/dashboard/layout.tsx`
- Modify: `src/app/(components)/(layout)/ModernHeader.tsx`
- Modify: `src/app/(components)/(layout)/ModernProfileButton.tsx`
- Delete: `src/app/(components)/ProtectedRoute.tsx`
- Modify: `src/app/(site)/profile/page.tsx`
- Modify: `src/app/(services)/userService.ts`

**Interfaces:**
- Middleware protects `/profile` and `/dashboard` from requests without the session cookie.
- Server layouts pass only `isLoggedIn` to client navigation components.

- [ ] **Step 1: Write middleware matcher tests around exported path helpers**

Assert protected paths redirect without a cookie and public tournament pages remain accessible.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/lib/auth/protection.test.ts`

Expected: FAIL because protection helpers do not exist.

- [ ] **Step 3: Implement server auth detection and client shell**

The site layout reads `cookies()` server-side and never blank-renders while waiting for `localStorage`. The client shell owns only menu state.

- [ ] **Step 4: Rewrite logout and profile calls**

Logout calls `/api/auth/logout`. Profile reads `/api/profile`; update and image upload use the same-origin proxy. Use typed results instead of `any` and `null` fallbacks.

- [ ] **Step 5: Verify GREEN and render behavior**

Run: `npm test -- src/lib/auth/protection.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/middleware.ts src/app/'(site)' src/app/'(components)' src/app/'(services)'/userService.ts src/lib/auth
 git commit -m "fix: enforce server-side session protection"
```

### Task 6: Trustworthy Tournament Contracts, Phases, and Error States

**Files:**
- Rewrite: `src/app/(types)/event.ts`
- Create: `src/features/tournaments/contracts.ts`
- Create: `src/features/tournaments/phase.ts`
- Create: `src/features/tournaments/countdown.ts`
- Create: `src/features/tournaments/api.ts`
- Test: `src/features/tournaments/contracts.test.ts`
- Test: `src/features/tournaments/phase.test.ts`
- Test: `src/features/tournaments/countdown.test.ts`
- Modify: `src/app/(services)/tournamentService.ts`
- Modify: `src/app/(components)/shared/EventCard.tsx`
- Modify: `src/app/(components)/shared/TournamentList.tsx`
- Modify: `src/app/(components)/landing/FeaturedEvents.tsx`

**Interfaces:**
- Produces discriminated `DataResult<T>` states: `success`, `empty`, `not-found`, `unauthorized`, and `error`.
- Produces `TournamentPhase` independent of display copy.

- [ ] **Step 1: Write contract rejection tests**

Unknown statuses, invalid schedules, and missing game data must be rejected or normalized to `Status unavailable`; they must never become `Upcoming` silently.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/features/tournaments/contracts.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement runtime type guards and normalized domain types**

Accept `unknown`, validate required fields, make optional API fields explicit, and replace `any[]` with named participant/prize types.

- [ ] **Step 4: Write phase and countdown tests**

Cover before registration, registration open, closed/pre-start, active, completed, invalid dates, and a duration greater than one month. Countdown uses total milliseconds and total days.

- [ ] **Step 5: Implement phase/countdown utilities**

No logic may inspect `heading` or `text`. Backend-provided phase is accepted only when it matches the supported enum; otherwise dates determine presentation.

- [ ] **Step 6: Replace silent empty fallbacks**

Public reads throw/return explicit failure states. UI shows retryable errors separately from genuine empty data.

- [ ] **Step 7: Harden EventCard**

Guard game/schedule fields, validate dates, remove `unoptimized`, provide accurate `sizes`, and render “Status unavailable” for unknown values.

- [ ] **Step 8: Verify GREEN**

Run: `npm test -- src/features/tournaments/*.test.ts`

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/features/tournaments src/app/'(types)'/event.ts src/app/'(services)'/tournamentService.ts src/app/'(components)'/shared src/app/'(components)'/landing/FeaturedEvents.tsx
 git commit -m "fix: make tournament data explicit and trustworthy"
```

### Task 7: Tournament Detail Server Rendering and Safe Content

**Files:**
- Create: `src/app/(site)/tournaments/[id]/TournamentDetailClient.tsx`
- Rewrite: `src/app/(site)/tournaments/[id]/page.tsx`
- Create: `src/app/api/tournaments/[id]/join/route.ts`
- Create: `src/app/api/tournaments/[id]/leave/route.ts`
- Create: `src/app/api/tournaments/[id]/route.ts`
- Create: `src/features/tournaments/content.ts`
- Test: `src/features/tournaments/content.test.ts`

**Interfaces:**
- Public detail page server-renders initial tournament data and metadata.
- Description/rules render escaped text, never raw API HTML.

- [ ] **Step 1: Write content safety tests**

Assert `<script>alert(1)</script><p>Hello<br>world</p>` becomes readable plain text and is never returned as executable markup.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/features/tournaments/content.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement safe text normalization**

Convert common block/line-break tags to newlines, remove remaining markup, decode only a small named-entity set, and render the result through normal React text interpolation.

- [ ] **Step 4: Server-render the page**

Use `generateMetadata`, `notFound()` only for a confirmed 404, and an explicit error panel for upstream failure. Dynamically import the bracket module from its path rather than wrapping a static import.

- [ ] **Step 5: Implement authenticated tournament proxies**

Join/leave derive identity only from the validated session cookie and send only tournament criteria required by the upstream API. No user ID is accepted from the browser.

- [ ] **Step 6: Verify GREEN**

Run: `npm test -- src/features/tournaments/content.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/'(site)'/tournaments src/app/api/tournaments src/features/tournaments
 git commit -m "fix: server-render safe tournament details"
```

### Task 8: Bracket Domain Split and No-Fabrication Policy

**Files:**
- Create: `src/features/brackets/types.ts`
- Create: `src/features/brackets/contracts.ts`
- Create: `src/features/brackets/adapter.ts`
- Create: `src/features/brackets/api.ts`
- Create: `src/features/brackets/fixtures/single-elimination.ts`
- Test: `src/features/brackets/adapter.test.ts`
- Rewrite: `src/app/(services)/bracketService.ts`
- Delete: `src/app/(utils)/bracketAdapter.ts`
- Modify: `src/app/(components)/shared/BracketView.tsx`
- Modify: `src/app/(components)/shared/brackets/*.tsx`

**Interfaces:**
- `getBracket(tournamentId)` returns `DataResult<BracketData>` and never returns fixtures after a network/schema failure.

- [ ] **Step 1: Write adapter tests using extracted fixtures**

Cover the provided `api_resp.json`, byes, missing opponents, unknown status, and malformed response.

- [ ] **Step 2: Write the no-fabrication regression test**

Mock an upstream 500 and assert `getBracket` returns `{ kind: "error" }`, not scores or players.

- [ ] **Step 3: Verify RED**

Run: `npm test -- src/features/brackets/adapter.test.ts`

Expected: FAIL because current service returns mock data.

- [ ] **Step 4: Implement types, guard, adapter, and API module**

Map upstream statuses to a closed union without `as any`. Keep fixtures under test-only imports.

- [ ] **Step 5: Update bracket UI**

Render loading, unavailable/retry, empty/not-generated, and success separately. Do not imply tournament results when unavailable.

- [ ] **Step 6: Verify GREEN**

Run: `npm test -- src/features/brackets/adapter.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/brackets src/app/'(services)'/bracketService.ts src/app/'(components)'/shared src/app/'(utils)'/bracketAdapter.ts
 git commit -m "fix: remove fabricated bracket fallbacks"
```

### Task 9: Consent-Aware Analytics, Security Headers, and Legal Consistency

**Files:**
- Create: `src/app/(components)/privacy/ConsentManager.tsx`
- Create: `src/lib/privacy/consent.ts`
- Test: `src/lib/privacy/consent.test.ts`
- Modify: `src/app/layout.tsx`
- Modify: `next.config.ts`
- Modify: `src/app/(site)/privacy/page.tsx`
- Modify: `src/app/(site)/terms/page.tsx`

**Interfaces:**
- GTM is inserted only after explicit analytics consent.
- Legal documents expose a fixed version date and one support address.

- [ ] **Step 1: Write consent tests**

Assert default is `essential-only`, analytics is opt-in, and malformed stored values reset to essential-only.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/lib/privacy/consent.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement consent manager**

Use a first-party cookie/local preference for consent only. Do not load GTM on reset/verify routes even after consent.

- [ ] **Step 4: Add security headers**

Configure CSP, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, and frame restrictions compatible with the application.

- [ ] **Step 5: Fix legal documents**

Use a fixed `Last updated` date, `support@xesports.pro`, and wording that matches actual consent behavior. Terms links point to `/terms`.

- [ ] **Step 6: Verify GREEN**

Run: `npm test -- src/lib/privacy/consent.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/'(components)'/privacy src/lib/privacy next.config.ts src/app/'(site)'/privacy src/app/'(site)'/terms
 git commit -m "fix: gate analytics behind explicit consent"
```

### Task 10: Accessible Forms, Select, Crop Modal, and Motion

**Files:**
- Modify: `src/app/(components)/ui/FloatingLabelInput.tsx`
- Modify: `src/app/(components)/ui/FloatingLabelPhoneInput.tsx`
- Rewrite: `src/app/(components)/ui/FloatingLabelSelect.tsx`
- Modify: `src/app/(components)/ui/ImageCropperModal.tsx`
- Modify: `src/app/(utils)/motionPresets.ts`
- Test: `src/app/(components)/ui/FloatingLabelSelect.test.tsx`
- Test: `src/app/(components)/ui/ImageCropperModal.test.tsx`

**Interfaces:**
- Select uses native semantics and never clears a value merely because it opened.
- Modal traps focus, closes on Escape, restores focus, and has labelled controls.

- [ ] **Step 1: Write select regression test**

Render with a selected value, focus/open it, and assert the value remains unchanged until the user chooses another option.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/app/'(components)'/ui/FloatingLabelSelect.test.tsx`

Expected: FAIL under current clear-on-open behavior.

- [ ] **Step 3: Replace custom combobox with styled native select**

Preserve the component API where possible. Associate label, description, error, `aria-invalid`, and `aria-describedby`.

- [ ] **Step 4: Write modal interaction tests**

Assert `role="dialog"`, `aria-modal`, labelled close button, Escape handling, and focus restoration.

- [ ] **Step 5: Implement modal accessibility and reduced motion**

Use `useReducedMotion`/CSS media query to disable non-essential autoplay, pulse, and scale transitions.

- [ ] **Step 6: Verify GREEN**

Run: `npm test -- src/app/'(components)'/ui/*.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/'(components)'/ui src/app/'(utils)'/motionPresets.ts
 git commit -m "fix: make core controls keyboard accessible"
```

### Task 11: Asset Budget, CSS/Font Cleanup, and Dead-Code Removal

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/fonts.ts`
- Optimize: `public/images/byClient/bg_landing/option-3.*`
- Optimize: `public/images/byClient/community.*`
- Optimize: `public/images/events/*`
- Delete: unused `option-1.jpg.jpeg`, `option-2.jpg.jpeg`
- Delete: confirmed unused legacy components and `src/app/(types)/landing.ts`
- Create: `scripts/check-asset-budget.mjs`
- Modify: `package.json`

**Interfaces:**
- `npm run assets:check` fails when a raster image exceeds 2 MiB or total public assets exceed the documented budget.

- [ ] **Step 1: Write asset-budget test/script and verify RED**

Run: `npm run assets:check`

Expected: FAIL on current 5–9 MiB images.

- [ ] **Step 2: Optimize used images with Sharp**

Create AVIF/WebP versions sized to actual maximum rendering widths. Keep visual fallbacks only when required; delete unused landing alternatives.

- [ ] **Step 3: Remove duplicate font loading and CSS blocks**

Delete Google Fonts `@import`, retain `next/font`, fix duplicate `.card-focus-glow`, invalid `via-via-*` utilities, and split raw HSL tokens from generated color tokens.

- [ ] **Step 4: Remove confirmed dead modules**

Delete only files with zero imports after a repository-wide search. Do not remove potentially routed files.

- [ ] **Step 5: Verify GREEN**

Run: `npm run assets:check`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public src/app/globals.css src/app/fonts.ts scripts/check-asset-budget.mjs package.json package-lock.json
 git commit -m "perf: reduce assets and remove legacy code"
```

### Task 12: Documentation, Full Verification, and GitHub Delivery

**Files:**
- Rewrite: `README.md`
- Create: `.env.example`
- Create: `docs/architecture.md`
- Create: `docs/backend-security-contract.md`
- Create: `docs/release-checklist.md`
- Create: `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Documents deployment variables, auth boundary, upstream assumptions, consent, failure states, and backend obligations.

- [ ] **Step 1: Add smoke tests**

Cover homepage render, login form accessibility, protected profile redirect, missing tournament, and analytics absence before consent.

- [ ] **Step 2: Document backend obligations**

Explicitly require cryptographic token validation, ignored client user IDs, authoritative registration timing, one-time reset/verify tokens, server-side HTML sanitization, rate limiting, and audit logging. Mark these as backend work that the frontend cannot guarantee.

- [ ] **Step 3: Run complete fresh verification**

```bash
rm -rf node_modules .next
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run assets:check
```

Expected: all commands exit 0. Run Playwright smoke tests when browser installation is available; otherwise report that exact limitation without claiming E2E success.

- [ ] **Step 4: Review the complete diff**

Run:

```bash
git status -sb
git diff --check
git diff --stat main...HEAD
git log --oneline --decorate main..HEAD
```

- [ ] **Step 5: Commit documentation**

```bash
git add README.md .env.example docs tests/e2e
git commit -m "docs: document hardened ESAS architecture"
```

- [ ] **Step 6: Publish a draft pull request**

Push `agent/security-reliability-hardening` and open a draft PR to `main` titled `Harden ESAS security, data integrity, and delivery`. The PR body must state what changed, root causes, checks run, backend obligations, and any unverified external integration.
