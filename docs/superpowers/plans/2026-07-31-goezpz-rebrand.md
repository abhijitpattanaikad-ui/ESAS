# GoEzPz Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the application's customer-facing XeSports/ESAS identity and logo with GoEzPz while preserving active backend identifiers, domains, support addresses, and social destinations.

**Architecture:** Keep the existing Next.js application structure and introduce no runtime branding abstraction. Replace copy and logo references at their current presentation boundaries, add canonical GoEzPz raster assets, and enforce the compatibility boundary with a source-level regression test.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Node test runner, Next Image, PNG assets

## Global Constraints

- The public brand name is `GoEzPz`, with that exact capitalization.
- Use `/Users/abhijitpattanaik/Downloads/New Go EzPz - Physical.png` as the canonical logo source.
- Preserve the logo's 372:250 aspect ratio and use `object-contain`; never crop, stretch, or force it into a square.
- Replace user-visible `XeSports`, `Xesports`, `ExSports`, and product-facing `ESAS`.
- Preserve `XESPORTS_API_URL`, `https://apis.xesports.pro`, API platform value `XESPORTS`, `X-Xesports-*` headers, `xesports_session`, `xesports_consent`, `support@xesports.pro`, current domains, and existing social URLs.
- PR #2 remains a draft.

---

### Task 1: Add Public-Brand Regression Protection

**Files:**
- Create: `src/test/branding-contract.test.mjs`

**Interfaces:**
- Consumes: repository-relative customer-facing source paths and preserved integration strings from the global constraints.
- Produces: a Node test that fails when deprecated public brand labels occur outside preserved external destinations.

- [ ] **Step 1: Write the failing branding contract**

Create `src/test/branding-contract.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const customerFacingFiles = [
  "README.md",
  "src/app/layout.tsx",
  "src/app/(auth)/layout.tsx",
  "src/app/(site)/tournaments/page.tsx",
  "src/app/(site)/tournaments/[id]/page.tsx",
  "src/app/(site)/partners/page.tsx",
  "src/app/(site)/privacy/page.tsx",
  "src/app/(site)/terms/page.tsx",
  "src/app/(components)/privacy/ConsentManager.tsx",
  "src/app/(components)/(layout)/ModernHeader.tsx",
  "src/app/(components)/(layout)/Footer.tsx",
];

const preservedExternalValues =
  /support@xesports\.pro|https?:\/\/[^\s"'`)]*xesports[^\s"'`)]*|XESPORTS_API_URL/gi;

test("customer-facing product surfaces use the GoEzPz brand", async () => {
  const failures = [];
  for (const file of customerFacingFiles) {
    const source = await readFile(file, "utf8");
    const publicCopy = source.replace(preservedExternalValues, "");
    if (/\b(?:XeSports|Xesports|ExSports|ESAS)\b/i.test(publicCopy)) failures.push(file);
  }
  assert.deepEqual(failures, []);
});
```

The existing `scripts/run-unit-tests.mjs` recursive discovery automatically includes this `.test.mjs` file; no runner modification is required.

- [ ] **Step 2: Run the branding test and verify RED**

Run:

```bash
node --test src/test/branding-contract.test.mjs
```

Expected: FAIL with the customer-facing files that still contain the old brand.

- [ ] **Step 3: Commit the failing contract**

```bash
git add src/test/branding-contract.test.mjs
git commit -m "test: define GoEzPz public brand contract"
```

### Task 2: Install the Canonical Logo and Rebrand Product Surfaces

**Files:**
- Create: `public/images/goezpz-logo.png`
- Create: `src/app/icon.png`
- Delete: `src/app/favicon.ico`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/(auth)/layout.tsx`
- Modify: `src/app/(site)/tournaments/page.tsx`
- Modify: `src/app/(site)/tournaments/[id]/page.tsx`
- Modify: `src/app/(site)/partners/page.tsx`
- Modify: `src/app/(site)/privacy/page.tsx`
- Modify: `src/app/(site)/terms/page.tsx`
- Modify: `src/app/(components)/privacy/ConsentManager.tsx`
- Modify: `src/app/(components)/(layout)/ModernHeader.tsx`
- Modify: `src/app/(components)/(layout)/Footer.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: the supplied 372×250 transparent PNG.
- Produces: `/images/goezpz-logo.png`, the App Router icon, and GoEzPz public copy/metadata.

- [ ] **Step 1: Install the logo assets**

Copy the supplied PNG byte-for-byte:

```bash
cp "/Users/abhijitpattanaik/Downloads/New Go EzPz - Physical.png" public/images/goezpz-logo.png
cp "/Users/abhijitpattanaik/Downloads/New Go EzPz - Physical.png" src/app/icon.png
git rm src/app/favicon.ico
```

Verify both copies preserve the source dimensions and alpha channel:

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha public/images/goezpz-logo.png src/app/icon.png
```

Expected for both: `pixelWidth: 372`, `pixelHeight: 250`, `hasAlpha: yes`.

- [ ] **Step 2: Replace metadata and product copy**

Apply these exact public-name outcomes:

```text
Global title: GoEzPz — The Future of Play
Global title template: %s | GoEzPz
Authentication title: GoEzPz — Login
Fallback tournament title: Tournament | GoEzPz
Privacy title: Privacy Policy | GoEzPz
Terms title: Terms & Conditions | GoEzPz
```

Replace old brand labels in public descriptions, consent copy, privacy/terms organizer references, footer copyright, social accessibility labels, and current README product descriptions with `GoEzPz`. Preserve every integration string listed in Global Constraints.

- [ ] **Step 3: Replace every product logo placement**

Use `/images/goezpz-logo.png` with `alt="GoEzPz"` and `object-contain`.

Required sizing behavior:

```tsx
// Modern header
<Image
  src="/images/goezpz-logo.png"
  alt="GoEzPz"
  width={96}
  height={65}
  className="h-11 w-auto object-contain"
/>

// Authentication layout
<img
  src="/images/goezpz-logo.png"
  alt="GoEzPz"
  className="h-16 w-auto object-contain"
/>
```

In both footer logo locations, use an intrinsic `372 × 250` image with responsive `h-auto w-28 object-contain` or the closest existing-layout equivalent. Change the home-link accessible name to `GoEzPz home`.

- [ ] **Step 4: Run the branding contract and verify GREEN**

Run:

```bash
node --test src/test/branding-contract.test.mjs
node scripts/check-static-assets.mjs
node scripts/check-asset-budget.mjs
```

Expected: all commands pass and no customer-facing file is reported.

- [ ] **Step 5: Search for missed branding**

Run:

```bash
rg -n -i "xesports|xe sports|exsports|\\bESAS\\b|exLogo" README.md src public \
  --glob '!src/test/branding-contract.test.mjs'
```

Inspect every remaining result. It must be one of the preserved technical identifiers, support/domain/social destinations, or an internal icon/component name. Fix all other occurrences.

- [ ] **Step 6: Commit the rebrand**

```bash
git add README.md public/images/goezpz-logo.png src/app
git commit -m "Rebrand public experience as GoEzPz"
```

### Task 3: Validate and Publish PR #2

**Files:**
- Modify only if validation reveals a rebrand defect.

**Interfaces:**
- Consumes: Tasks 1–2.
- Produces: a green PR #2 branch and an updated private live preview.

- [ ] **Step 1: Run the full application gate**

Run:

```bash
npm run check
```

Expected: lint, TypeScript, all tests, syntax/import checks, source-safety checks, asset checks, and the production build pass.

- [ ] **Step 2: Inspect the final branch diff**

Run:

```bash
git diff --check
git status --short
git log --oneline -3
```

Expected: no whitespace errors, no generated artifacts staged, and only intentional commits.

- [ ] **Step 3: Push PR #2 and wait for CI**

```bash
git push origin agent/security-reliability-hardening
gh pr checks 2 --repo abhijitpattanaikad-ui/ESAS --watch --interval 5
```

Expected: GitHub's `quality` workflow passes.

- [ ] **Step 4: Rebuild the private preview from the updated PR branch**

Apply the existing preview-hosting adapter commits to a temporary preview branch based on the updated PR head, then run:

```bash
npm run check
opennextjs-cloudflare build --skipNextBuild
node scripts/prepare-sites-dist.mjs
node scripts/verify-sites-dist.mjs
```

Expected: the application gate and bundled deployment-artifact verification pass.

- [ ] **Step 5: Deploy and verify the live site**

Save and privately deploy the validated site version through Sites. Open:

```text
https://esas-pr2-preview.abhijit-pattanaik-ad.chatgpt.site
```

Verify the rendered page title is `GoEzPz — The Future of Play`, the header logo is visible and uncropped, the landing content loads, and recent worker logs contain no request exception from the verification request.

- [ ] **Step 6: Report completion**

Return the PR link, live preview link, CI result, test/build result, and the explicit note that backend identifiers and external destinations remain unchanged by design.
