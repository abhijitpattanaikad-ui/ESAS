"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, Gamepad2, Globe, MapPin, Monitor, Trophy, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ApiTournament } from "@/app/(types)/event";
import { Button, GlassCard, StatusBadge } from "@/components/ui";
import { htmlToSafeText, safeExternalUrl } from "@/features/tournaments/content";
import { deriveTournamentPhase, getCountdownParts, getCountdownTarget } from "@/features/tournaments/phase";
import { formatOnlineStatus, formatPrizePool, formatRegion } from "@/features/tournaments/presentation";
import { clientJson } from "@/lib/http/client";

const BracketView = dynamic(() => import("@/app/(components)/shared/BracketView").then((module) => module.BracketView), {
  ssr: false,
  loading: () => <div className="py-20 text-center text-slate-300/70">Loading bracket viewer…</div>,
});

const TABS = [
  { id: "OVERVIEW", label: "Overview" },
  { id: "PARTICIPANTS", label: "Participants" },
  { id: "RULES", label: "Rules" },
  { id: "BRACKET", label: "Bracket" },
] as const;

type Tab = (typeof TABS)[number]["id"];

const SCHEDULE_ITEMS = [
  ["Registration starts", "registrationStart"],
  ["Registration ends", "registrationEnd"],
  ["Tournament starts", "tournamentStart"],
  ["Tournament ends", "tournamentEnd"],
] as const;

function tabId(tab: Tab) {
  return `tournament-${tab.toLowerCase()}-tab`;
}

function panelId(tab: Tab) {
  return `tournament-${tab.toLowerCase()}-panel`;
}

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

  return (
    <GlassCard as="section" className="p-5">
      <h2 className="text-sm font-semibold text-slate-200">
        {label}
      </h2>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {Object.entries(parts).map(([key, value]) => (
          <div key={key} className="min-w-0 rounded-lg bg-black/20 px-1 py-3">
            <div className="text-lg font-black tabular-nums text-orange-300 sm:text-xl">{String(value).padStart(2, "0")}</div>
            <div className="mt-1 truncate text-xs font-semibold capitalize text-slate-300/70">{key}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
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
  const displayedPrizePool = formatPrizePool(tournament.prizePool);

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

  function selectAdjacentTab(event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % TABS.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = TABS.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = TABS[nextIndex].id;
    setTab(nextTab);
    document.getElementById(tabId(nextTab))?.focus();
  }

  return (
    <div className="min-h-screen bg-[var(--surface-page)] pb-20 text-white">
      <section className="relative h-80 w-full overflow-hidden sm:h-96" aria-labelledby="tournament-title">
        <Image src={banner} alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-[var(--surface-page)] via-[rgb(8_12_21_/_0.48)] to-black/60" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-between px-4 pb-8 pt-20 sm:px-6 sm:pb-10 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/55 backdrop-blur transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            aria-label="Go back"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="flex min-w-0 items-end gap-4 sm:gap-6">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-300/30 bg-black/60 shadow-[var(--shadow-public-card)] sm:h-28 sm:w-28">
              {tournament.assets.logo ? (
                <Image src={tournament.assets.logo} alt={`${tournament.name} logo`} fill className="object-cover" sizes="112px" />
              ) : (
                <span className="text-xl font-black italic sm:text-2xl">{tournament.name.slice(0, 4).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300 sm:text-sm">{tournament.game.name}</p>
              <h1 id="tournament-title" className="mt-2 text-3xl font-black leading-tight text-balance sm:text-5xl">
                {tournament.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)]">
          <aside aria-label="Tournament summary" className="min-w-0 space-y-6 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
            <GlassCard className="overflow-hidden border-orange-300/20 p-0">
              <div className="border-b border-white/10 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-300">Tournament status</p>
                  <StatusBadge status={tournament.status} />
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="flex items-center gap-2 text-slate-300/65"><Gamepad2 size={16} aria-hidden="true" />Mode</dt>
                    <dd className="mt-1 font-semibold text-white">{tournament.mode || "TBA"}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-slate-300/65"><Monitor size={16} aria-hidden="true" />Platform</dt>
                    <dd className="mt-1 font-semibold text-white">{tournament.platform || "TBA"}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-slate-300/65"><Globe size={16} aria-hidden="true" />Location</dt>
                    <dd className="mt-1 font-semibold text-white">{formatOnlineStatus(tournament.isOnline)}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-slate-300/65"><Users size={16} aria-hidden="true" />Listed players</dt>
                    <dd className="mt-1 font-semibold text-white">{tournament.participatedPlayers ? tournament.participatedPlayers.length : "Not listed"}</dd>
                  </div>
                </dl>

                {(tournament.city || tournament.country) && (
                  <p className="mt-5 flex items-start gap-2 border-t border-white/10 pt-4 text-sm text-slate-200/80">
                    <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-orange-300" />
                    {[tournament.city, tournament.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>

              <div aria-busy={pending !== null} aria-live="polite" className="p-5 sm:p-6">
                {hasJoined ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => void mutate("leave")}
                    disabled={pending !== null || phase === "COMPLETED"}
                  >
                    {pending === "leave" ? "LEAVING…" : "LEAVE"}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => void mutate("join")}
                    disabled={pending !== null || !registrationOpen}
                  >
                    {pending === "join" ? "JOINING…" : registrationOpen ? "JOIN TOURNAMENT" : "REGISTRATION CLOSED"}
                  </Button>
                )}
              </div>
            </GlassCard>

            <Countdown tournament={tournament} />

            <GlassCard as="section" className="p-5 sm:p-6">
              <h2 id="tournament-schedule-heading" className="text-lg font-bold">Schedule</h2>
              <dl className="mt-4 divide-y divide-white/10">
                {SCHEDULE_ITEMS.map(([label, key]) => (
                  <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-slate-300/70">{label}</dt>
                      <dd className="mt-1 text-sm font-bold leading-5 text-white">{formatDateTime(tournament.schedule[key])}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </GlassCard>

            {displayedPrizePool !== null && (
              <GlassCard as="section" className="p-6 text-center">
                <Trophy className="mx-auto mb-2 text-orange-300" aria-hidden="true" />
                <div className="text-3xl font-black text-orange-300">{displayedPrizePool}</div>
                <h2 className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-300/65">Prize pool</h2>
              </GlassCard>
            )}

            <GlassCard as="section" className="p-5 sm:p-6">
              <h2 id="tournament-eligibility-heading" className="text-lg font-bold">Eligibility</h2>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200/75">
                <p><strong className="text-white">Region:</strong> {formatRegion(tournament.regions)}</p>
                {tournament.allowedCountries?.length ? <p><strong className="text-white">Countries:</strong> {tournament.allowedCountries.join(", ")}</p> : null}
                <p className="flex items-start gap-2">
                  <Users size={15} aria-hidden="true" className="mt-1 shrink-0" />
                  Participation is subject to organizer approval and server-side eligibility checks.
                </p>
              </div>
            </GlassCard>

            <Link href="/tournaments" className="block rounded-md text-center text-sm font-semibold text-orange-300 underline decoration-orange-300/50 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300">
              Explore other tournaments
            </Link>
          </aside>

          <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
            <div
              role="tablist"
              aria-label="Tournament information"
              className="flex gap-1 overflow-x-auto border-b border-white/10"
            >
              {TABS.map((item, index) => (
                <button
                  key={item.id}
                  id={tabId(item.id)}
                  type="button"
                  role="tab"
                  aria-controls={panelId(item.id)}
                  aria-selected={tab === item.id}
                  tabIndex={tab === item.id ? 0 : -1}
                  onClick={() => setTab(item.id)}
                  onKeyDown={(event) => selectAdjacentTab(event, index)}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-300 ${tab === item.id ? "border-orange-400 text-white" : "border-transparent text-slate-300/65 hover:text-white"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div
              id={panelId("OVERVIEW")}
              role="tabpanel"
              aria-labelledby={tabId("OVERVIEW")}
              tabIndex={0}
              hidden={tab !== "OVERVIEW"}
            >
              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-xl font-bold sm:text-2xl">About this tournament</h2>
                {description ? (
                  <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-7 text-slate-200/80">{description}</p>
                ) : (
                  <p className="mt-4 max-w-3xl text-slate-300/70">Tournament information will be published here.</p>
                )}
              </GlassCard>
            </div>

            <div
              id={panelId("PARTICIPANTS")}
              role="tabpanel"
              aria-labelledby={tabId("PARTICIPANTS")}
              tabIndex={0}
              hidden={tab !== "PARTICIPANTS"}
            >
              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-xl font-bold sm:text-2xl">Participants</h2>
                {tournament.participatedPlayers?.length ? (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {tournament.participatedPlayers.map((player, index) => (
                      <li key={player._id ?? `${player.username}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
                          {player.profileImage ? (
                            <Image src={player.profileImage} alt="" width={40} height={40} className="h-full w-full object-cover" />
                          ) : (
                            <span className="font-bold">{player.username?.charAt(0).toUpperCase() || "?"}</span>
                          )}
                        </div>
                        <span className="truncate font-semibold">{player.username || "Player"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 py-8 text-center text-slate-300/70">No participants are listed yet.</p>
                )}
              </GlassCard>
            </div>

            <div
              id={panelId("RULES")}
              role="tabpanel"
              aria-labelledby={tabId("RULES")}
              tabIndex={0}
              hidden={tab !== "RULES"}
            >
              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-xl font-bold sm:text-2xl">Tournament rules</h2>
                {rules ? (
                  <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-7 text-slate-200/80">{rules}</p>
                ) : (
                  <p className="mt-4 max-w-3xl text-slate-300/70">Rules will be published before competition begins.</p>
                )}
                {rulesLink && (
                  <a
                    href={rulesLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex rounded-md font-semibold text-orange-300 underline decoration-orange-300/50 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                  >
                    View official rules document
                  </a>
                )}
              </GlassCard>
            </div>

            <div
              id={panelId("BRACKET")}
              role="tabpanel"
              aria-labelledby={tabId("BRACKET")}
              tabIndex={0}
              hidden={tab !== "BRACKET"}
            >
              <GlassCard className="p-4 sm:p-6">
                <h2 id="tournament-bracket-heading" className="px-2 text-xl font-bold sm:text-2xl">Tournament bracket</h2>
                <div
                  role="region"
                  aria-labelledby="tournament-bracket-heading"
                  tabIndex={0}
                  className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/20 px-2 pb-2"
                >
                  {tab === "BRACKET" && tournament._id ? (
                    <BracketView tournamentId={tournament._id} format={tournament.format} />
                  ) : tab === "BRACKET" ? (
                    <p className="p-8 text-center text-slate-300/70">The bracket is not available yet.</p>
                  ) : null}
                </div>
              </GlassCard>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
