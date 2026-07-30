import { NextResponse } from "next/server";
import { errorResponse, readJsonRequest, rejectCrossOriginMutation } from "@/lib/http/route";
import { readResponseBody } from "@/lib/http/response";
import { upstreamFetch } from "@/lib/http/upstream";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const body = await readJsonRequest(request);
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  if (!token) return NextResponse.json({ message: "Verification token is required." }, { status: 400 });
  try {
    const response = await upstreamFetch("/v1/user/verify/email", {
      method: "GET",
      token,
      allowErrorResponse: true,
    });
    return NextResponse.json(await readResponseBody(response), { status: response.status });
  } catch (error) {
    return errorResponse(error, "Email verification failed.");
  }
}
