import assert from "node:assert/strict";
import test from "node:test";
import { SESSION_COOKIE, getSessionCookieOptions } from "./cookie-config";

test("session cookie is inaccessible to JavaScript and scoped safely", () => {
  assert.equal(SESSION_COOKIE, "xesports_session");
  assert.deepEqual(getSessionCookieOptions("production"), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
});
