import axios from "axios";
import { API_BASE_URL } from "@/lib/api/config";

const API_URL = API_BASE_URL;

export const userService = {
  /**
   * Uploads a profile or cover image.
   * @param file The image file to upload.
   * @param type 'profile' or 'cover'
   * @param platform 'XESPORTS' or 'SIMR'
   */
  async uploadImage(file: File, type: 'profile' | 'cover', platform: 'XESPORTS' | 'SIMR' = 'XESPORTS'): Promise<any> {
    try {
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_URL}/v1/user/update/image?platform=${platform}&type=${type}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, data: res.data };
    } catch (err: any) {
      console.warn(`[userService.uploadImage] Failed for type ${type}:`, err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to upload image",
      };
    }
  },

  /**
   * Fetches the user's profile details.
   */
  async getUserProfile(): Promise<any> {
    try {
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      if (!token) return null;

      // Add timestamp to avoid caching
      const res = await axios.get(`${API_URL}/v1/user/getuserinfo?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && typeof window !== "undefined") {
        if (res.data.username) localStorage.setItem("username", res.data.username);
        if (res.data.profileImage) localStorage.setItem("profileImage", res.data.profileImage);
      }

      return res.data;
    } catch (err) {
      console.warn("[userService.getUserProfile] Fetch failed:", err);
      return null;
    }
  },

  /**
   * Updates the user's profile details.
   * @param profileData The profile data to update.
   */
  async updateProfile(profileData: any): Promise<any> {
    try {
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.post(`${API_URL}/v1/user/update/profile`, {
        data: profileData
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return { success: true, data: res.data };
    } catch (err: any) {
      console.warn("[userService.updateProfile] Update failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to update profile",
      };
    }
  }
};
