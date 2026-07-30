import assert from "node:assert/strict";
import test from "node:test";
import { adaptBracketResponse } from "./adapter";

test("adapts a single-elimination response", () => {
  const result = adaptBracketResponse({
    type: "SingleEliminationBracket",
    matches: [{ id: 1, state: "SCORE_DONE", participants: [{ id: "p1", name: "A", score: 2, winner: true }] }],
  });
  assert.equal(result.kind, "success");
  if (result.kind === "success") {
    assert.equal(result.data.type, "single-elimination");
    assert.equal(result.data.matches[0].state, "DONE");
    assert.equal(result.data.matches[0].participants[0].resultText, "2");
  }
});

test("rejects malformed responses rather than fabricating results", () => {
  assert.deepEqual(adaptBracketResponse({ nonsense: true }), {
    kind: "error",
    error: { code: "INVALID_BRACKET", message: "Bracket data is unavailable." },
  });
});
