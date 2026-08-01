import Advantages from "@/app/(components)/landing/Advantages";
import CoreFeatures from "@/app/(components)/landing/CoreFeatures";
import FeaturedEvents from "@/app/(components)/landing/FeaturedEvents";
import FeaturedGames from "@/app/(components)/landing/FeaturedGames";
import HeroSection from "@/app/(components)/landing/HeroSection";
import TrustedBy from "@/app/(components)/landing/TrustedBy";
import type { ApiBrand } from "@/app/(services)/brandService";
import type { ApiGameResponse } from "@/app/(services)/gameService";
import type { ApiTournament } from "@/app/(types)/event";

export type Availability = "ready" | "empty" | "error";

interface LandingProps {
  initialTournaments: ApiTournament[];
  tournamentAvailability: Availability;
  initialBrands: ApiBrand[];
  brandAvailability: Availability;
  initialGames: ApiGameResponse[];
  gameAvailability: Availability;
}

export default function Landing({
  initialTournaments,
  tournamentAvailability,
  initialBrands,
  brandAvailability,
  initialGames,
  gameAvailability,
}: LandingProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--surface-page)]">
      <HeroSection />
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_28%,rgb(249_115_22_/_0.10),transparent_28%),radial-gradient(circle_at_88%_68%,rgb(59_130_246_/_0.08),transparent_30%)]" />
        <FeaturedEvents
          initialTournaments={initialTournaments}
          availability={tournamentAvailability}
          showCTA
        />
        <CoreFeatures />
        <FeaturedGames initialGames={initialGames} availability={gameAvailability} />
        <TrustedBy initialBrands={initialBrands} availability={brandAvailability} />
        <Advantages />
      </div>
    </div>
  );
}
