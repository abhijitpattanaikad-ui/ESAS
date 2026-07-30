import assert from "node:assert/strict";
import test from "node:test";
import { isSameOriginMutation } from "./origin";

test("accepts state-changing requests only from the exact application origin", () => {
  const sameOrigin = new Request("https://www.xesports.pro/api/profile", {
    method: "POST",
    headers: { origin: "https://www.xesports.pro", "sec-fetch-site": "same-origin" },
  });
  const crossOrigin = new Request("https://www.xesports.pro/api/profile", {
    method: "POST",
    headers: { origin: "https://attacker.example", "sec-fetch-site": "cross-site" },
  });

  assert.equal(isSameOriginMutation(sameOrigin), true);
  assert.equal(isSameOriginMutation(crossOrigin), false);
});

test("rejects mutations without an Origin header", () => {
  const request = new Request("https://www.xesports.pro/api/profile", { method: "POST" });
  assert.equal(isSameOriginMutation(request), false);
});
