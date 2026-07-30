# Frontend Hardening Design

## Goal

Make the `TEST` frontend safe and production-ready without depending on unimplemented backend behavior.

## Scope

This repository will sanitize API-provided rich text, repair password-reset and email-verification behavior, centralize public configuration, improve error handling, add lint/test/CI quality gates, remove unsafe storage clearing and debug output, and document the remaining backend work.

The frontend will remain compatible with the current bearer-token API during this change. Moving authentication to HttpOnly cookies, validating sessions server-side, adding CSRF protection, and deriving user identity from the session require coordinated changes in the API repository and are therefore documented but not silently simulated here.

## Architecture

- `src/lib/security/` owns HTML and external-URL sanitization.
- `src/lib/api/` owns validated environment configuration and reusable API errors.
- Authentication pages convert network responses into explicit UI states; redirects occur only after successful operations or deliberate user actions.
- Service modules return existing domain data while distinguishing upstream failure from legitimate empty results where their consumers support it.
- Vitest covers pure security and flow-state behavior. ESLint, TypeScript, tests, and the Next production build run in GitHub Actions.

## Security Rules

- Rich HTML is sanitized through DOMPurify with an explicit tag and attribute allowlist.
- External rules links must parse as HTTPS URLs.
- Logout removes only keys owned by xEsports.
- Browser-visible tokens remain a temporary compatibility mechanism and are clearly documented as backend migration debt.
- Production logs do not print tokens or complete API responses.

## Acceptance Criteria

- Malicious scripts, inline event handlers, unsafe links, iframes, and forms are removed from tournament content.
- Missing reset tokens render a recoverable screen instead of an endless spinner.
- Failed reset requests do not schedule competing redirects.
- ESLint has a valid flat configuration and a package script.
- Unit tests, TypeScript, ESLint, and the production build pass.
- CI enforces all four checks on pull requests.
- Backend-dependent security work is listed in the README with explicit API requirements.

