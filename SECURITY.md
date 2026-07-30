# Security Policy

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public GitHub issue.

Send a concise report to `support@xesports.pro` containing:

- The affected route or component
- Reproduction steps
- Expected and observed behavior
- Security impact
- Screenshots or a minimal proof of concept, where safe

Do not include real user credentials, session cookies, reset tokens, or personal data.

## Security boundaries

The Next.js application is a browser-facing BFF. It does not replace upstream authorization. The upstream API must:

- Validate every bearer token cryptographically
- Derive the authenticated user from that validated token
- Ignore client-supplied user identity for authorization
- Enforce tournament eligibility, capacity, registration dates, and join/leave rules
- Treat reset and verification tokens as short-lived, one-time credentials
- Rate-limit login, signup, password reset, verification, image upload, and tournament mutations
- Validate and sanitize all persisted user and tournament content
- Record the accepted legal-document version and timestamp server-side

## Implemented application controls

- `HttpOnly`, `Secure` production session cookie
- Exact-origin mutation checks
- Non-enumerating forgot-password responses
- Server-side profile update allowlist
- No bearer token in browser storage
- Safe text rendering for API-authored rich content
- Consent-gated analytics
- Credential-route analytics exclusion
- CSP and defensive response headers
- Image type and size checks
- Explicit API error states rather than fabricated data
- Automated source-safety and regression tests

## Secret handling

- Store secrets only in the deployment platform or an approved secrets manager.
- Never commit `.env.local` or production credentials.
- Never expose credentials through `NEXT_PUBLIC_*` variables.
- Rotate a credential immediately if it appears in Git history, logs, screenshots, or an issue.
