import assert from "node:assert/strict";
import test from "node:test";
import { parseBrandList, parseGameList } from "./contracts";

test("game parser accepts valid games and drops malformed records", () => {
  assert.deepEqual(
    parseGameList([
      { _id: "g1", name: "Valorant", assets: { thumbnail: "https://cdn.example/game.jpg" } },
      { _id: "missing-name" },
    ]),
    [{ _id: "g1", name: "Valorant", assets: { thumbnail: "https://cdn.example/game.jpg" } }],
  );
});

test("brand parser supports wrapped API data and validates required fields", () => {
  assert.deepEqual(
    parseBrandList({ brands: [
      { _id: "b1", name: "Partner", thumbnail: "https://cdn.example/logo.png", isActive: true },
      { _id: "b2", name: "Missing logo", isActive: true },
    ] }),
    [{ _id: "b1", name: "Partner", thumbnail: "https://cdn.example/logo.png", isActive: true }],
  );
});

test("catalog parsers reject non-list payloads", () => {
  assert.equal(parseGameList({ message: "down" }), null);
  assert.equal(parseBrandList(null), null);
});
