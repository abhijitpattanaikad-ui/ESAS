export function formatTeamFormat(format?: string, mode?: string): string | null {
  const explicitFormat = format?.trim();
  if (explicitFormat) return explicitFormat;
  return mode === "duelSolo" ? "1v1" : null;
}

export function formatPrizePool(value?: string | number): string | null {
  if (typeof value === "number") return Number.isFinite(value) ? value.toLocaleString("en-AE") : null;
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const amount = Number(trimmed);
  if (Number.isFinite(amount)) return amount.toLocaleString("en-AE");
  if (/^[+-]?(?:infinity|nan)$/i.test(trimmed) || amount === Number.POSITIVE_INFINITY || amount === Number.NEGATIVE_INFINITY) return null;
  return trimmed;
}

export function formatOnlineStatus(value?: boolean): string {
  if (value === true) return "Online";
  if (value === false) return "Offline";
  return "Not listed";
}

export function formatRegion(value?: string): string {
  return value?.trim() || "Not listed";
}
