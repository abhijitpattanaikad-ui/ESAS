// src/app/(services)/gameService.ts

export type ApiGameAssets = {
  thumbnail: string;
  desktopBanner?: string;
  mobileBanner?: string;
};

export type ApiGameResponse = {
  _id: string;
  name: string;
  assets?: ApiGameAssets;
};

const API_URL = "https://apis.xesports.pro/v1/game/find-all";

export const gameService = {
  /**
   * Fetches all games from the API.
   */
  async getAllGames(): Promise<ApiGameResponse[]> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria: {} }),
      });

      if (!response.ok) {
        console.error("[gameService.getAllGames] API error:", response.status);
        return [];
      }

      const data: ApiGameResponse[] = await response.json();
      return data;
    } catch (error) {
      console.error("[gameService.getAllGames] Fetch failed:", error);
      return [];
    }
  },
};
