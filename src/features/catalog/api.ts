import type { DataResult } from "@/lib/data-result";
import { isUpstreamError } from "@/lib/http/errors";
import { upstreamJson } from "@/lib/http/upstream";
import {
  type ApiBrand,
  type ApiGameResponse,
  parseBrandList,
  parseGameList,
} from "./contracts";

function catalogError<T>(error: unknown, fallbackMessage: string): DataResult<T> {
  if (isUpstreamError(error)) {
    return {
      kind: "error",
      error: { code: error.code, message: error.message, status: error.status },
    };
  }
  return { kind: "error", error: { code: "UNKNOWN", message: fallbackMessage } };
}

export async function getGameList(): Promise<DataResult<ApiGameResponse[]>> {
  try {
    const raw = await upstreamJson<unknown>("/v1/game/find-all", {
      method: "POST",
      body: JSON.stringify({ criteria: {} }),
      next: { revalidate: 300 },
    });
    const games = parseGameList(raw);
    if (!games) {
      return { kind: "error", error: { code: "INVALID_RESPONSE", message: "Game data is temporarily unavailable." } };
    }
    return games.length ? { kind: "success", data: games } : { kind: "empty" };
  } catch (error) {
    return catalogError(error, "Game data is temporarily unavailable.");
  }
}

export async function getBrandList(): Promise<DataResult<ApiBrand[]>> {
  try {
    const raw = await upstreamJson<unknown>("/v1/brand/find-all", {
      method: "POST",
      body: JSON.stringify({}),
      next: { revalidate: 300 },
    });
    const brands = parseBrandList(raw);
    if (!brands) {
      return { kind: "error", error: { code: "INVALID_RESPONSE", message: "Partner data is temporarily unavailable." } };
    }
    return brands.length ? { kind: "success", data: brands } : { kind: "empty" };
  } catch (error) {
    return catalogError(error, "Partner data is temporarily unavailable.");
  }
}
