import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  sections: "src/app/(components)/(layout)/ProfileSections.tsx",
  header: "src/app/(components)/(layout)/ProfileHeader.tsx",
  page: "src/app/(site)/profile/ProfilePageClient.tsx",
  footer: "src/app/(components)/(layout)/Footer.tsx",
  roundRobin: "src/app/(components)/shared/brackets/RoundRobin.tsx",
  single: "src/app/(components)/shared/brackets/SingleElimination.tsx",
};

async function source(path) {
  return readFile(path, "utf8");
}

test("profile UI never fabricates identity, verification, or country data", async () => {
  const combined = `${await source(files.sections)}\n${await source(files.header)}`;
  for (const forbidden of ["Super Sanchez", "super.sanchez", "Toronto", "Canada", 'countryCode: "+1"', "const isEmailVerified = true"]) {
    assert.equal(combined.includes(forbidden), false, `found fabricated profile value: ${forbidden}`);
  }
  assert.match(await source(files.sections), /readOnly/);
});

test("unfinished game management is absent from the profile MVP", async () => {
  const sections = await source(files.sections);
  assert.equal(sections.includes("Add Game"), false);
  assert.equal(sections.includes("GAMES_DATA"), false);
});

test("profile, footer, and bracket views contain no explicit any escapes", async () => {
  const combined = await Promise.all(Object.values(files).map(source));
  assert.equal(combined.join("\n").includes("any" + ">"), false);
  assert.equal(combined.join("\n").includes("as " + "any"), false);
  assert.equal(combined.join("\n").includes(":" + " any"), false);
});
