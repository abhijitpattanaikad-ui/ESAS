import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const selectSource = await readFile("src/app/(components)/ui/FloatingLabelSelect.tsx", "utf8");
const phoneSource = await readFile("src/app/(components)/ui/FloatingLabelPhoneInput.tsx", "utf8");
const cropperSource = await readFile("src/app/(components)/ui/ImageCropperModal.tsx", "utf8");

test("select controls use native semantics and never clear on open", () => {
  assert.match(selectSource, /<select/);
  assert.doesNotMatch(selectSource, /Clear the selected value when opening/);
  assert.doesNotMatch(selectSource, /role="combobox"/);
});

test("phone country control uses a labelled native select without remote flag images", () => {
  assert.match(phoneSource, /<select/);
  assert.match(phoneSource, /aria-label="Country calling code"/);
  assert.doesNotMatch(phoneSource, /flagcdn\.com/);
});

test("cropper is an accessible modal dialog", () => {
  assert.match(cropperSource, /role="dialog"/);
  assert.match(cropperSource, /aria-modal="true"/);
  assert.match(cropperSource, /aria-labelledby=/);
  assert.match(cropperSource, /aria-label="Close image editor"/);
});

const featuredGamesSource = await readFile("src/app/(components)/landing/FeaturedGames.tsx", "utf8");
const trustedBySource = await readFile("src/app/(components)/landing/TrustedBy.tsx", "utf8");
const globalCss = await readFile("src/app/globals.css", "utf8");

test("automatic motion respects the operating-system reduced-motion preference", () => {
  assert.match(featuredGamesSource, /useReducedMotion/);
  assert.match(trustedBySource, /useReducedMotion/);
  assert.match(globalCss, /@media \(prefers-reduced-motion: reduce\)/);
});
