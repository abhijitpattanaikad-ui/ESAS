"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { EventCard } from "@/app/(components)/shared/EventCard";
import type { ApiTournament, ApiTournamentStatus } from "@/app/(types)/event";
import { Button, GlassCard, SectionHeading } from "@/components/ui";
import { filterTournaments } from "@/features/tournaments/filter";

interface TournamentListProps {
  initialTournaments: ApiTournament[];
}

const CONTROL_CLASSES = "min-h-11 w-full rounded-[var(--radius-public-control)] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-sm text-white outline-none transition-colors focus-visible:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-300/40";

export default function TournamentList({ initialTournaments }: TournamentListProps) {
  const [query, setQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<ApiTournamentStatus | "All">("All");

  const gameOptions = useMemo(
    () => Array.from(new Set(initialTournaments.map(({ game }) => game.name))).sort((a, b) => a.localeCompare(b, "en")),
    [initialTournaments],
  );
  const statusOptions = useMemo(
    () => Array.from(new Set(initialTournaments.map(({ status }) => status))).sort((a, b) => a.localeCompare(b, "en")),
    [initialTournaments],
  );
  const filteredTournaments = useMemo(
    () => filterTournaments(initialTournaments, { query, game: selectedGame, status: selectedStatus }),
    [initialTournaments, query, selectedGame, selectedStatus],
  );
  const hasActiveFilters = query !== "" || selectedGame !== "All" || selectedStatus !== "All";

  function resetFilters() {
    setQuery("");
    setSelectedGame("All");
    setSelectedStatus("All");
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Tournament discovery"
        title="Available tournaments"
        description="Narrow the current tournament catalog by name, game, or status."
      />

      <GlassCard className="p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(18rem,1fr)_minmax(12rem,0.55fr)_minmax(12rem,0.55fr)_auto] xl:items-end">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-100" htmlFor="tournament-search">
              Search tournaments
            </label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="tournament-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tournament or game"
                className={`${CONTROL_CLASSES} pl-10 pr-4`}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-100" htmlFor="tournament-game">
              Game
            </label>
            <div className="relative">
              <Filter aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                id="tournament-game"
                value={selectedGame}
                onChange={(event) => setSelectedGame(event.target.value)}
                className={`${CONTROL_CLASSES} appearance-none pl-10 pr-9`}
              >
                <option value="All">All games</option>
                {gameOptions.map((game) => <option key={game} value={game}>{game}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-100" htmlFor="tournament-status">
              Status
            </label>
            <select
              id="tournament-status"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as ApiTournamentStatus | "All")}
              className={`${CONTROL_CLASSES} appearance-none px-4`}
            >
              <option value="All">All statuses</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          <Button variant="secondary" onClick={resetFilters} disabled={!hasActiveFilters} className="w-full xl:w-auto">
            Reset filters
          </Button>
        </div>
      </GlassCard>

      <p aria-live="polite" aria-atomic="true" className="text-sm font-medium text-slate-300">
        {filteredTournaments.length === 1
          ? "1 tournament found"
          : `${filteredTournaments.length} tournaments found`}
      </p>

      {filteredTournaments.length > 0 ? (
        <ul aria-label="Tournament results" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredTournaments.map((tournament, index) => (
            <li key={tournament._id ?? `${tournament.name}-${index}`} className="min-w-0">
              <EventCard {...tournament} index={index} />
            </li>
          ))}
        </ul>
      ) : (
        <GlassCard className="py-14 text-center">
          <h2 className="text-xl font-bold text-white">No tournaments match these filters</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300/80">
            Try a different tournament name, game, or status, or reset all filters to see every available result.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
