// src/app/(components)/shared/EventCard.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ExIconTrophy,
  ExIconGlobe,
  ExGlowButton,
  ExIconPrizePool,
  ExIconTournamentType,
} from "@/app/(components)/ui";
import type { ApiTournament, ApiTournamentStatus } from "@/app/(types)/event";

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApiTournamentStatus,
  { label: string; className: string }
> = {
  Upcoming: {
    label: "Upcoming",
    className: "bg-blue-600 text-white border-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.7)] backdrop-blur-md font-bold",
  },
  "Registration Open": {
    label: "Registration Open",
    className: "bg-emerald-600 text-white border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.7)] backdrop-blur-md font-bold",
  },
  "Starting Soon": {
    label: "Starting Soon",
    className: "bg-orange-500 text-white border-orange-300 shadow-[0_0_14px_rgba(249,115,22,0.8)] backdrop-blur-md font-bold",
  },
  Ongoing: {
    label: "Ongoing",
    className: "bg-purple-600 text-white border-purple-400 shadow-[0_0_18px_rgba(147,51,234,0.9)] font-bold animate-pulse backdrop-blur-md",
  },
  Completed: {
    label: "Completed",
    className: "bg-gray-700 text-gray-300 border-gray-500 shadow-[0_0_8px_rgba(100,100,100,0.4)] backdrop-blur-md font-semibold",
  },
};

// ─── Date formatter ───────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  buttonText,
  index = 0,
}) => {
  const router = useRouter();

  const bannerSrc =
    assets?.thumbnail || game?.assets?.thumbnail || assets?.desktopBanner || "";

  const statusCfg =
    STATUS_CONFIG[status] ?? STATUS_CONFIG["Upcoming"];

  const handleJoin = () => {
    if (_id) {
      router.push(`/tournaments/${_id}`);
    } else {
      router.push(`/tournaments/${game?.shortName || "event"}-${index + 1}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className="
        group relative rounded-2xl overflow-hidden
        bg-linear-to-br from-[#1a0f0a] via-[#5c2a12] to-[#2d140a]
        border border-white/10
        hover:border-jaffa-500/50 transition-all duration-300
        shadow-[0_8px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]
        w-full sm:w-[260px] 2xl:w-[300px] max-w-[300px] sm:max-w-none
      "
    >
      {/* ── Banner Image ── */}
      <div className="relative w-full h-40 overflow-hidden">
        {bannerSrc ? (
          <Image
            src={bannerSrc}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-orange-900/60 to-red-950" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#2e0707]/90 via-[#2e0707]/10 to-transparent" />

        {/* Status pill over image */}
        <span
          className={`absolute top-2 left-2 text-[10px] font-semibold inline-flex items-center justify-center py-1 rounded-full border w-[110px] leading-none ${statusCfg.className}`}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col text-white bg-linear-to-b from-white/5 to-transparent">
        <div className="p-2 flex flex-col items-start gap-1 w-full overflow-hidden">
          {/* Game label */}
          <p className="w-full text-xs uppercase tracking-wide text-[#BDBDBD] truncate" title={game?.name}>
            {game.name}
          </p>

          {/* Tournament name */}
          <h3 className="w-full text-md text-start font-bold leading-tight truncate" title={name}>
            {name}
          </h3>

          {/* Schedule info */}
          <div className="flex flex-wrap items-center gap-[6px] text-xs">
            <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
              <ExIconGlobe className="w-3.5 h-3.5 text-white" />
              {heading} {text}
            </span>
          </div>

          {/* Start date */}


          {/* Prize Pool */}
          {prizePool && (
            <div className="flex items-center gap-1.5 text-[11px] mt-0.5 text-[#BDBDBD]">
              <ExIconPrizePool className="w-3.5 h-3.5 text-jaffa-500" />
              <span>Prize Pool: <span className="text-white font-bold">{Number(prizePool).toLocaleString()}</span></span>
            </div>
          )}

          {/* Mode */}
          {mode && (
            <div className="flex items-center gap-1.5 text-[11px] mt-0.5 text-[#BDBDBD]">
              <ExIconTournamentType className="w-3.5 h-3.5 text-jaffa-500" />
              <span>Mode: <span className="text-white font-bold">{mode === "duelSolo" ? "1v1" : mode}</span></span>
            </div>
          )}

          {/* Game Icon & CTA */}
          <div className="flex justify-between items-end w-full mt-2">
            {/* Game Icon */}
            <div className="flex items-center">
              {game?.assets?.thumbnail ? (
                <div className="w-8 h-8 rounded-md overflow-hidden border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  <Image
                    src={game.assets.thumbnail}
                    alt={game.name || "Game"}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10" />
              )}
            </div>

            {/* CTA */}
            <div className="scale-75 origin-right" onClick={(e) => e.stopPropagation()}>
              <ExGlowButton onClick={handleJoin}>EXPLORE</ExGlowButton>
            </div>
          </div>
        </div>

        {/* ── Footer: dates ── */}
        <div className="flex justify-between items-center text-[11px] font-medium text-white bg-linear-to-r from-[#2d140a] to-[#421d0a] rounded-b-lg px-4 py-2.5">
          <span>
            <ExIconTrophy className="inline w-3.5 h-3.5 mr-1 text-orange-300" />
            {formatDate(schedule.tournamentStart)}
          </span>
          <span className="text-[#BDBDBD]">
            Ends {formatDate(schedule.tournamentEnd)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};