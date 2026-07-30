import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { getBracket } from "@/features/brackets/api";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) return NextResponse.json({ kind: "error", error: { code: "INVALID_ID", message: "Invalid tournament identifier." } }, { status: 400 });
  const result = await getBracket(id, await getSessionToken());
  return NextResponse.json(result, { status: result.kind === "error" ? 502 : 200 });
}
