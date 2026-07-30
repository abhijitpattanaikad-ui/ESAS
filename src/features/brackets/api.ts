import type { BracketResult } from "./types";
import { adaptBracketResponse } from "./adapter";
import { isUpstreamError } from "@/lib/http/errors";
import { upstreamJson } from "@/lib/http/upstream";

export async function getBracket(tournamentId: string, token?: string | null): Promise<BracketResult> {
  try {
    const raw = await upstreamJson<unknown>(`/v1/bracket/${encodeURIComponent(tournamentId)}`, { token });
    return adaptBracketResponse(raw);
  } catch (error) {
    const message = isUpstreamError(error) && error.status === 404
      ? "The bracket has not been generated yet."
      : "Bracket data is temporarily unavailable.";
    return { kind: "error", error: { code: "UPSTREAM_ERROR", message } };
  }
}
