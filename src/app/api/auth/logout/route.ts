import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";
import { rejectCrossOriginMutation } from "@/lib/http/route";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
