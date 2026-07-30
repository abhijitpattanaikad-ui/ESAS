export const SESSION_COOKIE = "xesports_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function getSessionCookieOptions(environment = process.env.NODE_ENV) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: environment !== "development",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
