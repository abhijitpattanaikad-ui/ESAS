import { getApiUrl } from "../env";
import { UpstreamError } from "./errors";
import { readResponseBody } from "./response";

export interface UpstreamRequestInit extends RequestInit {
  next?: { revalidate?: number; tags?: string[] };
  token?: string | null;
  timeoutMs?: number;
  allowErrorResponse?: boolean;
}

export async function upstreamFetch(path: string, init: UpstreamRequestInit = {}): Promise<Response> {
  const { token, timeoutMs = 10_000, allowErrorResponse = false, headers, ...requestInit } = init;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = new URL(path.replace(/^\//, ""), `${getApiUrl()}/`);

  try {
    const response = await fetch(url, {
      ...requestInit,
      signal: controller.signal,
      cache: requestInit.cache ?? "no-store",
      headers: {
        Accept: "application/json",
        ...(requestInit.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

    if (!response.ok && !allowErrorResponse) {
      throw new UpstreamError(response.status, await readResponseBody(response));
    }
    return response;
  } catch (error) {
    if (error instanceof UpstreamError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new UpstreamError(504, { message: "The upstream service timed out." });
    }
    throw new UpstreamError(503, { message: "The upstream service could not be reached." });
  } finally {
    clearTimeout(timeout);
  }
}

export async function upstreamJson<T>(path: string, init: UpstreamRequestInit = {}): Promise<T> {
  const response = await upstreamFetch(path, init);
  return (await readResponseBody(response)) as T;
}
