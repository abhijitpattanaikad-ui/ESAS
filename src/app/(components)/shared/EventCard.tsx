"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ExGlowButton,
  ExIconGlobe,
  ExIconPrizePool,
  ExIconTournamentType,
  ExIconTrophy,
} from "@/app/(components)/ui";
import type { ApiTournament, ApiTournamentStatus } from "@/app/(types)/event";

const STATUS_CONFIG: Record<ApiTournamentStatus, { label: string; className: string }> = {
  Upcoming: {
    label: "Upcoming",
    className: "bg-blue-600 text-white border-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.7)]",
  },
  "Registration Open": {
    label: "Registration open",
    className: "bg-emerald-600 text-white border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.7)]",
  },
  "Starting Soon": {
    label: "Starting soon",
    className: "bg-orange-500 text-white border-orange-300 shadow-[0_0_14px_rgba(249,115,22,0.8)]",
  },
  Ongoing: {
    label: "Ongoing",
    className: "bg-purple-600 text-white border-purple-400 shadow-[0_0_18px_rgba(147,51,234,0.9)]",
  },
  Completed: {
    label: "Completed",
    className: "bg-gray-700 text-gray-300 border-gray-500",
  },
  "Status unavailable": {
    label: "Status unavailable",
    className: "bg-gray-900 text-gray-200 border-gray-600",
  },
};

function formatDate(iso?: string): string {
  if (!iso) return "Date TBA";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Date TBA";
  return new Intl.DateTimeFormat("en-AE", {
    timeZone: "Asia/Dubai",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatPrizePool(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString("en-AE") : String(value);
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
}) => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const bannerSrc = assets.thumbnail || game.assets?.thumbnail || assets.desktopBanner || "";
  const statusConfig = STATUS_CONFIG[status];
  const context = [heading, text].filter(Boolean).join(" ");

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      className="group relative w-full max-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#1a0f0a] via-[#5c2a12] to-[#2d140a] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition hover:border-jaffa-500/50 hover:shadow-[0_0_25px_rgba(249,115,22,0.25)] sm:w-[260px] sm:max-w-none 2xl:w-[300px]"
    >
      <div className="relative h-40 w-full overflow-hidden">
        {bannerSrc ? (
          <Image
            src={bannerSrc}
            alt={`${name} tournament banner`}
            fill
            className="object-cover object-center transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105 motion-reduce:group-hover:scale-100"
            sizes="(max-width: 640px) 280px, (max-width: 1536px) 260px, 300px"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-orange-900/60 to-red-950" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#2e0707]/90 via-[#2e0707]/10 to-transparent" />
        <span className={`absolute left-2 top-2 inline-flex min-h-6 items-center justify-center rounded-full border px-3 text-[10px] font-bold leading-none backdrop-blur-md ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="flex flex-col bg-linear-to-b from-white/5 to-transparent text-white">
        <div className="flex w-full flex-col items-start gap-1 overflow-hidden p-3">
          <p className="w-full truncate text-xs uppercase tracking-wide text-[#BDBDBD]" title={game.name}>
            {game.name}
          </p>
          <h2 className="w-full truncate text-start text-base font-bold leading-tight" title={name}>
            {name}
          </h2>

          {context ? (
            <div className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-white/80">
              <ExIconGlobe className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{context}</span>
            </div>
          ) : null}

          {prizePool !== undefined && prizePool !== "" ? (
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#BDBDBD]">
              <ExIconPrizePool className="h-3.5 w-3.5 text-jaffa-500" />
              <span>Prize pool: <strong className="text-white">{formatPrizePool(prizePool)}</strong></span>
            </div>
          ) : null}

          {mode ? (
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#BDBDBD]">
              <ExIconTournamentType className="h-3.5 w-3.5 text-jaffa-500" />
              <span>Mode: <strong className="text-white">{mode === "duelSolo" ? "1v1" : mode}</strong></span>
            </div>
          ) : null}

          <div className="mt-2 flex w-full items-end justify-between">
            {game.assets?.thumbnail ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-md border border-white/10">
                <Image
                  src={game.assets.thumbnail}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            ) : <span />}

            <div className="origin-right scale-75">
              <ExGlowButton disabled={!_id} onClick={() => _id && router.push(`/tournaments/${encodeURIComponent(_id)}`)}>
                {_id ? "Explore" : "Unavailable"}
              </ExGlowButton>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-linear-to-r from-[#2d140a] to-[#421d0a] px-4 py-2.5 text-[11px] font-medium text-white">
          <span>
            <ExIconTrophy className="mr-1 inline h-3.5 w-3.5 text-orange-300" />
            {formatDate(schedule.tournamentStart)}
          </span>
          <span className="text-[#BDBDBD]">Ends {formatDate(schedule.tournamentEnd)}</span>
        </div>
      </div>
    </motion.article>
  );
};
