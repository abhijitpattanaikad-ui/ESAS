import assert from "node:assert/strict";
import test from "node:test";
import { resetDestinationForState } from "./token-state";

test("reset states expose one deterministic destination", () => {
  assert.equal(resetDestinationForState("success"), "/login");
  assert.equal(resetDestinationForState("expired"), "/forgot-password");
  assert.equal(resetDestinationForState("ready"), null);
  assert.equal(resetDestinationForState("failed"), null);
});
