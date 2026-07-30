import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { errorResponse, rejectCrossOriginMutation } from "@/lib/http/route";
import { readResponseBody } from "@/lib/http/response";
import { upstreamFetch } from "@/lib/http/upstream";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ message: "Log in to join this tournament." }, { status: 401 });
  const { id } = await context.params;
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) return NextResponse.json({ message: "Invalid tournament identifier." }, { status: 400 });
  try {
    const response = await upstreamFetch("/v1/tournament/join", { method: "POST", token, body: JSON.stringify({ criteria: { _id: id } }), allowErrorResponse: true });
    return NextResponse.json(await readResponseBody(response), { status: response.status });
  } catch (error) { return errorResponse(error, "Could not join tournament."); }
}
