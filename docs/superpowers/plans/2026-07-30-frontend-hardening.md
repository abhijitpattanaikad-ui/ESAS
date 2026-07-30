# Frontend Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the security, authentication-flow, tooling, resilience, and maintainability defects found in the `TEST` frontend.

**Architecture:** Security and API policy live in focused `src/lib` modules. UI components consume deterministic helpers, allowing behavior to be tested without a browser or live API. Backend-dependent session security remains an explicit integration contract.

**Tech Stack:** Next.js 15, React 19, TypeScript, DOMPurify, Vitest, Testing Library, ESLint 9.

## Global Constraints

- Preserve compatibility with the current bearer-token API.
- Do not place secrets in `NEXT_PUBLIC_*` variables.
- Do not render unsanitized API HTML.
- Do not redirect after failed reset requests unless the user chooses navigation.

---

### Task 1: Security utilities and tournament rendering

**Files:**
- Create: `src/lib/security/sanitizeHtml.ts`
- Create: `src/lib/security/safeUrl.ts`
- Test: `src/lib/security/security.test.ts`
- Modify: `src/app/(site)/tournaments/[id]/page.tsx`

- [ ] Write tests proving scripts, event handlers, unsafe protocols, and unsafe rules links are rejected.
- [ ] Run the tests and confirm they fail because the utilities do not exist.
- [ ] Implement strict sanitization and HTTPS URL validation.
- [ ] Use the utilities in the tournament page.
- [ ] Run tests and TypeScript.

### Task 2: Password and verification flows

**Files:**
- Create: `src/lib/auth/resetFlow.ts`
- Test: `src/lib/auth/resetFlow.test.ts`
- Modify: `src/app/reset/password/ResetPasswordInner.tsx`
- Modify: `src/app/(auth)/verify/email/VerifyMailInner.tsx`

- [ ] Write tests for success, expired-token, generic failure, and missing-token states.
- [ ] Confirm tests fail before implementation.
- [ ] Implement deterministic response mapping.
- [ ] Remove competing redirects, unreachable UI, and debug logs.
- [ ] Run tests and TypeScript.

### Task 3: Configuration and storage safety

**Files:**
- Create: `src/lib/api/config.ts`
- Create: `src/lib/auth/storage.ts`
- Test: `src/lib/api/config.test.ts`
- Modify: authentication and service modules using API URLs or logout.

- [ ] Write failing tests for normalized API URLs and targeted storage cleanup.
- [ ] Implement configuration and storage helpers.
- [ ] Replace hard-coded or possibly undefined API URLs.
- [ ] Replace `localStorage.clear()` calls.
- [ ] Run tests and TypeScript.

### Task 4: Quality gates

**Files:**
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `.github/workflows/ci.yml`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Align the Next ESLint configuration version.
- [ ] Add `lint`, `typecheck`, `test`, and `test:coverage` scripts.
- [ ] Run lint, TypeScript, tests, and the production build.
- [ ] Configure CI to run the same commands with `npm ci`.

### Task 5: Performance and documentation

**Files:**
- Modify: production files containing debug logging.
- Modify: `README.md`
- Create: `.env.example`

- [ ] Remove response/debug logging.
- [ ] Document environment variables, commands, architecture, and backend session requirements.
- [ ] Document image conversion targets and defer binary recompression to an asset-specific change.
- [ ] Run the complete quality gate.

