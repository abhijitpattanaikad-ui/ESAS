export type TournamentPhase =
  | "REGISTRATION_NOT_STARTED"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "TOURNAMENT_ACTIVE"
  | "COMPLETED"
  | "UNKNOWN";

export interface TournamentScheduleLike {
  registrationStart?: string | null;
  registrationEnd?: string | null;
  tournamentStart?: string | null;
  tournamentEnd?: string | null;
}

function timestamp(value?: string | null): number | null {
  if (!value) return null;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

export function deriveTournamentPhase(schedule: TournamentScheduleLike, now = new Date()): TournamentPhase {
  const current = now.getTime();
  const registrationStart = timestamp(schedule.registrationStart);
  const registrationEnd = timestamp(schedule.registrationEnd);
  const tournamentStart = timestamp(schedule.tournamentStart);
  const tournamentEnd = timestamp(schedule.tournamentEnd);

  if (tournamentEnd !== null && current >= tournamentEnd) return "COMPLETED";
  if (tournamentStart !== null && current >= tournamentStart) return "TOURNAMENT_ACTIVE";
  if (registrationEnd !== null && current >= registrationEnd) return "REGISTRATION_CLOSED";
  if (registrationStart !== null && current >= registrationStart) return "REGISTRATION_OPEN";
  if (registrationStart !== null && current < registrationStart) return "REGISTRATION_NOT_STARTED";
  return "UNKNOWN";
}

export function getCountdownTarget(schedule: TournamentScheduleLike, phase: TournamentPhase): string | null {
  if (phase === "REGISTRATION_NOT_STARTED") return schedule.registrationStart ?? null;
  if (phase === "REGISTRATION_OPEN") return schedule.registrationEnd ?? null;
  if (phase === "REGISTRATION_CLOSED") return schedule.tournamentStart ?? null;
  if (phase === "TOURNAMENT_ACTIVE") return schedule.tournamentEnd ?? null;
  return null;
}

export function getCountdownParts(from: Date, target: Date) {
  const totalSeconds = Math.max(0, Math.floor((target.getTime() - from.getTime()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}
