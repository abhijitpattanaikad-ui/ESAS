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
