import { clientJson } from "@/lib/http/client";
import type { BracketResult } from "@/features/brackets/types";

export type { BracketData, BracketMatch, BracketParticipant, BracketResult } from "@/features/brackets/types";

export const bracketService = {
  async getBracketsByTournamentId(tournamentId: string): Promise<BracketResult> {
    try {
      const result = await clientJson<BracketResult>(`/api/tournaments/${encodeURIComponent(tournamentId)}/bracket`, { cache: "no-store" });
      if (result.data && typeof result.data === "object" && "kind" in result.data) return result.data;
      return { kind: "error", error: { code: "UPSTREAM_ERROR", message: result.message } };
    } catch {
      return { kind: "error", error: { code: "UPSTREAM_ERROR", message: "Bracket data is temporarily unavailable." } };
    }
  },
};
