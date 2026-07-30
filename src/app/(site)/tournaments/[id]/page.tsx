import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTournamentDetail } from "@/features/tournaments/api";
import { getSessionToken } from "@/lib/auth/session";
import TournamentDetailClient from "./TournamentDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getTournamentDetail(id);
  if (result.kind !== "success") return { title: "Tournament | XeSports" };
  return { title: `${result.data.name} | XeSports`, description: result.data.shortDescription || `View ${result.data.name} tournament details.` };
}

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) notFound();
  const token = await getSessionToken();
  const result = await getTournamentDetail(id, token);
  if (result.kind === "not-found") notFound();
  if (result.kind === "error") return <section className="flex min-h-[70vh] items-center justify-center px-4 text-center"><div className="max-w-lg rounded-xl border border-red-500/20 bg-red-500/5 p-8"><h1 className="text-2xl font-bold">Tournament temporarily unavailable</h1><p className="mt-3 text-white/60">{result.error.message}</p></div></section>;
  if (result.kind !== "success") notFound();
  return <TournamentDetailClient initialTournament={result.data} isAuthenticated={Boolean(token)} />;
}
