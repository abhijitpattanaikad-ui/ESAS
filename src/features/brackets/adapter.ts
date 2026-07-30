import type { BracketData, BracketMatch, BracketParticipant, BracketResult, MatchState } from "./types";

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function firstString(...values: unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0);
}

function matchState(value: unknown): MatchState {
  const normalized = typeof value === "string" ? value.toUpperCase().replace(/[ -]/g, "_") : "";
  if (["DONE", "COMPLETED", "FINISHED", "SCORE_DONE", "PLAYED"].includes(normalized)) return "DONE";
  if (["WALK_OVER", "WALKOVER", "BYE"].includes(normalized)) return "WALK_OVER";
  if (normalized === "NO_SHOW") return "NO_SHOW";
  return "SCHEDULED";
}

function participant(value: unknown, matchId: string | number, index: number): BracketParticipant {
  const item = record(value) ?? {};
  const competitor = record(item.competitor) ?? {};
  const score = item.resultText ?? item.score;
  return {
    id: firstString(competitor._id, item._id, item.id) ?? `${matchId}-participant-${index + 1}`,
    name: firstString(competitor.username, item.username, item.name, item.teamName, item.source) ?? "TBD",
    resultText: score === null || score === undefined ? null : String(score),
    isWinner: item.isWinner === true || item.winner === true || item.result === "win",
    status: typeof item.status === "string" ? item.status : null,
  };
}

function adaptMatch(value: unknown, index: number, roundName?: string): BracketMatch | null {
  const item = record(value);
  if (!item) return null;
  const id = typeof item.id === "number" || typeof item.id === "string"
    ? item.id
    : typeof item._id === "string" ? item._id : `match-${index + 1}`;
  const rawParticipants = Array.isArray(item.participants) ? item.participants
    : Array.isArray(item.opponents) ? item.opponents
      : Array.isArray(item.teams) ? item.teams
        : Array.isArray(item.players) ? item.players : [];
  return {
    id,
    name: firstString(item.name),
    nextMatchId: typeof item.nextMatchId === "string" || typeof item.nextMatchId === "number" ? item.nextMatchId : null,
    nextLooserMatchId: typeof item.nextLooserMatchId === "string" || typeof item.nextLooserMatchId === "number" ? item.nextLooserMatchId : null,
    tournamentRoundText: firstString(item.tournamentRoundText, roundName) ?? "Round",
    seriesText: firstString(item.seriesText, item.series) ?? null,
    startTime: firstString(item.startTime, item.scheduledAt) ?? null,
    state: matchState(item.state ?? item.status),
    participants: rawParticipants.slice(0, 2).map((value, participantIndex) => participant(value, id, participantIndex)),
  };
}

function typeFrom(value: unknown): BracketData["type"] | null {
  if (typeof value !== "string") return null;
  const normalized = value.toLowerCase().replace(/[ _-]/g, "");
  if (normalized.includes("double")) return "double-elimination";
  if (normalized.includes("roundrobin")) return "round-robin";
  if (normalized.includes("single")) return "single-elimination";
  return null;
}

function adaptMatches(values: unknown[], roundName?: string): BracketMatch[] {
  return values.map((value, index) => adaptMatch(value, index, roundName)).filter((value): value is BracketMatch => value !== null);
}

export function adaptBracketResponse(raw: unknown): BracketResult {
  if (raw === null || raw === undefined) return { kind: "empty" };
  const item = record(raw);
  if (!item) return { kind: "error", error: { code: "INVALID_BRACKET", message: "Bracket data is unavailable." } };

  const explicitType = typeFrom(item.type ?? item.bracketType);
  if (explicitType && Array.isArray(item.matches)) {
    const matches = adaptMatches(item.matches);
    return matches.length ? { kind: "success", data: { type: explicitType, matches } } : { kind: "empty" };
  }

  if (explicitType === "double-elimination" && (Array.isArray(item.upperMatches) || Array.isArray(item.lowerMatches))) {
    const upperMatches = adaptMatches(Array.isArray(item.upperMatches) ? item.upperMatches : []);
    const lowerMatches = adaptMatches(Array.isArray(item.lowerMatches) ? item.lowerMatches : []);
    return upperMatches.length || lowerMatches.length
      ? { kind: "success", data: { type: explicitType, matches: upperMatches, upperMatches, lowerMatches } }
      : { kind: "empty" };
  }

  if (typeFrom(item.bracketType) && Array.isArray(item.rounds)) {
    const matches = item.rounds.flatMap((round) => {
      const roundRecord = record(round) ?? {};
      return adaptMatches(Array.isArray(roundRecord.matches) ? roundRecord.matches : [], firstString(roundRecord.name, roundRecord.title));
    });
    return matches.length ? { kind: "success", data: { type: typeFrom(item.bracketType)!, matches } } : { kind: "empty" };
  }

  return { kind: "error", error: { code: "INVALID_BRACKET", message: "Bracket data is unavailable." } };
}
