"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, Gamepad2, Globe, MapPin, Monitor, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import type { ApiTournament } from "@/app/(types)/event";
import { ExGlowButton } from "@/app/(components)/ui";
import { clientJson } from "@/lib/http/client";
import { deriveTournamentPhase, getCountdownParts, getCountdownTarget } from "@/features/tournaments/phase";
import { htmlToSafeText, safeExternalUrl } from "@/features/tournaments/content";

const BracketView = dynamic(() => import("@/app/(components)/shared/BracketView").then((module) => module.BracketView), {
  ssr: false,
  loading: () => <div className="py-20 text-center text-white/50">Loading bracket viewer…</div>,
});

type Tab = "OVERVIEW" | "PARTICIPANTS" | "RULES" | "BRACKET";

function formatDateTime(value?: string) {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";
  return new Intl.DateTimeFormat("en-AE", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai" }).format(date);
}

function Countdown({ tournament }: { tournament: ApiTournament }) {
  const [now, setNow] = useState(() => new Date());
  const phase = deriveTournamentPhase(tournament.schedule, now);
  const target = getCountdownTarget(tournament.schedule, phase);
  useEffect(() => {
    if (!target) return;
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  if (!target) return null;
  const date = new Date(target);
  if (Number.isNaN(date.getTime())) return null;
  const parts = getCountdownParts(now, date);
  const label = phase === "REGISTRATION_OPEN" ? "Registration closes in" : phase === "REGISTRATION_CLOSED" ? "Tournament starts in" : phase === "TOURNAMENT_ACTIVE" ? "Tournament ends in" : "Registration opens in";
  return <div className="rounded-xl border border-white/10 bg-black/30 p-4"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">{label}</p><div className="grid grid-cols-4 gap-2 text-center">{Object.entries(parts).map(([key, value]) => <div key={key}><div className="text-xl font-black text-jaffa-500">{String(value).padStart(2, "0")}</div><div className="text-[10px] uppercase text-white/40">{key}</div></div>)}</div></div>;
}

export default function TournamentDetailClient({ initialTournament, isAuthenticated }: { initialTournament: ApiTournament; isAuthenticated: boolean }) {
  const router = useRouter();
  const [tournament, setTournament] = useState(initialTournament);
  const [tab, setTab] = useState<Tab>("OVERVIEW");
  const [pending, setPending] = useState<"join" | "leave" | null>(null);
  const phase = useMemo(() => deriveTournamentPhase(tournament.schedule), [tournament.schedule]);
  const hasJoined = Boolean(tournament.joinStatus && tournament.joinStatus !== "not-joined");
  const registrationOpen = phase === "REGISTRATION_OPEN";
  const description = htmlToSafeText(tournament.description || tournament.shortDescription);
  const rules = htmlToSafeText(tournament.rules);
  const rulesLink = safeExternalUrl(tournament.rulesLink);
  const banner = tournament.assets.desktopBanner || tournament.assets.mobileBanner || tournament.assets.thumbnail || "/images/byClient/bg-secondary.jpg";

  async function refreshTournament() {
    if (!tournament._id) return;
    const result = await clientJson<ApiTournament>(`/api/tournaments/${encodeURIComponent(tournament._id)}`, { cache: "no-store" });
    if (result.ok) setTournament(result.data);
  }

  async function mutate(action: "join" | "leave") {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/tournaments/${tournament._id ?? ""}`)}`);
      return;
    }
    if (!tournament._id || pending) return;
    setPending(action);
    try {
      const result = await clientJson(`/api/tournaments/${encodeURIComponent(tournament._id)}/${action}`, { method: "POST" });
      if (result.status === 401) {
        router.push("/login");
        return;
      }
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(action === "join" ? "You joined the tournament." : "You left the tournament.");
      await refreshTournament();
      router.refresh();
    } catch {
      toast.error("The request could not be completed. Please retry.");
    } finally {
      setPending(null);
    }
  }

  return <main className="min-h-screen bg-background pb-20 text-white">
    <section className="relative h-52 w-full overflow-hidden md:h-96">
      <Image src={banner} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-black/20" />
      <div className="container absolute inset-0 mx-auto flex flex-col justify-between p-4 md:p-8">
        <button type="button" onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/50 backdrop-blur" aria-label="Go back"><ChevronLeft /></button>
        <div className="flex items-end gap-5">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-jaffa-500/30 bg-black/60 md:h-36 md:w-36">
            {tournament.assets.logo ? <Image src={tournament.assets.logo} alt={`${tournament.name} logo`} fill className="object-cover" sizes="144px" /> : <span className="text-2xl font-black italic">{tournament.name.slice(0, 4).toUpperCase()}</span>}
          </div>
          <div className="pb-2"><p className="text-sm font-bold uppercase tracking-widest text-jaffa-400">{tournament.game.name}</p><h1 className="text-3xl font-black uppercase leading-tight md:text-5xl">{tournament.name}</h1></div>
        </div>
      </div>
    </section>

    <section className="container mx-auto px-4 py-8 md:px-8">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2"><Gamepad2 size={16} />{tournament.mode || "Mode TBA"}</span>
            <span className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2"><Monitor size={16} />{tournament.platform || "Platform TBA"}</span>
            <span className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2"><Globe size={16} />{tournament.isOnline === false ? "Offline" : "Online"}</span>
            {(tournament.city || tournament.country) && <span className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2"><MapPin size={16} />{[tournament.city, tournament.country].filter(Boolean).join(", ")}</span>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-woodsmoke-900/40 p-4">
            <div><p className="text-xs uppercase tracking-wider text-white/40">Status</p><p className="font-bold text-jaffa-400">{tournament.status}</p></div>
            {hasJoined ? <ExGlowButton onClick={() => void mutate("leave")} disabled={pending !== null || phase === "COMPLETED"}>{pending === "leave" ? "LEAVING…" : "LEAVE"}</ExGlowButton> : <ExGlowButton onClick={() => void mutate("join")} disabled={pending !== null || !registrationOpen}>{pending === "join" ? "JOINING…" : registrationOpen ? "JOIN TOURNAMENT" : "REGISTRATION CLOSED"}</ExGlowButton>}
          </div>
          <nav className="flex gap-1 overflow-x-auto border-b border-white/10" aria-label="Tournament information">{(["OVERVIEW", "PARTICIPANTS", "RULES", "BRACKET"] as Tab[]).map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${tab === item ? "border-jaffa-500 text-white" : "border-transparent text-white/40 hover:text-white"}`} aria-current={tab === item ? "page" : undefined}>{item}</button>)}</nav>
          {tab === "OVERVIEW" && <section className="rounded-xl border border-white/5 bg-woodsmoke-900/40 p-6"><h2 className="mb-4 text-xl font-bold">About this tournament</h2>{description ? <p className="whitespace-pre-wrap leading-7 text-white/75">{description}</p> : <p className="text-white/50">Tournament information will be published here.</p>}</section>}
          {tab === "PARTICIPANTS" && <section className="rounded-xl border border-white/5 bg-woodsmoke-900/40 p-6"><h2 className="mb-6 text-xl font-bold">Participants</h2>{tournament.participatedPlayers?.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tournament.participatedPlayers.map((player, index) => <div key={player._id ?? `${player.username}-${index}`} className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/30 p-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10">{player.profileImage ? <Image src={player.profileImage} alt="" width={40} height={40} className="h-full w-full object-cover" /> : <span className="font-bold">{player.username?.charAt(0).toUpperCase() || "?"}</span>}</div><span className="truncate font-bold">{player.username || "Player"}</span></div>)}</div> : <p className="py-8 text-center text-white/50">No participants are listed yet.</p>}</section>}
          {tab === "RULES" && <section className="rounded-xl border border-white/5 bg-woodsmoke-900/40 p-6">{rules ? <p className="whitespace-pre-wrap leading-7 text-white/75">{rules}</p> : <p className="text-white/50">Rules will be published before competition begins.</p>}{rulesLink && <a href={rulesLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-bold text-jaffa-500 underline">View official rules document</a>}</section>}
          {tab === "BRACKET" && tournament._id && <section className="rounded-xl border border-white/5 bg-woodsmoke-900/40 p-4 md:p-8"><BracketView tournamentId={tournament._id} format={tournament.format} /></section>}
        </div>
        <aside className="space-y-6 lg:col-span-4">
          <Countdown tournament={tournament} />
          <section><h2 className="mb-4 text-xl font-bold">Schedule</h2><div className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-woodsmoke-900/30">{[["Registration starts", tournament.schedule.registrationStart], ["Registration ends", tournament.schedule.registrationEnd], ["Tournament starts", tournament.schedule.tournamentStart], ["Tournament ends", tournament.schedule.tournamentEnd]].map(([label, value]) => <div key={label} className="flex items-center gap-3 p-4"><Calendar className="h-5 w-5 text-jaffa-500" /><div><div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</div><div className="mt-0.5 text-sm font-bold">{formatDateTime(value)}</div></div></div>)}</div></section>
          {tournament.prizePool && <section className="rounded-xl border border-white/10 bg-woodsmoke-900/30 p-6 text-center"><Trophy className="mx-auto mb-2 text-jaffa-500" /><div className="text-3xl font-black text-jaffa-500">{Number(tournament.prizePool).toLocaleString()}</div><div className="text-xs font-bold uppercase text-gray-500">Prize Pool</div></section>}
          <section className="rounded-xl border border-white/10 bg-woodsmoke-900/30 p-5"><h2 className="mb-3 text-lg font-bold">Eligibility</h2><div className="space-y-2 text-sm text-white/65"><p><strong className="text-white">Region:</strong> {tournament.regions || "Any"}</p>{tournament.allowedCountries?.length ? <p><strong className="text-white">Countries:</strong> {tournament.allowedCountries.join(", ")}</p> : null}<p className="inline-flex items-center gap-2"><Users size={15} />Participation is subject to organizer approval and server-side eligibility checks.</p></div></section>
          <Link href="/tournaments" className="block text-center text-sm text-jaffa-500 underline">Explore other tournaments</Link>
        </aside>
      </div>
    </section>
  </main>;
}
