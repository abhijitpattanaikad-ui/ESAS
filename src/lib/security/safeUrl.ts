export function getSafeHttpsUrl(value?: string | null): string | null {
  const input = value?.trim();
  if (!input) return null;

  const explicitScheme = input.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
  if (explicitScheme && explicitScheme !== "https") return null;

  try {
    const url = new URL(explicitScheme ? input : `https://${input}`);
    return url.protocol === "https:" && url.hostname ? url.toString() : null;
  } catch {
    return null;
  }
}
