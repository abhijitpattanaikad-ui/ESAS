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

test("featured tournaments expose their scroll collection as a labelled list", async () => {
  const source = await readFile("src/app/(components)/landing/FeaturedEvents.tsx", "utf8");
  assert.match(source, /<ul[^>]*aria-label="Featured tournaments"/);
  assert.match(source, /<li\s+key=/);
});

test("game and partner collections center incomplete desktop rows", async () => {
  const sources = await Promise.all([
    "FeaturedGames.tsx", "TrustedBy.tsx",
  ].map((name) => readFile(`src/app/(components)/landing/${name}`, "utf8")));
  for (const source of sources) {
    assert.match(source, /md:flex-wrap/);
    assert.match(source, /md:justify-center/);
  }
});

test("tournament discovery exposes labelled search, game, status, and reset controls", async () => {
  const source = await readFile("src/app/(components)/shared/TournamentList.tsx", "utf8");
  assert.match(source, /<label[^>]*htmlFor="tournament-search"/);
  assert.match(source, /id="tournament-game"/);
  assert.match(source, /id="tournament-status"/);
  assert.match(source, /Reset filters/);
  assert.match(source, /aria-live="polite"/);
});

test("tournament cards use shared glass and textual status primitives", async () => {
  const source = await readFile("src/app/(components)/shared/EventCard.tsx", "utf8");
  assert.match(source, /GlassCard/);
  assert.match(source, /StatusBadge/);
  assert.match(source, /View tournament/);
});
