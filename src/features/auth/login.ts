export interface SafeLoginUser {
  username: string;
}

export interface LoginSession {
  token: string;
  user: SafeLoginUser;
}

export function extractLoginSession(payload: unknown): LoginSession | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (typeof record.token !== "string" || !record.token.trim()) return null;
  return {
    token: record.token,
    user: {
      username: typeof record.username === "string" ? record.username : "Player",
    },
  };
}
