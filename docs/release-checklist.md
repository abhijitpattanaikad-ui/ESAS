# Release Checklist

## Automated gate

- [ ] `npm ci` succeeds from a clean checkout.
- [ ] `npm run check` exits with code 0.
- [ ] GitHub Actions is green for the exact release commit.
- [ ] No high or critical production dependency vulnerability is accepted without a documented owner and mitigation.

## Environment

- [ ] `XESPORTS_API_URL` points to the intended HTTPS environment.
- [ ] `NEXT_PUBLIC_GTM_ID` is blank unless analytics has been approved.
- [ ] `NEXT_PUBLIC_DISCORD_LINK` uses an approved HTTPS destination.
- [ ] No development or mock-authentication flags exist in production.

## Authentication

- [ ] Login creates an `HttpOnly`, `Secure`, `SameSite=Lax` cookie.
- [ ] Logout invalidates the browser session and, where supported, the upstream session.
- [ ] Protected pages redirect unauthenticated users.
- [ ] Password reset and email verification remove tokens from the browser URL.
- [ ] Cross-origin mutation attempts return HTTP 403.
- [ ] Login, signup, reset, and verification are rate-limited upstream.

## Tournament integrity

- [ ] API outage is visibly different from an empty tournament list.
- [ ] Unknown tournament states do not display as “Upcoming.”
- [ ] Join/leave derives identity from the server session.
- [ ] Registration dates and eligibility are enforced upstream.
- [ ] Bracket outage never displays fixture data.
- [ ] Bracket winner, score, and progression match the authoritative backend.

## Privacy and security

- [ ] Analytics does not load before explicit consent.
- [ ] Analytics does not load on credential routes.
- [ ] Terms and Privacy versions match the backend acceptance record.
- [ ] CSP and other security headers are present in production responses.
- [ ] Tournament-authored content cannot execute HTML or JavaScript.
- [ ] Image uploads reject invalid type and oversized payloads and are re-encoded upstream.

## UX and accessibility

- [ ] Core flows work using keyboard only.
- [ ] Focus remains trapped in the crop dialog and returns to the trigger.
- [ ] Form errors are announced and associated with their fields.
- [ ] Reduced-motion preference stops automatic motion.
- [ ] Mobile layouts are verified at 320 px, 375 px, 768 px, and 1024 px widths.

## Performance and observability

- [ ] Static assets remain within the enforced budget.
- [ ] Largest-contentful-paint imagery is appropriately sized and optimized.
- [ ] Production error monitoring and correlation IDs are configured.
- [ ] Authentication, API failure, and join/leave error rates have alerts.
