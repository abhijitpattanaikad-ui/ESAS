const DEFAULT_API_URL = "https://apis.xesports.pro";

export function getApiUrl(): string {
  const value = process.env.XESPORTS_API_URL?.trim() || DEFAULT_API_URL;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
      throw new Error("XESPORTS_API_URL must use HTTPS in production.");
    }
    return url.toString().replace(/\/$/, "");
  } catch (error) {
    throw new Error(`Invalid XESPORTS_API_URL: ${String(error)}`);
  }
}
