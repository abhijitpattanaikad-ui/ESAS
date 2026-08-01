import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  extractStaticAssetReferences,
  findMissingStaticAssets,
} from "../../scripts/static-assets-lib.mjs";

test("extracts literal image references from TypeScript and CSS", () => {
  const source = `
    const image = "/images/hero.webp";
    .hero { background-image: url('/images/background image.webp'); }
    const remote = "https://cdn.example.com/images/ignore.webp";
  `;

  assert.deepEqual(extractStaticAssetReferences(source), [
    "/images/background image.webp",
    "/images/hero.webp",
  ]);
});

test("extracts literal local video references from TypeScript", () => {
  const source = `
    const video = "/videos/goezpz-hero.mp4";
    const remote = "https://cdn.example.com/videos/ignore.mp4";
  `;

  assert.deepEqual(extractStaticAssetReferences(source), [
    "/videos/goezpz-hero.mp4",
  ]);
});

test("reports only literal public asset references whose files are missing", async () => {
  const root = await mkdtemp(join(tmpdir(), "esas-static-assets-"));
  const sourceRoot = join(root, "src");
  const publicRoot = join(root, "public");

  try {
    await mkdir(join(sourceRoot, "components"), { recursive: true });
    await mkdir(join(publicRoot, "images"), { recursive: true });
    await writeFile(join(publicRoot, "images", "present.webp"), "asset");
    await writeFile(
      join(sourceRoot, "components", "Hero.tsx"),
      `const present = "/images/present.webp"; const missing = "/images/missing.webp";`,
    );

    assert.deepEqual(
      await findMissingStaticAssets({ sourceRoots: [sourceRoot], publicRoot }),
      [{ reference: "/images/missing.webp", source: "src/components/Hero.tsx" }],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});


test("ignores synthetic asset references inside test fixtures", async () => {
  const root = await mkdtemp(join(tmpdir(), "esas-static-assets-tests-"));
  const sourceRoot = join(root, "src");
  const publicRoot = join(root, "public");

  try {
    await mkdir(sourceRoot, { recursive: true });
    await mkdir(publicRoot, { recursive: true });
    await writeFile(
      join(sourceRoot, "Hero.test.mjs"),
      `const missingFixture = "/images/not-a-production-asset.webp";`,
    );

    assert.deepEqual(
      await findMissingStaticAssets({ sourceRoots: [sourceRoot], publicRoot }),
      [],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
