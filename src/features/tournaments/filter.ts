import type { ApiTournament, ApiTournamentStatus } from "@/app/(types)/event";

export interface TournamentFilters {
  query: string;
  game: string | "All";
  status: ApiTournamentStatus | "All";
}

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase("en");
}

export function filterTournaments(
  tournaments: ApiTournament[],
  { query, game, status }: TournamentFilters,
): ApiTournament[] {
  const normalizedQuery = normalizeSearchText(query);

  return tournaments.filter((tournament) => {
    const matchesQuery = normalizedQuery === ""
      || normalizeSearchText(tournament.name).includes(normalizedQuery)
      || normalizeSearchText(tournament.game.name).includes(normalizedQuery);
    const matchesGame = game === "All" || tournament.game.name === game;
    const matchesStatus = status === "All" || tournament.status === status;

    return matchesQuery && matchesGame && matchesStatus;
  });
}
