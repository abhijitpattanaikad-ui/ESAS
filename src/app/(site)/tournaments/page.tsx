// src/app/(site)/tournaments/page.tsx
import React from "react";
import { tournamentService } from "@/app/(services)/tournamentService";
import TournamentList from "@/app/(components)/shared/TournamentList";

export default async function TournamentsPage() {
  // Fetch all data on the server
  const tournaments = await tournamentService.getAllTournaments();

  return (
    <section className="relative py-12 md:py-20 bg-woodsmoke-950 px-4 bg-[image:--features-bg] bg-cover bg-center bg-no-repeat min-h-screen pt-24 md:pt-32">
      {/* Dark Overlays for premium look */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-linear-to-b from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />

      <div className="container mx-auto z-10 relative">
        {/* Page Title with Gradient (FeaturedEvents theme) */}
        <div className="mb-10 md:mb-16 text-center">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold heading-font uppercase px-4">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-jaffa-500 to-red-600">
              EXPLORE TOURNAMENTS
            </span>
          </h1>
          <p className="text-white/40 mt-4 text-sm md:text-base font-medium max-w-2xl mx-auto uppercase tracking-widest">
            Find and join the most elite esports competitions in the region.
          </p>
        </div>

        {/* Client Side List */}
        <TournamentList 
          initialTournaments={tournaments} 
        />
      </div>
    </section>
  );
}
