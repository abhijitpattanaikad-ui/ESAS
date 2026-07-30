import { NextResponse } from "next/server";
import { parseProfileUpdatePayload } from "@/features/profile/contracts";
import { getSessionToken } from "@/lib/auth/session";
import { errorResponse, readJsonRequest, rejectCrossOriginMutation } from "@/lib/http/route";
import { readResponseBody } from "@/lib/http/response";
import { upstreamFetch } from "@/lib/http/upstream";

async function requireToken() {
  return await getSessionToken();
}

export async function GET() {
  const token = await requireToken();
  if (!token) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  try {
    const response = await upstreamFetch("/v1/user/getuserinfo", { token, allowErrorResponse: true });
    return NextResponse.json(await readResponseBody(response), { status: response.status });
  } catch (error) {
    return errorResponse(error, "Could not load profile.");
  }
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const token = await requireToken();
  if (!token) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const body = await readJsonRequest(request);
  const profileData = parseProfileUpdatePayload(body?.data);
  if (!profileData) return NextResponse.json({ message: "Profile data is incomplete or invalid." }, { status: 400 });
  try {
    const response = await upstreamFetch("/v1/user/update/profile", {
      method: "POST",
      token,
      body: JSON.stringify({ data: profileData }),
      allowErrorResponse: true,
    });
    return NextResponse.json(await readResponseBody(response), { status: response.status });
  } catch (error) {
    return errorResponse(error, "Could not update profile.");
  }
}
