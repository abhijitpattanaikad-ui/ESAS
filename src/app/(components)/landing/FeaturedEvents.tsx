"use client";

import Link from "next/link";
import { EventCard } from "@/app/(components)/shared/EventCard";
import { buttonStyles, GlassCard, SectionHeading } from "@/components/ui";
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

  return (
    <section aria-labelledby="featured-tournaments-title" className="relative py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--surface-page),rgb(24_35_58_/_0.72),var(--surface-page))]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Compete next"
          title={<span id="featured-tournaments-title">Featured tournaments</span>}
          description="Explore the competitions currently highlighted by GoEzPz."
          action={showCTA ? (
            <Link href="/tournaments" className={buttonStyles({ variant: "ghost" })}>
              View all tournaments
            </Link>
          ) : undefined}
        />

        {availability === "error" ? (
          <GlassCard className="mt-10 text-center">
            <p role="status" className="text-sm text-orange-100/80">
              Featured tournaments are temporarily unavailable.
            </p>
          </GlassCard>
        ) : tournaments.length === 0 ? (
          <GlassCard className="mt-10 text-center">
            <p className="text-sm text-slate-200/70">No tournaments are scheduled right now.</p>
          </GlassCard>
        ) : (
          <div aria-label="Featured tournaments" className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:snap-none lg:grid-cols-4">
            {tournaments.slice(0, 4).map((tournament, index) => (
              <div key={tournament._id ?? `${tournament.name}-${index}`} className="min-w-[280px] snap-center sm:min-w-0">
                <EventCard {...tournament} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
