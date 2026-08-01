export function formatTeamFormat(format?: string, mode?: string): string | null {
  const explicitFormat = format?.trim();
  if (explicitFormat) return explicitFormat;
  return mode === "duelSolo" ? "1v1" : null;
}

export function formatPrizePool(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString("en-AE") : String(value);
}
