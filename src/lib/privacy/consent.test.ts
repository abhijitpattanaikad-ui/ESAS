import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_CONSENT,
  isSensitiveRoute,
  parseConsent,
  serializeConsent,
  shouldLoadAnalytics,
} from "./consent";

test("analytics is opt-in", () => {
  assert.deepEqual(DEFAULT_CONSENT, { necessary: true, analytics: false, version: 1 });
  assert.deepEqual(parseConsent(null), DEFAULT_CONSENT);
  assert.deepEqual(parseConsent("broken"), DEFAULT_CONSENT);
  assert.equal(parseConsent('{"necessary":true,"analytics":true,"version":1}').analytics, true);
});

test("consent preferences round-trip through the cookie format", () => {
  const encoded = serializeConsent({ necessary: true, analytics: true, version: 1 });
  assert.deepEqual(parseConsent(encoded), { necessary: true, analytics: true, version: 1 });
});

test("sensitive credential routes are excluded from analytics initialization", () => {
  assert.equal(isSensitiveRoute("/reset/password?token=secret"), true);
  assert.equal(isSensitiveRoute("/verify/email?token=secret"), true);
  assert.equal(isSensitiveRoute("/login"), true);
  assert.equal(isSensitiveRoute("/signup"), true);
  assert.equal(isSensitiveRoute("/tournaments/abc"), false);
});

test("analytics requires consent, a configured tag, and a non-sensitive route", () => {
  const enabled = { necessary: true as const, analytics: true, version: 1 as const };
  assert.equal(shouldLoadAnalytics(enabled, "/tournaments/abc", "GTM-ABC123"), true);
  assert.equal(shouldLoadAnalytics(enabled, "/reset/password", "GTM-ABC123"), false);
  assert.equal(shouldLoadAnalytics(DEFAULT_CONSENT, "/tournaments/abc", "GTM-ABC123"), false);
  assert.equal(shouldLoadAnalytics(enabled, "/tournaments/abc", undefined), false);
});
