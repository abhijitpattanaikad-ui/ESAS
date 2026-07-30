import { NextResponse } from "next/server";
import { clearSessionCookie, getSessionToken } from "@/lib/auth/session";
import { isUpstreamError } from "@/lib/http/errors";
import { upstreamJson } from "@/lib/http/upstream";

export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ authenticated: false });
  try {
    const profile = await upstreamJson<Record<string, unknown>>("/v1/user/getuserinfo", { token });
    return NextResponse.json({
      authenticated: true,
      user: { username: typeof profile.username === "string" ? profile.username : "Player" },
    });
  } catch (error) {
    if (isUpstreamError(error) && error.status === 401) {
      await clearSessionCookie();
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({ authenticated: false, unavailable: true }, { status: 503 });
  }
}
