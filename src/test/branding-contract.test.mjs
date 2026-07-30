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
