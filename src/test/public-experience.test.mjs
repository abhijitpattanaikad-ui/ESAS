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

test("tournament list projection requests card platform and format metadata", async () => {
  const source = await readFile("src/features/tournaments/api.ts", "utf8");
  const projection = source.match(/const PROJECT_FIELDS = "([^"]+)"/)?.[1]?.split(/\s+/) ?? [];
  assert.ok(projection.includes("platform"));
  assert.ok(projection.includes("format"));
});

test("tournament detail preserves mutation flow in an accessible glass layout", async () => {
  const source = await readFile("src/app/(site)/tournaments/[id]/TournamentDetailClient.tsx", "utf8");
  assert.match(source, /role="tablist"/);
  assert.match(source, /role="tab"/);
  assert.match(source, /aria-selected=/);
  assert.match(source, /aria-busy=/);
  assert.match(source, /overflow-x-auto/);
  assert.match(source, /GlassCard/);
  assert.match(source, /clientJson/);
});

test("tournament detail keeps its primary action before tab content on mobile", async () => {
  const source = await readFile("src/app/(site)/tournaments/[id]/TournamentDetailClient.tsx", "utf8");
  const summaryPosition = source.indexOf('<aside aria-label="Tournament summary"');
  const tablistPosition = source.indexOf('role="tablist"');
  assert.ok(summaryPosition >= 0 && summaryPosition < tablistPosition);
  assert.match(source, /lg:col-start-2 lg:row-start-1 lg:sticky/);
  assert.match(source, /lg:col-start-1 lg:row-start-1/);
});

test("tournament detail distinguishes omitted participant data from an empty list", async () => {
  const source = await readFile("src/app/(site)/tournaments/[id]/TournamentDetailClient.tsx", "utf8");
  assert.match(source, /Listed players/);
  assert.match(source, /tournament\.participatedPlayers \? tournament\.participatedPlayers\.length : "Not listed"/);
  assert.doesNotMatch(source, /participatedPlayers\?\.length \?\? 0/);
});

test("partners and footer use the public glass system without changing destinations", async () => {
  const partners = await readFile("src/app/(site)/partners/page.tsx", "utf8");
  const footer = await readFile("src/app/(components)/(layout)/Footer.tsx", "utf8");
  assert.match(partners, /GlassCard/);
  assert.match(partners, /role="alert"/);
  assert.match(footer, /GlassCard|surface-glass/);
  assert.match(footer, /support@xesports\.pro/);
  assert.match(footer, /Visit GoEzPz on/);
});
