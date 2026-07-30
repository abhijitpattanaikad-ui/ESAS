import assert from "node:assert/strict";
import test from "node:test";
import { extractLoginSession } from "./login";

test("extracts the bearer token while returning only safe presentation data", () => {
  assert.deepEqual(extractLoginSession({ token: "secret", username: "Player", _id: "user-1", role: "ADMIN" }), {
    token: "secret",
    user: { username: "Player" },
  });
});

test("rejects login responses without a token", () => {
  assert.equal(extractLoginSession({ username: "Player" }), null);
});
