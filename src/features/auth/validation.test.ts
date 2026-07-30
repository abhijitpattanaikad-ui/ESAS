import assert from "node:assert/strict";
import test from "node:test";
import { TERMS_VERSION, normalizePhoneNumber, validateSignup } from "./validation";

test("normalizes UAE and India numbers to E.164-like values", () => {
  assert.equal(normalizePhoneNumber("+971", "050 123 4567"), "+971501234567");
  assert.equal(normalizePhoneNumber("+91", "98765-43210"), "+919876543210");
});

test("rejects implausibly short international numbers", () => {
  assert.equal(normalizePhoneNumber("+971", "123"), null);
});

test("signup validation records fixed terms evidence", () => {
  const result = validateSignup({
    email: "player@example.com",
    username: "Player_1",
    countryCode: "+971",
    phoneNumber: "050 123 4567",
    password: "strongpass1",
    confirmPassword: "strongpass1",
    acceptTerms: true,
  }, new Date("2026-07-29T10:00:00.000Z"));
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.phone, "+971501234567");
    assert.equal(result.value.termsVersion, TERMS_VERSION);
    assert.equal(result.value.termsAcceptedAt, "2026-07-29T10:00:00.000Z");
  }
});

test("signup rejects mismatched passwords and missing consent", () => {
  const result = validateSignup({
    email: "player@example.com",
    username: "Player_1",
    countryCode: "+971",
    phoneNumber: "501234567",
    password: "strongpass1",
    confirmPassword: "different1",
    acceptTerms: false,
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.confirmPassword, "Passwords do not match");
    assert.equal(result.errors.terms, "You must accept the Terms and Privacy Policy");
  }
});
