# xEsports Web

Next.js frontend for xEsports tournament discovery, registration, brackets, authentication, and player profiles.

## Requirements

- Node.js 20, 22, or 24
- npm 10 or newer
- Access to the xEsports API

## Setup

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Public base URL of the xEsports API |
| `NEXT_PUBLIC_DISCORD_LINK` | Public community link |
| `NEXT_PUBLIC_MOCK_AUTH` | Local-only mock login; must remain `false` in deployed environments |

Variables prefixed with `NEXT_PUBLIC_` are visible in the browser and must never contain credentials or secrets.

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run test:coverage
npm run build
```

GitHub Actions runs linting, TypeScript, unit tests, and the production build for pull requests and pushes to `TEST`.

## Security model

- Tournament descriptions and rules are sanitized before being inserted as rich HTML.
- External rules documents accept HTTPS URLs only.
- Security headers are configured in `next.config.ts`.
- Logout removes only xEsports-owned storage keys.

### Required backend migration

The current API returns bearer tokens that the legacy frontend stores in `localStorage`. This remains vulnerable to token theft from any successful script injection. Production authentication should be migrated in the API and frontend together:

1. Issue the session in an `HttpOnly; Secure; SameSite=Lax` cookie.
2. Derive user identity from the validated session rather than a client-provided `userId`.
3. Require authorization on every protected API operation.
4. Add CSRF protection to state-changing cookie-authenticated requests.
5. Rotate and revoke sessions on password reset and logout.
6. Update browser requests to use `credentials: "include"` and remove bearer-token storage.

Do not switch the frontend alone: doing so before the API supports cookie sessions would break login, profile, and tournament operations.

## Project structure

```text
src/app/                 Next.js routes, components, services, and domain types
src/lib/api/             API configuration and shared request policy
src/lib/auth/            Authentication flow and storage helpers
src/lib/security/        Rich-HTML and external-URL sanitization
public/                  Static media assets
docs/superpowers/        Approved designs and implementation plans
```

## Asset policy

Several legacy backgrounds exceed 5 MB. New or replaced media should:

- use AVIF or WebP;
- include mobile and desktop dimensions;
- target 200–500 KB for full-width backgrounds;
- use `next/image` for content images;
- avoid preloading below-the-fold media.

Large legacy image conversion should be reviewed visually in a separate asset-only pull request so compression does not silently degrade the brand artwork.

## Deployment

Before release, confirm:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Set `NEXT_PUBLIC_MOCK_AUTH=false`, configure the real API URL, verify CSP behavior against the deployed domains, and smoke-test login, reset, profile, tournament join/leave, and bracket rendering.
