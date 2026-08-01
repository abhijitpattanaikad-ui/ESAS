import type { ApiTournament } from "@/app/(types)/event";
import type { DataResult } from "@/lib/data-result";
import { isUpstreamError } from "@/lib/http/errors";
import { upstreamJson } from "@/lib/http/upstream";
import { parseTournamentDetail, parseTournamentList } from "./contracts";

const PROJECT_FIELDS = "name assets prizePool mode platform format schedule isDraft status heading text game buttonText _id";

function errorResult(error: unknown, message: string): DataResult<never> {
  if (isUpstreamError(error)) {
    if (error.status === 404) return { kind: "not-found" };
    return {
      kind: "error",
      error: { code: error.code, message: error.message, status: error.status },
    };
  }
  return { kind: "error", error: { code: "UNKNOWN", message } };
}

export async function getTournamentList(limit?: number): Promise<DataResult<ApiTournament[]>> {
  try {
    const raw = await upstreamJson<unknown>("/v1/tournament/find-all", {
      method: "POST",
      body: JSON.stringify({ criteria: {}, project: PROJECT_FIELDS }),
      next: { revalidate: 300 },
    });
    const parsed = parseTournamentList(raw);
    if (!parsed) return { kind: "error", error: { code: "INVALID_RESPONSE", message: "Tournament data is temporarily unavailable." } };
    const visible = parsed.filter((item) => !item.isDraft);
    const result = typeof limit === "number" ? visible.slice(0, limit) : visible;
    return result.length ? { kind: "success", data: result } : { kind: "empty" };
  } catch (error) {
    return errorResult(error, "Tournament data is temporarily unavailable.");
  }
}

export async function getTournamentDetail(id: string, token?: string | null): Promise<DataResult<ApiTournament>> {
  try {
    const raw = await upstreamJson<unknown>(`/v1/tournament/find/${encodeURIComponent(id)}`, {
      method: "POST",
      token,
      body: JSON.stringify({ criteria: {} }),
    });
    const parsed = parseTournamentDetail(raw);
    return parsed ? { kind: "success", data: parsed } : { kind: "error", error: { code: "INVALID_RESPONSE", message: "Tournament details are unavailable." } };
  } catch (error) {
    return errorResult(error, "Tournament details are temporarily unavailable.");
  }
}
