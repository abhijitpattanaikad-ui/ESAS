"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { bracketService } from "@/app/(services)/bracketService";
import type { BracketData, BracketResult } from "@/features/brackets/types";
import type { BracketMatch as UiBracketMatch } from "./brackets/BracketShared";
import { SingleElimination } from "./brackets/SingleElimination";
import { DoubleElimination } from "./brackets/DoubleElimination";
import { RoundRobin } from "./brackets/RoundRobin";

function toUiMatches(matches: BracketData["matches"]): UiBracketMatch[] {
  return matches.map((match) => ({
    id: match.id,
    nextMatchId: match.nextMatchId,
    nextLooserMatchId: match.nextLooserMatchId,
    tournamentRoundText: match.tournamentRoundText,
    seriesText: match.seriesText,
    startTime: match.startTime ?? undefined,
    state: match.state,
    participants: match.participants,
  }));
}

export function BracketView({ tournamentId }: { tournamentId: string; format?: string }) {
  const [result, setResult] = useState<BracketResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setResult(await bracketService.getBracketsByTournamentId(tournamentId));
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  async function toggleFullscreen() {
    if (!containerRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await containerRef.current.requestFullscreen();
  }

  if (loading) return <div className="flex flex-col items-center justify-center px-4 py-20" role="status"><Loader2 className="mb-4 h-10 w-10 animate-spin text-jaffa-500" /><p className="font-medium text-gray-400">Loading bracket…</p></div>;
  if (!result || result.kind === "error") return <div className="flex flex-col items-center justify-center px-4 py-20 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10"><AlertCircle className="h-8 w-8 text-red-500" /></div><h3 className="mb-2 text-xl font-bold text-white">Bracket unavailable</h3><p className="max-w-sm text-gray-500">{result?.kind === "error" ? result.error.message : "Bracket information could not be loaded."}</p><button type="button" onClick={() => void load()} className="mt-5 inline-flex items-center gap-2 rounded-md border border-jaffa-500/40 px-4 py-2 text-sm text-jaffa-400"><RefreshCw size={15} />Retry</button></div>;
  if (result.kind === "empty") return <div className="py-20 text-center text-gray-500">The bracket has not been generated yet.</div>;

  const data = result.data;
  return <div className="min-w-[48rem] w-full"><div className="mb-6 flex items-center gap-3"><div className="h-8 w-1 rounded-full bg-jaffa-500" /><h2 className="flex-1 text-2xl font-black uppercase tracking-tighter text-white">{data.type.replaceAll("-", " ")}</h2><button type="button" onClick={() => void toggleFullscreen()} className="inline-flex items-center gap-2 rounded-lg border border-jaffa-500/40 px-3 py-2 text-xs font-bold text-gray-300" aria-label={isFullscreen ? "Exit bracket fullscreen" : "View bracket fullscreen"}>{isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}{isFullscreen ? "Exit" : "Fullscreen"}</button></div><div ref={containerRef} className="relative min-h-[600px] w-full overflow-auto rounded-xl border border-white/5 bg-[#0b0f18] p-4">{data.type === "single-elimination" && <SingleElimination matches={toUiMatches(data.matches)} />}{data.type === "double-elimination" && <DoubleElimination upperMatches={toUiMatches(data.upperMatches ?? data.matches)} lowerMatches={toUiMatches(data.lowerMatches ?? [])} />}{data.type === "round-robin" && <RoundRobin standings={data.standings ?? []} />}</div></div>;
}
