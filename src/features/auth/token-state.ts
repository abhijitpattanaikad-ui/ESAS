export type ResetState = "ready" | "submitting" | "success" | "expired" | "failed" | "missing-token";

export function resetDestinationForState(state: ResetState): string | null {
  if (state === "success") return "/login";
  if (state === "expired") return "/forgot-password";
  return null;
}
