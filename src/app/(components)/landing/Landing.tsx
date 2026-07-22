// src/app/(components)/landing/Landing.tsx
import HeroSection from "@/app/(components)/landing/HeroSection";
import CoreFeatures from "@/app/(components)/landing/CoreFeatures";
import TrustedBy from "@/app/(components)/landing/TrustedBy";
import FeaturedEvents from "@/app/(components)/landing/FeaturedEvents";
import FeaturedGames from "@/app/(components)/landing/FeaturedGames";
import Advantages from "@/app/(components)/landing/Advantages";
import { ApiTournament } from "@/app/(types)/event";
import { ApiBrand } from "@/app/(services)/brandService";
import { ApiGameResponse } from "@/app/(services)/gameService";

interface LandingProps {
  initialTournaments: ApiTournament[];
  initialBrands: ApiBrand[];
  initialGames: ApiGameResponse[];
}

export default function Landing({
  initialTournaments,
  initialBrands,
  initialGames,
}: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="relative w-full bg-(image:--landing-combined-bg) bg-cover bg-center bg-no-repeat overflow-hidden">
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-woodsmoke-950/90 pointer-events-none" />

        {/* Top melt gradient (fade in from previous section) */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-woodsmoke-950 to-transparent pointer-events-none" />

        {/* Bottom melt gradient (fade out to next section) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-woodsmoke-950 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <CoreFeatures />
          <TrustedBy initialBrands={initialBrands} />
        </div>
      </div>
      <FeaturedEvents initialTournaments={initialTournaments} showCTA={true} />
      <FeaturedGames initialGames={initialGames} />
      <Advantages />
    </div>
  );
}