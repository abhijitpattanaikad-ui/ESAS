export type BracketType = "single-elimination" | "double-elimination" | "round-robin";
export type MatchState = "DONE" | "SCHEDULED" | "WALK_OVER" | "NO_SHOW";

export interface BracketParticipant {
  id: string;
  name: string;
  resultText: string | null;
  isWinner: boolean;
  status: string | null;
}

export interface BracketMatch {
  id: string | number;
  name?: string;
  nextMatchId: string | number | null;
  nextLooserMatchId?: string | number | null;
  tournamentRoundText: string;
  seriesText?: string | null;
  startTime: string | null;
  state: MatchState;
  participants: BracketParticipant[];
}

export interface RoundRobinStanding { rank: number; team: string; played: number; won: number; lost: number; points: number }

export interface BracketData {
  type: BracketType;
  matches: BracketMatch[];
  upperMatches?: BracketMatch[];
  lowerMatches?: BracketMatch[];
  standings?: RoundRobinStanding[];
}

export type BracketResult =
  | { kind: "success"; data: BracketData }
  | { kind: "empty" }
  | { kind: "error"; error: { code: "INVALID_BRACKET" | "UPSTREAM_ERROR"; message: string } };
