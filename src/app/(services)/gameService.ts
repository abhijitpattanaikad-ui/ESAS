import { getGameList } from "@/features/catalog/api";

export type { ApiGameAssets, ApiGameResponse } from "@/features/catalog/contracts";

export const gameService = {
  getAllGames: getGameList,
};
