"use client";

import React from "react";
import { Trophy } from "lucide-react";

export const RoundRobin = ({ standings }: { standings: any[] }) => {
  if (!standings || standings.length === 0) return (
    <div className="text-center py-20 text-gray-500">No standings data available.</div>
  );

  return (
    <div className="w-full py-8">
      <div className="relative overflow-x-auto rounded-2xl border border-white/5 bg-woodsmoke-950/40 backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Rank</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Team</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400 text-center">Played</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400 text-center">Won</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400 text-center">Lost</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-jaffa-500 text-center">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((team, index) => (
              <tr 
                key={index} 
                className="group hover:bg-jaffa-500/5 transition-colors duration-300"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`
                      flex items-center justify-center w-8 h-8 rounded-full font-black text-sm
                      ${index === 0 ? "bg-jaffa-500 text-white" : 
                        index === 1 ? "bg-gray-400 text-black" :
                        index === 2 ? "bg-amber-700 text-white" : "bg-white/5 text-gray-400"}
                    `}>
                      {team.rank}
                    </span>
                    {index === 0 && <Trophy className="w-4 h-4 text-jaffa-500" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                      {team.team.charAt(0)}
                    </div>
                    <span className="font-bold text-white group-hover:text-jaffa-500 transition-colors uppercase tracking-tight">
                      {team.team}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-medium text-gray-300">{team.played}</td>
                <td className="px-6 py-4 text-center font-bold text-green-500">{team.won}</td>
                <td className="px-6 py-4 text-center font-bold text-red-500">{team.lost}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-jaffa-500/10 text-jaffa-500 px-3 py-1 rounded-full text-sm font-black border border-jaffa-500/20">
                    {team.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Funky Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-jaffa-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-jaffa-900/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
};
