import assert from "node:assert/strict";
import test from "node:test";
import { parseTournament } from "./contracts";

test("tournament parser keeps valid sponsors and omits missing thumbnails", () => {
  const tournament = parseTournament({
    _id: "t1",
    name: "Finals",
    sponsors: [
      { _id: "s1", name: "Sponsor One", thumbnail: "https://cdn.example/s1.png" },
      { _id: "s2", name: "Sponsor Two" },
      { _id: "s3" },
    ],
  });

  assert.deepEqual(tournament?.sponsors, [
    { _id: "s1", name: "Sponsor One", thumbnail: "https://cdn.example/s1.png" },
    { _id: "s2", name: "Sponsor Two" },
  ]);
});
