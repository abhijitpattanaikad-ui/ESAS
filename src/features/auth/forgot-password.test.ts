import assert from "node:assert/strict";
import test from "node:test";
import { GENERIC_RESET_MESSAGE, normalizeForgotPasswordResponse } from "./forgot-password";

test("forgot-password responses do not reveal whether an account exists", () => {
  assert.deepEqual(normalizeForgotPasswordResponse(200), { status: 200, message: GENERIC_RESET_MESSAGE });
  assert.deepEqual(normalizeForgotPasswordResponse(404), { status: 200, message: GENERIC_RESET_MESSAGE });
  assert.deepEqual(normalizeForgotPasswordResponse(409), { status: 200, message: GENERIC_RESET_MESSAGE });
});

test("forgot-password preserves rate-limit and service-unavailable signals", () => {
  assert.deepEqual(normalizeForgotPasswordResponse(429), {
    status: 429,
    message: "Too many reset requests. Please try again later.",
  });
  assert.deepEqual(normalizeForgotPasswordResponse(503), {
    status: 503,
    message: "Password reset is temporarily unavailable.",
  });
});
