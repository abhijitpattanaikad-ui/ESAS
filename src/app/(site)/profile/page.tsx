"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "@/app/(components)/(layout)/ProfileHeader";
import { AboutSection, ProfileTabs } from "@/app/(components)/(layout)/ProfileSections";
import { userService } from "@/app/(services)/userService";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const data = await userService.getUserProfile();
      if (data) {
        setUserData(data);
      } else {
        // If getUserProfile returns null (e.g., no token), redirect to login
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
    } else {
      fetchProfile();
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto sm:max-w-8/10 px-4 py-8 sm:px-6 lg:px-18">
      <ProfileHeader initialData={userData} onUpdate={fetchProfile} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <AboutSection userData={userData} />
          <ProfileTabs userData={userData} onUpdate={fetchProfile} />
        </div>
      </div>
    </div>
  );
}