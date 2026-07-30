import { NextResponse } from "next/server";
import { extractLoginSession } from "@/features/auth/login";
import { setSessionCookie } from "@/lib/auth/session";
import { upstreamJson } from "@/lib/http/upstream";
import { errorResponse, readJsonRequest, rejectCrossOriginMutation } from "@/lib/http/route";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const body = await readJsonRequest(request);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
    return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const payload = await upstreamJson<unknown>("/v1/user/login", {
      method: "POST",
      body: JSON.stringify({ criteria: { email, password } }),
    });
    const session = extractLoginSession(payload);
    if (!session) return NextResponse.json({ message: "Login response was invalid." }, { status: 502 });
    await setSessionCookie(session.token);
    return NextResponse.json(session.user);
  } catch (error) {
    return errorResponse(error, "Login failed.");
  }
}
