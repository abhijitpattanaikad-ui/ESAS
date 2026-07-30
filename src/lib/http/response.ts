export type JsonObject = Record<string, unknown>;

export async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return {};

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text } satisfies JsonObject;
  }
}

export function getMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) return record.message;
    if (Array.isArray(record.details)) {
      const first = record.details[0];
      if (first && typeof first === "object" && typeof (first as Record<string, unknown>).message === "string") {
        return (first as Record<string, string>).message;
      }
    }
  }
  return fallback;
}
