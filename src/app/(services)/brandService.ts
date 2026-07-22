// src/app/(services)/brandService.ts

export type ApiBrand = {
  _id: string;
  name: string;
  thumbnail: string;
  isActive: boolean;
};

const API_URL = "https://apis.xesports.pro/v1/brand/find-all";

export const brandService = {
  /**
   * Fetches all brands/partners from the API.
   */
  async getAllBrands(): Promise<ApiBrand[]> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        console.error("[brandService.getAllBrands] API error:", response.status);
        return [];
      }

      const data: ApiBrand[] = await response.json();
      return data;
    } catch (error) {
      console.error("[brandService.getAllBrands] Fetch failed:", error);
      return [];
    }
  },
};
