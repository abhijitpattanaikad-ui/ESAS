export interface ConsentPreference {
  necessary: true;
  analytics: boolean;
  version: 1;
}

export const CONSENT_COOKIE = "xesports_consent";
export const DEFAULT_CONSENT: ConsentPreference = Object.freeze({ necessary: true, analytics: false, version: 1 });

const SENSITIVE_ROUTE_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset",
  "/verify",
];

export function parseConsent(value: string | null | undefined): ConsentPreference {
  if (!value) return { ...DEFAULT_CONSENT };
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<ConsentPreference>;
    if (parsed.necessary === true && typeof parsed.analytics === "boolean" && parsed.version === 1) {
      return { necessary: true, analytics: parsed.analytics, version: 1 };
    }
  } catch {
    // Malformed preferences fall back to essential-only.
  }
  return { ...DEFAULT_CONSENT };
}

export function serializeConsent(value: ConsentPreference): string {
  return encodeURIComponent(JSON.stringify(value));
}

export function isSensitiveRoute(pathname: string): boolean {
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  return SENSITIVE_ROUTE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function shouldLoadAnalytics(
  consent: ConsentPreference,
  pathname: string,
  tagManagerId: string | undefined,
): boolean {
  return Boolean(tagManagerId?.trim()) && consent.analytics && !isSensitiveRoute(pathname);
}
