import { clientJson } from "@/lib/http/client";
import {
  type ProfileUpdatePayload,
  type UserProfile,
  parseProfileImageResponse,
  parseUserProfile,
} from "@/features/profile/contracts";

export type ServiceResult<T> =
  | { success: true; data: T; message: string; status: number }
  | { success: false; message: string; status?: number };

export const userService = {
  async uploadImage(
    file: File,
    type: "profile" | "cover",
    platform: "XESPORTS" | "SIMR" = "XESPORTS",
  ): Promise<ServiceResult<{ profileImage?: string; coverImage?: string }>> {
    const formData = new FormData();
    formData.set("file", file);

    try {
      const result = await clientJson<unknown>(`/api/profile/image?platform=${platform}&type=${type}`, {
        method: "POST",
        body: formData,
      });
      if (!result.ok) return { success: false, message: result.message, status: result.status };
      return {
        success: true,
        data: parseProfileImageResponse(result.data),
        message: result.message,
        status: result.status,
      };
    } catch {
      return { success: false, message: "Image upload failed due to a network error." };
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const result = await clientJson<unknown>("/api/profile", { cache: "no-store" });
      return result.ok ? parseUserProfile(result.data) : null;
    } catch {
      return null;
    }
  },

  async updateProfile(profileData: ProfileUpdatePayload): Promise<ServiceResult<UserProfile>> {
    try {
      const result = await clientJson<unknown>("/api/profile", {
        method: "POST",
        body: JSON.stringify({ data: profileData }),
      });
      if (!result.ok) return { success: false, message: result.message, status: result.status };
      return {
        success: true,
        data: parseUserProfile(result.data),
        message: result.message,
        status: result.status,
      };
    } catch {
      return { success: false, message: "Profile update failed due to a network error." };
    }
  },
};
