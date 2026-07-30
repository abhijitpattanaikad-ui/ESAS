import { NextResponse } from "next/server";
import { TERMS_VERSION } from "@/features/auth/validation";
import { errorResponse, readJsonRequest, rejectCrossOriginMutation } from "@/lib/http/route";
import { readResponseBody } from "@/lib/http/response";
import { upstreamFetch } from "@/lib/http/upstream";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const body = await readJsonRequest(request);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const termsVersion = body?.termsVersion;
  const termsAcceptedAt = body?.termsAcceptedAt;

  if (!username || !email || !phone || password.length < 8 || termsVersion !== TERMS_VERSION || typeof termsAcceptedAt !== "string") {
    return NextResponse.json({ message: "Signup data is incomplete or invalid." }, { status: 400 });
  }

  try {
    const response = await upstreamFetch("/v1/user/signup", {
      method: "POST",
      headers: {
        "X-Xesports-Terms-Version": termsVersion,
        "X-Xesports-Terms-Accepted-At": termsAcceptedAt,
      },
      body: JSON.stringify({ data: { username, email, phone, password } }),
      allowErrorResponse: true,
    });
    return NextResponse.json(await readResponseBody(response), { status: response.status });
  } catch (error) {
    return errorResponse(error, "Signup failed.");
  }
}
