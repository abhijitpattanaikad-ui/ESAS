import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("shadcn-compatible aliases point to the src component and utility roots", async () => {
  const config = JSON.parse(await readFile("components.json", "utf8"));
  assert.equal(config.aliases.components, "@/components");
  assert.equal(config.aliases.ui, "@/components/ui");
  assert.equal(config.aliases.utils, "@/lib/utils");
});

test("public primitives use semantic orange glass tokens and visible focus", async () => {
  const css = await readFile("src/app/globals.css", "utf8");
  const files = await Promise.all([
    "button.tsx", "glass-card.tsx", "status-badge.tsx", "section-heading.tsx",
  ].map((name) => readFile(`src/components/ui/${name}`, "utf8")));
  assert.match(css, /--surface-glass:/);
  assert.match(css, /--brand-primary:/);
  assert.match(files.join("\n"), /focus-visible/);
});

test("tailwind-merge is an exact production dependency", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8"));
  assert.match(pkg.dependencies["tailwind-merge"], /^\d+\.\d+\.\d+$/);
});

test("platform hero uses approved copy, local media, and tournament CTA", async () => {
  const hero = await readFile("src/app/(components)/landing/HeroSection.tsx", "utf8");
  assert.match(hero, /Your arena\. Your legacy\./);
  assert.match(hero, /Discover tournaments, compete with confidence, and make every match count\./);
  assert.match(hero, /href="\/tournaments"/);
  assert.match(hero, /goezpz-hero-poster\.webp/);
  assert.doesNotMatch(hero, /https?:\/\//);
});

test("animated banner defers video until hydration and supports reduced motion and poster fallback", async () => {
  const banner = await readFile("src/components/ui/animated-banner.tsx", "utf8");
  assert.match(banner, /useReducedMotion/);
  assert.match(banner, /const \[mediaMounted, setMediaMounted\] = useState\(false\)/);
  assert.match(banner, /setMediaMounted\(true\)/);
  assert.match(banner, /const showVideo = mediaMounted &&/);
  assert.match(banner, /onError/);
  assert.match(banner, /posterSrc/);
  assert.match(banner, /next\/link/);
});

test("public navigation exposes labelled mobile controls", async () => {
  const header = await readFile("src/app/(components)/(layout)/ModernHeader.tsx", "utf8");
  assert.match(header, /aria-label=\{navigationOpen \? "Close navigation" : "Open navigation"\}/);
  assert.match(header, /aria-expanded=/);
  assert.match(header, /Tournaments/);
  assert.match(header, /Partners/);
});

test("public navigation preserves the login destination for Let's Play actions", async () => {
  const header = await readFile("src/app/(components)/(layout)/ModernHeader.tsx", "utf8");
  const letsPlayLinks = header.match(
    /<Link(?:(?!<\/Link>)[\s\S])*?href="\/login"(?:(?!<\/Link>)[\s\S])*?Let&apos;s Play(?:(?!<\/Link>)[\s\S])*?<\/Link>/g,
  ) ?? [];
  assert.equal(letsPlayLinks.length, 2);
});

test("signed-in navigation renders one profile controller", async () => {
  const header = await readFile("src/app/(components)/(layout)/ModernHeader.tsx", "utf8");
  assert.equal((header.match(/<ModernProfileButton \/>/g) ?? []).length, 1);
});
