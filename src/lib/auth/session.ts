import { cookies } from "next/headers";
import { getSessionCookieOptions, SESSION_COOKIE } from "./cookie-config";

export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function hasSession(): Promise<boolean> {
  return Boolean(await getSessionToken());
}

export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, getSessionCookieOptions());
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", { ...getSessionCookieOptions(), maxAge: 0 });
}
