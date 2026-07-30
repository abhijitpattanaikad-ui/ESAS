import type { ApiGame, ApiParticipant, ApiSchedule, ApiSponsor, ApiTournament, ApiTournamentAssets, ApiTournamentStatus } from "@/app/(types)/event";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function string(value: unknown): string | undefined { return typeof value === "string" && value.trim() ? value : undefined; }
function boolean(value: unknown, fallback = false): boolean { return typeof value === "boolean" ? value : fallback; }
function stringArray(value: unknown): string[] | undefined { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined; }

const STATUSES = new Set<ApiTournamentStatus>(["Upcoming", "Ongoing", "Completed", "Registration Open", "Starting Soon"]);
function status(value: unknown): ApiTournamentStatus {
  return typeof value === "string" && STATUSES.has(value as ApiTournamentStatus) ? value as ApiTournamentStatus : "Status unavailable";
}
function assets(value: unknown): ApiTournamentAssets {
  const item = asRecord(value) ?? {};
  return { logo: string(item.logo), thumbnail: string(item.thumbnail), desktopBanner: string(item.desktopBanner), mobileBanner: string(item.mobileBanner) };
}
function game(value: unknown): ApiGame {
  const item = asRecord(value) ?? {};
  return { name: string(item.name) ?? "Game TBA", shortName: string(item.shortName), assets: assets(item.assets) };
}
function schedule(value: unknown): ApiSchedule {
  const item = asRecord(value) ?? {};
  return { registrationStart: string(item.registrationStart), registrationEnd: string(item.registrationEnd), tournamentStart: string(item.tournamentStart), tournamentEnd: string(item.tournamentEnd) };
}
function sponsors(value: unknown): ApiSponsor[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((candidate): ApiSponsor | null => {
    const item = asRecord(candidate) ?? {};
    const name = string(item.name);
    if (!name) return null;
    const sponsor: ApiSponsor = { _id: string(item._id) ?? name, name };
    const thumbnail = string(item.thumbnail);
    if (thumbnail) sponsor.thumbnail = thumbnail;
    return sponsor;
  }).filter((item): item is ApiSponsor => item !== null);
}
function participants(value: unknown): ApiParticipant[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((candidate) => {
    const item = asRecord(candidate) ?? {};
    return { _id: string(item._id), username: string(item.username), profileImage: string(item.profileImage) };
  });
}

export function parseTournament(value: unknown): ApiTournament | null {
  const item = asRecord(value);
  if (!item) return null;
  const name = string(item.name);
  if (!name) return null;
  return {
    _id: string(item._id),
    name,
    isDraft: boolean(item.isDraft),
    status: status(item.status),
    heading: string(item.heading),
    text: string(item.text),
    assets: assets(item.assets),
    game: game(item.game),
    schedule: schedule(item.schedule),
    isOnline: typeof item.isOnline === "boolean" ? item.isOnline : undefined,
    city: string(item.city), country: string(item.country), regions: string(item.regions), mode: string(item.mode), format: string(item.format), platform: string(item.platform),
    prizePool: typeof item.prizePool === "number" || typeof item.prizePool === "string" ? item.prizePool : undefined,
    description: string(item.description), shortDescription: string(item.shortDescription), rules: string(item.rules),
    prizes: Array.isArray(item.prizes) ? item.prizes : undefined, rulesLink: string(item.rulesLink), joinStatus: string(item.joinStatus), message: string(item.message), buttonText: string(item.buttonText),
    participatedPlayers: participants(item.participatedPlayers), sponsors: sponsors(item.sponsors), competition: string(item.competition), allowedCountries: stringArray(item.allowedCountries), organisedBy: string(item.organisedBy),
  };
}

export function parseTournamentList(value: unknown): ApiTournament[] | null {
  const source = Array.isArray(value) ? value : Array.isArray(asRecord(value)?.tournaments) ? asRecord(value)!.tournaments as unknown[] : null;
  if (!source) return null;
  return source.map(parseTournament).filter((item): item is ApiTournament => item !== null);
}

export function parseTournamentDetail(value: unknown): ApiTournament | null {
  const container = asRecord(value);
  if (!container) return null;
  const source = container.tournament ?? value;
  const tournament = parseTournament(source);
  if (!tournament) return null;
  return {
    ...tournament,
    participatedPlayers: participants(container.participatedPlayers) ?? tournament.participatedPlayers,
    sponsors: sponsors(container.sponsors) ?? tournament.sponsors,
    joinStatus: string(container.joinStatus) ?? tournament.joinStatus,
    message: string(container.message) ?? tournament.message,
    buttonText: string(container.buttonText) ?? tournament.buttonText,
    heading: string(container.heading) ?? tournament.heading,
    text: string(container.text) ?? tournament.text,
  };
}
