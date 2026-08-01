import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("homepage follows the approved public journey", async () => {
  const source = await readFile("src/app/(components)/landing/Landing.tsx", "utf8");
  const names = ["HeroSection", "FeaturedEvents", "CoreFeatures", "FeaturedGames", "TrustedBy", "Advantages"];
  const positions = names.map((name) => source.indexOf(`<${name}`));
  assert.ok(positions.every((value) => value >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("homepage sections preserve truthful availability messaging", async () => {
  const sources = await Promise.all([
    "FeaturedEvents.tsx", "FeaturedGames.tsx", "TrustedBy.tsx",
  ].map((name) => readFile(`src/app/(components)/landing/${name}`, "utf8")));
  for (const source of sources) {
    assert.match(source, /availability === "error"/);
    assert.match(source, /length === 0/);
  }
});
