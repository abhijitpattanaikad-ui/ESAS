import { getMessage, readResponseBody } from "./response";

export interface ClientResult<T> {
  ok: boolean;
  status: number;
  data: T;
  message: string;
}

export async function clientJson<T = Record<string, unknown>>(input: RequestInfo | URL, init?: RequestInit): Promise<ClientResult<T>> {
  const response = await fetch(input, {
    credentials: "same-origin",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  const data = await readResponseBody(response) as T;
  return { ok: response.ok, status: response.status, data, message: getMessage(data, response.ok ? "Success" : "Request failed") };
}
