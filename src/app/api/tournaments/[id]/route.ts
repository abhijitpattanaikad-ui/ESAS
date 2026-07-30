import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { getTournamentDetail } from "@/features/tournaments/api";

function validId(id: string) { return /^[A-Za-z0-9_-]{1,128}$/.test(id); }

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!validId(id)) return NextResponse.json({ message: "Invalid tournament identifier." }, { status: 400 });
  const result = await getTournamentDetail(id, await getSessionToken());
  if (result.kind === "success") return NextResponse.json(result.data);
  if (result.kind === "not-found") return NextResponse.json({ message: "Tournament not found." }, { status: 404 });
  if (result.kind === "error") return NextResponse.json({ message: result.error.message, code: result.error.code }, { status: result.error.status ?? 502 });
  return NextResponse.json({ message: "Tournament unavailable." }, { status: 502 });
}
