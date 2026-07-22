// src/app/(services)/tournamentService.ts
import axios from "axios";
import type { ApiTournament } from "@/app/(types)/event";

const API_URL = "https://apis.xesports.pro/v1/tournament/find-all";

export const tournamentService = {
  /**
   * Fetches featured tournaments from the XESPORTS API.
   * Returns a maximum of 8 tournaments.
   */
  async getFeaturedTournaments(): Promise<ApiTournament[]> {
    const PROJECT_FIELDS = "name assets prizePool mode schedule isDraft status heading text game buttonText _id";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria: {}, project: PROJECT_FIELDS }),
        next: { revalidate: 300 }, // revalidate every 5 minutes
      });

      if (!res.ok) {
        console.error("[tournamentService.getFeaturedTournaments] API error:", res.status);
        return [];
      }

      const data: ApiTournament[] = await res.json();
      console.log(data)
      return data.filter((t) => !t.isDraft).slice(0, 8);

    } catch (err) {
      console.error("[tournamentService.getFeaturedTournaments] Fetch failed:", err);
      return [];
    }
  },

  /**
   * Fetches all tournaments from the XESPORTS API.
   * Returns all non-draft tournaments.
   */
  async getAllTournaments(): Promise<ApiTournament[]> {
    const PROJECT_FIELDS = "name assets prizePool mode schedule isDraft status heading text game buttonText _id";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria: {}, project: PROJECT_FIELDS }),
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        console.error("[tournamentService.getAllTournaments] API error:", res.status);
        return [];
      }

      const data: ApiTournament[] = await res.json();
      return data.filter((t) => !t.isDraft);
    } catch (err) {
      console.error("[tournamentService.getAllTournaments] Fetch failed:", err);
      return [];
    }
  },

  /**
   * Fetches specific tournament details by ID from the XESPORTS API.
   */
  async getTournamentById(id: string): Promise<ApiTournament | null> {
    try {
      let token = "";
      let userId = "";
      if (typeof window !== 'undefined') {
        token = localStorage.getItem("token") || "";
        userId = localStorage.getItem("userId") || "";
        
        // Fallback: decode JWT token to extract userId if missing from localStorage
        if (!userId && token) {
          try {
            const base64Url = token.split('.')[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              const decoded = JSON.parse(jsonPayload);
              userId = decoded._id || decoded.userId || decoded.id || "";
              if (userId) localStorage.setItem("userId", userId);
            }
          } catch (e) {
            console.warn("Failed to decode token for userId fallback", e);
          }
        }
      }

      // The original manual says { criteria: { userId: "" } }, though tokens are what identify users.
      const criteria: Record<string, any> = {
        userId: userId || ""
      };

      const res = await axios.post(`https://apis.xesports.pro/v1/tournament/find/${id}`, {
        criteria,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const tournament = res.data.tournament;
      if (tournament) {
        // The API returns some fields alongside the tournament object. 
        // We merge them here so the frontend can access them directly on the tournament object.
        tournament.participatedPlayers = res.data.participatedPlayers || tournament.participatedPlayers || [];
        tournament.joinStatus = res.data.joinStatus || tournament.joinStatus;
        tournament.message = res.data.message || tournament.message;
        tournament.buttonText = res.data.buttonText || tournament.buttonText;
        tournament.heading = res.data.heading || tournament.heading;
        tournament.text = res.data.text || tournament.text;
        tournament.sponsors = res.data.sponsors || tournament.sponsors || [];
      }

      return tournament || null;
    } catch (err: any) {
      if (err.response) {
        console.warn(`[tournamentService.getTournamentById] API response not ok for id ${id}:`, err.response.status, err.response.data);
      } else {
        console.warn(`[tournamentService.getTournamentById] Fetch failed for id ${id}:`, err);
      }
      return null;
    }
  },

  /**
   * Joins a specific tournament from the XESPORTS API.
   */
  async joinTournament(tournamentId: string): Promise<any> {
    try {
      // Setup base criteria with the required tournament _id
      const criteria: Record<string, any> = { _id: tournamentId };

      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      // The frontend can POST directly to external API since POST allows body natively
      const res = await axios.post(`https://apis.xesports.pro/v1/tournament/join`, {
        criteria
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      return { success: true, data: res.data };
    } catch (err: any) {
      console.warn(`[tournamentService.joinTournament] Failed for id ${tournamentId}:`, err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to join tournament"
      };
    }
  },

  /**
   * Leaves a specific tournament from the XESPORTS API.
   */
  async leaveTournament(tournamentId: string): Promise<any> {
    try {
      const criteria: Record<string, any> = { _id: tournamentId };
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      const res = await axios.post(`https://apis.xesports.pro/v1/tournament/leave`, {
        criteria
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      return { success: true, data: res.data };
    } catch (err: any) {
      console.warn(`[tournamentService.leaveTournament] Failed for id ${tournamentId}:`, err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to leave tournament"
      };
    }
  },
};
