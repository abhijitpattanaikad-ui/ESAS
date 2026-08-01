# GoEzPz Rebrand Design

## Goal

Replace the application's customer-facing XeSports/ESAS identity with GoEzPz and use the supplied GoEzPz artwork consistently across the product. Preserve operational integrations until confirmed GoEzPz replacements exist.

## Brand Rules

- The public brand name is `GoEzPz`, with that exact capitalization.
- Use the supplied transparent PNG as the canonical logo asset.
- Preserve the logo's wide 372:250 aspect ratio. Header, authentication, and footer placements must use placement-specific dimensions with `object-contain`; they must not crop, stretch, or force the logo into a square.
- User-visible instances of `XeSports`, `Xesports`, `ExSports`, and product-facing `ESAS` become `GoEzPz`.
- Page titles, descriptions, accessible names, alternative text, consent text, copyright text, README product descriptions, and legal-facing brand references follow the new name.

## Compatibility Boundary

The following values remain unchanged because they are active operational contracts or external destinations:

- `XESPORTS_API_URL` and `https://apis.xesports.pro`
- API platform value `XESPORTS`
- `X-Xesports-*` request headers
- `xesports_session` and `xesports_consent` cookie names
- `support@xesports.pro`
- Current `xesports.pro` domains and existing social-media URLs

These preserved values must not appear as visible brand labels except where an unchanged email address or URL is necessarily shown to the user. They can be renamed in a later migration after valid replacements are supplied and coordinated with the backend.

## Logo Surfaces

The canonical logo asset will replace `/public/images/exLogo.png` usage in:

- the modern public header;
- authentication pages;
- both desktop and mobile footer layouts; and
- favicon/application icon surfaces where a PNG is supported.

The header and footer layout may receive narrowly scoped sizing adjustments so the wider logo remains legible without changing navigation behavior.

## Content Surfaces

The rebrand covers:

- global and route-specific metadata;
- authentication metadata;
- navigation and home-link accessibility labels;
- cookie-consent copy;
- privacy and terms brand references;
- footer copyright and social accessibility labels;
- public README/product documentation that describes the application;
- logo alternative text.

Historical implementation plans and technical contract documentation retain operational identifiers when they describe actual backend behavior. Historical prose may retain its original context unless it is presented as current product branding.

## Validation

Add a branding regression test that scans customer-facing source surfaces and fails if deprecated public brand labels return. The test will explicitly allow operational identifiers and unchanged external destinations listed in the compatibility boundary.

The final change must pass:

- lint;
- TypeScript checking;
- all unit and contract tests;
- source-safety checks;
- static-asset and asset-budget checks;
- the production Next.js build; and
- the existing private-preview deployment build.

## Delivery

Implement the rebrand on PR #2's branch, push the validated commit, wait for GitHub Actions, and republish the private GoEzPz preview at the existing preview URL. PR #2 remains a draft until the previously documented backend and dependency obligations are resolved.
