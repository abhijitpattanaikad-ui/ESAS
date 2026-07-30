"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EventCard } from "@/app/(components)/shared/EventCard";
import { ExLinkButton } from "@/app/(components)/ui";
import type { ApiTournament } from "@/app/(types)/event";
import type { Availability } from "./Landing";

interface FeaturedEventsProps {
  showCTA?: boolean;
  initialTournaments?: ApiTournament[];
  availability?: Availability;
}

export default function FeaturedEvents({
  showCTA = false,
  initialTournaments = [],
  availability = "ready",
}: FeaturedEventsProps) {
  const tournaments = initialTournaments;
  const router = useRouter();


  return (
    <section className="relative py-16 bg-woodsmoke-950 px-4 bg-[image:--features-bg] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-[40%] bg-linear-to-b from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />

      <div className="container mx-auto z-10 relative">
        <h2 className="mb-12 text-2xl md:text-3xl font-bold heading-font text-center">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-600 to-red-600">
            FEATURED TOURNAMENTS
          </span>
        </h2>

        {availability === "error" ? (
          <p role="status" className="text-center text-orange-200/80 text-sm py-8">
            Featured tournaments are temporarily unavailable.
          </p>
        ) : tournaments.length === 0 ? (
          <p className="text-center text-white/50 text-sm py-8">
            No tournaments are scheduled right now.
          </p>
        ) : (
          <div className="flex flex-row overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 px-8 sm:max-xl:px-0 2xl:max-[1744px]:px-10 min-[1745px]:px-24 gap-y-8 justify-items-center sm:overflow-visible sm:snap-none pb-2">
            {tournaments.slice(0, 4).map((tournament, index) => (
              <div key={tournament._id ?? `${tournament.name}-${index}`} className="min-w-[280px] sm:min-w-0 snap-center">
                <EventCard {...tournament} index={index} />
              </div>
            ))}
          </div>
        )}

        {showCTA && (
          <div className="sm:mt-2 flex justify-end px-0 sm:max-xl:px-8 2xl:max-[1744px]:px-12 min-[1745px]:px-25">
            <ExLinkButton onClick={() => router.push("/tournaments")}>
              VIEW ALL
            </ExLinkButton>
          </div>
        )}
      </div>
    </section>
  );
}