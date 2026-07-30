import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile(new URL("../../package.json", import.meta.url), "utf8"));
const packageLock = JSON.parse(await readFile(new URL("../../package-lock.json", import.meta.url), "utf8"));

test("toolchain uses exact framework versions and a complete quality gate", () => {
  assert.equal(packageJson.dependencies.next, "15.5.9");
  assert.equal(packageJson.devDependencies["eslint-config-next"], undefined);
  assert.equal(
    packageJson.scripts.check,
    "npm run lint && npm run typecheck && npm run test && npm run syntax:check && npm run source:check && npm run assets:check && npm run build",
  );
});

test("asset checks include budget and broken-reference validation", () => {
  assert.equal(
    packageJson.scripts["assets:check"],
    "node scripts/check-asset-budget.mjs && node scripts/check-static-assets.mjs",
  );
});

test("production dependencies do not include axios", () => {
  assert.equal(packageJson.dependencies.axios, undefined);
});


test("exact dependency declarations match installed lockfile versions", () => {
  for (const section of ["dependencies", "devDependencies"]) {
    for (const [name, declaredVersion] of Object.entries(packageJson[section] ?? {})) {
      assert.equal(
        packageLock.packages[`node_modules/${name}`]?.version,
        declaredVersion,
        `${name} must match package-lock.json`,
      );
    }
  }
});
