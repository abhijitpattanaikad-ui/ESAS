// src/app/page.tsx
import Landing from "@/app/(components)/landing/Landing";
import { tournamentService } from "@/app/(services)/tournamentService";
import { brandService } from "@/app/(services)/brandService";
import { gameService } from "@/app/(services)/gameService";

export default async function Home() {
  // Fetch all landing page data on the server
  const [tournaments, brands, games] = await Promise.all([
    tournamentService.getFeaturedTournaments(),
    brandService.getAllBrands(),
    gameService.getAllGames(),
  ]);

  return (
    <Landing
      initialTournaments={tournaments}
      initialBrands={brands}
      initialGames={games}
    />
  );
}