export type ResetOutcome =
  | { kind: "success"; redirectTo: "/login" }
  | { kind: "expired"; redirectTo: null }
  | { kind: "error"; redirectTo: null };

export function getResetOutcome(response: Pick<Response, "ok" | "status">): ResetOutcome {
  if (response.ok) {
    return { kind: "success", redirectTo: "/login" };
  }

  if (response.status === 401) {
    return { kind: "expired", redirectTo: null };
  }

  return { kind: "error", redirectTo: null };
}
