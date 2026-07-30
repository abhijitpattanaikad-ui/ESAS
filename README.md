# ESAS — XeSports Web Platform

ESAS is the Next.js web application for XeSports tournament discovery, registration, brackets, account management, partner discovery, and public marketing pages.

This repository was rebuilt from the supplied XeSports source with a production-safety focus. The application now treats the upstream API as authoritative: it never substitutes mock tournament or bracket results when a request fails.

## Architecture

```text
Browser
  │
  ├─ Public pages rendered by Next.js Server Components
  ├─ Client islands for forms, countdowns, menus, consent, and bracket interaction
  │
  ▼
Next.js same-origin API routes (BFF)
  ├─ HttpOnly session cookie
  ├─ exact-origin checks for every mutation
  ├─ request validation and normalized errors
  └─ server-only upstream credentials
  │
  ▼
XeSports upstream API
```

Security-critical identity is derived from the validated upstream bearer token. Browser code does not store bearer tokens or submit a user ID for authorization.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- Access to the configured XeSports upstream API

## Local setup

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Open `http://localhost:3000`.

Environment variables:

| Variable | Visibility | Required | Purpose |
|---|---|---:|---|
| `XESPORTS_API_URL` | Server only | Production | Upstream API origin. Production values must use HTTPS. |
| `NEXT_PUBLIC_GTM_ID` | Browser | No | Google Tag Manager container. It remains inactive until analytics consent. |
| `NEXT_PUBLIC_DISCORD_LINK` | Browser | No | Landing-page community CTA. |

Never prefix secrets or upstream credentials with `NEXT_PUBLIC_`.

## Quality gate

```bash
npm run check
```

The gate runs:

1. ESLint, including React, hooks, Next.js, and accessibility rules.
2. Semantic TypeScript checking.
3. Dependency-minimal behavior and security regression tests.
4. TypeScript syntax and local-import validation.
5. Source checks for token storage, mock authentication, unsafe HTML, and fabricated bracket fallback.
6. Static-asset budget enforcement.
7. A production Next.js build.

GitHub Actions runs the same gate for pull requests and pushes to `main`.

Useful individual commands:

```bash
npm test
npm run lint
npm run typecheck
npm run syntax:check
npm run source:check
npm run assets:check
npm run build
```

## Security model

- The upstream bearer token is stored only in a `Secure`, `HttpOnly`, `SameSite=Lax` cookie outside development.
- All state-changing same-origin API routes reject requests with a missing or mismatched `Origin` header.
- Tournament descriptions and rules are rendered as safe text rather than executable API HTML.
- Non-essential analytics is opt-in and excluded from credential routes.
- Security headers include CSP, frame denial, referrer restrictions, MIME sniffing protection, and a restrictive permissions policy.
- Password-reset and verification tokens are removed from the visible URL immediately after capture.

See [SECURITY.md](SECURITY.md) and [docs/backend-contracts.md](docs/backend-contracts.md).

## Product boundaries

The current MVP includes:

- Public tournament and partner pages
- Tournament details, participants, safe rules/description content, join/leave, and brackets
- Signup, login, logout, email verification, password reset, and profile management
- Consent-controlled analytics

The following are intentionally excluded until their backend contracts and UX are confirmed:

- Fake/demo bracket fallback in production
- Unimplemented prize and standings tabs
- Profile game-library management
- Browser-managed authorization state

## Deployment

1. Configure the environment variables in the deployment platform.
2. Run `npm ci` and `npm run check` in CI.
3. Confirm the upstream API accepts the deployed application origin and required request shapes.
4. Verify cookie behavior over HTTPS.
5. Complete the manual release checklist in [docs/release-checklist.md](docs/release-checklist.md).

Do not deploy by bypassing a failing quality gate. A visually functioning page is not evidence that authentication, tournament state, or bracket data is correct.
