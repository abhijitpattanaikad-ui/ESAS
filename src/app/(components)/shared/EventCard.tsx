"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { CalendarDays, Gamepad2, Monitor, Trophy, UsersRound } from "lucide-react";
import type { ApiTournament, ApiTournamentStatus } from "@/app/(types)/event";
import { Button, GlassCard, StatusBadge } from "@/components/ui";
import { formatTeamFormat } from "@/features/tournaments/presentation";

const STATUS_ACCENT_CLASSES: Record<ApiTournamentStatus, string> = {
  Upcoming: "hover:border-sky-300/50",
  Ongoing: "hover:border-violet-300/50",
  Completed: "hover:border-slate-300/40",
  "Registration Open": "hover:border-emerald-300/50",
  "Starting Soon": "hover:border-orange-300/60",
  "Status unavailable": "hover:border-slate-400/40",
};

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-AE", {
    timeZone: "Asia/Dubai",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatDateWindow(start?: string, end?: string): string | null {
  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);
  if (formattedStart && formattedEnd) return `${formattedStart} – ${formattedEnd}`;
  if (formattedStart) return `Starts ${formattedStart}`;
  if (formattedEnd) return `Ends ${formattedEnd}`;
  return null;
}

function formatPrizePool(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString("en-AE") : String(value);
}

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetadataItem({ icon, label, value }: MetadataItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-orange-300">{icon}</span>
      <div className="min-w-0">
        <dt className="text-[0.68rem] font-bold uppercase tracking-[0.13em] text-slate-400">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-medium text-slate-100" title={value}>{value}</dd>
      </div>
    </div>
  );
}

export interface EventCardProps extends ApiTournament {
  index?: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  _id,
  name,
  game,
  assets,
  schedule,
  status,
  heading,
  text,
  prizePool,
  mode,
  format,
  platform,
}) => {
  const router = useRouter();
  const bannerSrc = assets.thumbnail || game.assets?.thumbnail || assets.desktopBanner || "";
  const context = [heading, text].filter(Boolean).join(" ");
  const dateWindow = formatDateWindow(schedule.tournamentStart, schedule.tournamentEnd);
  const teamFormat = formatTeamFormat(format, mode);
  const displayedPrizePool = prizePool !== undefined
    && (typeof prizePool === "number" || prizePool.trim() !== "")
    ? formatPrizePool(prizePool)
    : null;

  return (
    <GlassCard as="article" className={`group flex h-full min-w-0 flex-col overflow-hidden p-0 transition-colors ${STATUS_ACCENT_CLASSES[status]}`}>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-linear-to-br from-orange-950 to-slate-950">
        {bannerSrc ? (
          <Image
            src={bannerSrc}
            alt={`${name} tournament banner`}
            fill
            className="object-cover object-center transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105 motion-reduce:group-hover:scale-100"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
        <StatusBadge status={status} className="absolute left-4 top-4 backdrop-blur-md" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-300">{game.name}</p>
          <h2 className="mt-2 text-xl font-bold leading-tight text-white">{name}</h2>
          {context ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300/80">{context}</p> : null}
        </div>

        <dl className="mt-5 grid gap-4 border-y border-white/10 py-4 sm:grid-cols-2">
          <MetadataItem icon={<Gamepad2 className="h-4 w-4" />} label="Game" value={game.name} />
          {dateWindow ? <MetadataItem icon={<CalendarDays className="h-4 w-4" />} label="Dates" value={dateWindow} /> : null}
          {platform ? <MetadataItem icon={<Monitor className="h-4 w-4" />} label="Platform" value={platform} /> : null}
          {teamFormat ? <MetadataItem icon={<UsersRound className="h-4 w-4" />} label="Team format" value={teamFormat} /> : null}
          {displayedPrizePool ? <MetadataItem icon={<Trophy className="h-4 w-4" />} label="Prize pool" value={displayedPrizePool} /> : null}
        </dl>

        <Button
          className="mt-5 w-full"
          disabled={!_id}
          onClick={() => _id && router.push(`/tournaments/${encodeURIComponent(_id)}`)}
        >
          View tournament
        </Button>
      </div>
    </GlassCard>
  );
};
