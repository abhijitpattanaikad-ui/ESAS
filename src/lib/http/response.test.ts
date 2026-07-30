import assert from "node:assert/strict";
import test from "node:test";
import { readResponseBody } from "./response";

test("readResponseBody parses JSON after exactly one body read", async () => {
  const response = new Response('{"message":"ok"}', { headers: { "content-type": "application/json" } });
  assert.deepEqual(await readResponseBody(response), { message: "ok" });
  assert.equal(response.bodyUsed, true);
});

test("readResponseBody wraps plain text", async () => {
  const response = new Response("expired token");
  assert.deepEqual(await readResponseBody(response), { message: "expired token" });
});

test("readResponseBody returns an empty object for an empty body", async () => {
  assert.deepEqual(await readResponseBody(new Response(null, { status: 204 })), {});
});
