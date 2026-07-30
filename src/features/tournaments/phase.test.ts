import assert from "node:assert/strict";
import test from "node:test";
import { deriveTournamentPhase, getCountdownParts } from "./phase";

const schedule = {
  registrationStart: "2026-07-01T00:00:00.000Z",
  registrationEnd: "2026-07-31T00:00:00.000Z",
  tournamentStart: "2026-08-10T00:00:00.000Z",
  tournamentEnd: "2026-08-11T00:00:00.000Z",
};

test("derives phase from explicit dates, not display copy", () => {
  assert.equal(deriveTournamentPhase(schedule, new Date("2026-07-29T00:00:00.000Z")), "REGISTRATION_OPEN");
  assert.equal(deriveTournamentPhase(schedule, new Date("2026-08-05T00:00:00.000Z")), "REGISTRATION_CLOSED");
  assert.equal(deriveTournamentPhase(schedule, new Date("2026-08-10T12:00:00.000Z")), "TOURNAMENT_ACTIVE");
});

test("countdown reports total days rather than residual calendar days", () => {
  const result = getCountdownParts(new Date("2026-01-01T00:00:00Z"), new Date("2026-03-02T01:02:03Z"));
  assert.deepEqual(result, { days: 60, hours: 1, minutes: 2, seconds: 3 });
});
