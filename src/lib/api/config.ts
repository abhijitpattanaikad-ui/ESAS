const DEFAULT_API_BASE_URL = "https://apis.xesports.pro";

export function normalizeApiBaseUrl(value?: string): string {
  const candidate = value?.trim() || DEFAULT_API_BASE_URL;
  const url = new URL(candidate);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("API URL must use HTTP or HTTPS");
  }

  return candidate.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_URL,
);
