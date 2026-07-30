import type { ApiTournament } from "@/app/(types)/event";
import type { DataResult } from "@/lib/data-result";
import { clientJson } from "@/lib/http/client";
import { getTournamentDetail, getTournamentList } from "@/features/tournaments/api";

export const tournamentService = {
  getFeaturedTournaments(): Promise<DataResult<ApiTournament[]>> { return getTournamentList(8); },
  getAllTournaments(): Promise<DataResult<ApiTournament[]>> { return getTournamentList(); },
  getTournamentById(id: string): Promise<DataResult<ApiTournament>> { return getTournamentDetail(id); },
  async joinTournament(tournamentId: string) {
    try {
      const result = await clientJson(`/api/tournaments/${encodeURIComponent(tournamentId)}/join`, { method: "POST" });
      return { success: result.ok, message: result.message, status: result.status, data: result.data };
    } catch { return { success: false, message: "Could not join due to a network error." }; }
  },
  async leaveTournament(tournamentId: string) {
    try {
      const result = await clientJson(`/api/tournaments/${encodeURIComponent(tournamentId)}/leave`, { method: "POST" });
      return { success: result.ok, message: result.message, status: result.status, data: result.data };
    } catch { return { success: false, message: "Could not leave due to a network error." }; }
  },
};
