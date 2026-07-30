import Landing from "@/app/(components)/landing/Landing";
import { brandService } from "@/app/(services)/brandService";
import { gameService } from "@/app/(services)/gameService";
import { tournamentService } from "@/app/(services)/tournamentService";
import type { DataResult } from "@/lib/data-result";

type Availability = "ready" | "empty" | "error";

function availability<T>(result: DataResult<T>): Availability {
  if (result.kind === "success") return "ready";
  return result.kind === "empty" ? "empty" : "error";
}

function dataOrEmpty<T>(result: DataResult<T[]>): T[] {
  return result.kind === "success" ? result.data : [];
}

export default async function Home() {
  const [tournaments, brands, games] = await Promise.all([
    tournamentService.getFeaturedTournaments(),
    brandService.getAllBrands(),
    gameService.getAllGames(),
  ]);

  return (
    <Landing
      initialTournaments={dataOrEmpty(tournaments)}
      tournamentAvailability={availability(tournaments)}
      initialBrands={dataOrEmpty(brands)}
      brandAvailability={availability(brands)}
      initialGames={dataOrEmpty(games)}
      gameAvailability={availability(games)}
    />
  );
}
