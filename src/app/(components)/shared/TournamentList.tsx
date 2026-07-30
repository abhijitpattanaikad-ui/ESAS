"use client";

import React, { useState, useMemo } from "react";
import { EventCard } from "@/app/(components)/shared/EventCard";
import { ApiTournament } from "@/app/(types)/event";
import { Search, Filter } from "lucide-react";

interface TournamentListProps {
  initialTournaments: ApiTournament[];
}

export default function TournamentList({
  initialTournaments,
}: TournamentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState("All");

  const uniqueGames = useMemo(() => {
    const games = new Set(initialTournaments.map(t => t.game?.name).filter(Boolean));
    return ["All", ...Array.from(games)];
  }, [initialTournaments]);

  const filteredTournaments = useMemo(() => {
    return initialTournaments.filter((t) => {
      const matchesSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.game?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGame = selectedGame === "All" || t.game?.name === selectedGame;
      return matchesSearch && matchesGame;
    });
  }, [initialTournaments, searchQuery, selectedGame]);

  return (
    <div className="w-full space-y-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center sm:justify-between px-8 sm:max-xl:px-0 2xl:max-[1744px]:px-10 min-[1745px]:px-24 mb-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tournaments..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#0c0a11]/80 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-jaffa-500 focus:ring-1 focus:ring-jaffa-500 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-[#0c0a11]/80 backdrop-blur-md border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-jaffa-500 focus:ring-1 focus:ring-jaffa-500 transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative z-0"
          >
            {uniqueGames.map(game => (
              <option key={game as string} value={game as string} className="bg-[#0c0a11] text-white py-2">
                {game === "All" ? "All Games" : game as string}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex flex-row overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 px-8 sm:max-xl:px-0 2xl:max-[1744px]:px-10 min-[1745px]:px-24 gap-y-8 justify-items-center sm:pb-0 sm:overflow-visible sm:snap-none">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((tournament, index) => (
            <div key={tournament._id || index} className="min-w-[280px] sm:min-w-0 snap-center">
              <EventCard {...tournament} index={index} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center w-full">
            <p className="text-xl font-bold text-white/40 italic">No tournaments found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}