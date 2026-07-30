import { NextResponse } from "next/server";
import { normalizeForgotPasswordResponse } from "@/features/auth/forgot-password";
import { errorResponse, readJsonRequest, rejectCrossOriginMutation } from "@/lib/http/route";
import { upstreamFetch } from "@/lib/http/upstream";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const body = await readJsonRequest(request);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }
  try {
    const response = await upstreamFetch("/v1/user/sendpasswordresetmail", {
      method: "POST",
      body: JSON.stringify({ data: { email } }),
      allowErrorResponse: true,
    });
    const publicResult = normalizeForgotPasswordResponse(response.status);
    return NextResponse.json({ message: publicResult.message }, { status: publicResult.status });
  } catch (error) {
    return errorResponse(error, "Could not request a reset link.");
  }
}
