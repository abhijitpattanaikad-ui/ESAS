import assert from "node:assert/strict";
import test from "node:test";
import type { ApiTournament } from "@/app/(types)/event";
import { filterTournaments } from "./filter";
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

const tournaments: ApiTournament[] = [
  {
    _id: "street-fighter-open",
    name: "Desert Clash",
    isDraft: false,
    status: "Registration Open",
    assets: {},
    game: { name: "Street Fighter 6" },
    schedule: {},
  },
  {
    _id: "valorant-finals",
    name: "Champions Night",
    isDraft: false,
    status: "Completed",
    assets: {},
    game: { name: "Valorant" },
    schedule: {},
  },
  {
    _id: "valorant-open",
    name: "Rising Stars",
    isDraft: false,
    status: "Registration Open",
    assets: {},
    game: { name: "Valorant" },
    schedule: {},
  },
];

test("tournament filtering normalizes search text across names and games", () => {
  assert.deepEqual(
    filterTournaments(tournaments, { query: "  STREET fighter  ", game: "All", status: "All" }).map(({ _id }) => _id),
    ["street-fighter-open"],
  );
  assert.deepEqual(
    filterTournaments(tournaments, { query: "champions", game: "All", status: "All" }).map(({ _id }) => _id),
    ["valorant-finals"],
  );
});

test("tournament filtering combines exact game and status selections", () => {
  assert.deepEqual(
    filterTournaments(tournaments, { query: "", game: "Valorant", status: "Registration Open" }).map(({ _id }) => _id),
    ["valorant-open"],
  );
});
