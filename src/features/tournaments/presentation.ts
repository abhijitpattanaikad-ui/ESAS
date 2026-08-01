export function formatTeamFormat(format?: string, mode?: string): string | null {
  const explicitFormat = format?.trim();
  if (explicitFormat) return explicitFormat;
  return mode === "duelSolo" ? "1v1" : null;
}
