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
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="relative w-full bg-(image:--landing-combined-bg) bg-cover bg-center bg-no-repeat overflow-hidden">
        <div className="absolute inset-0 bg-woodsmoke-950/90 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-woodsmoke-950 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-woodsmoke-950 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <CoreFeatures />
          <TrustedBy initialBrands={initialBrands} availability={brandAvailability} />
        </div>
      </div>
      <FeaturedEvents
        initialTournaments={initialTournaments}
        availability={tournamentAvailability}
        showCTA
      />
      <FeaturedGames initialGames={initialGames} availability={gameAvailability} />
      <Advantages />
    </div>
  );
}
