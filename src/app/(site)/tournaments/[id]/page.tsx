import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui";
import { getTournamentDetail } from "@/features/tournaments/api";
import { getSessionToken } from "@/lib/auth/session";
import TournamentDetailClient from "./TournamentDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getTournamentDetail(id);
  if (result.kind !== "success") return { title: "Tournament" };
  return { title: result.data.name, description: result.data.shortDescription || `View ${result.data.name} tournament details.` };
}

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) notFound();
  const token = await getSessionToken();
  const result = await getTournamentDetail(id, token);
  if (result.kind === "not-found") notFound();
  if (result.kind === "error") {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[var(--surface-page)] px-4 text-center">
        <GlassCard as="div" className="max-w-lg border-orange-400/25 p-8">
          <div role="alert">
            <h1 className="text-2xl font-bold">Tournament temporarily unavailable</h1>
            <p className="mt-3 text-slate-200/70">{result.error.message}</p>
          </div>
        </GlassCard>
      </section>
    );
  }
  if (result.kind !== "success") notFound();
  return <TournamentDetailClient initialTournament={result.data} isAuthenticated={Boolean(token)} />;
}
