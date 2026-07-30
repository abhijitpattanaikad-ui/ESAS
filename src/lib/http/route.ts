import { NextResponse } from "next/server";
import { isUpstreamError } from "./errors";
import { isSameOriginMutation } from "./origin";

export function errorResponse(error: unknown, fallback = "Request failed."): NextResponse {
  if (isUpstreamError(error)) {
    const status = error.status >= 400 && error.status <= 599 ? error.status : 502;
    return NextResponse.json({ message: error.message, code: error.code }, { status });
  }
  console.error("Unhandled route error", error);
  return NextResponse.json({ message: fallback, code: "INTERNAL_ERROR" }, { status: 500 });
}

export async function readJsonRequest(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const value = await request.json();
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export function rejectCrossOriginMutation(request: Request): NextResponse | null {
  return isSameOriginMutation(request)
    ? null
    : NextResponse.json({ message: "Cross-origin request rejected." }, { status: 403 });
}
