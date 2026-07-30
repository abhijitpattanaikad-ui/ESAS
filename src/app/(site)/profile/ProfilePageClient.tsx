"use client";

import { useState } from "react";
import ProfileHeader from "@/app/(components)/(layout)/ProfileHeader";
import { AboutSection, ProfileTabs } from "@/app/(components)/(layout)/ProfileSections";
import { userService } from "@/app/(services)/userService";
import type { UserProfile } from "@/features/profile/contracts";

export default function ProfilePageClient({ initialData }: { initialData: UserProfile }) {
  const [userData, setUserData] = useState<UserProfile>(initialData);

  async function refresh() {
    const data = await userService.getUserProfile();
    if (data) setUserData(data);
  }

  return (
    <div className="mx-auto px-4 py-8 sm:max-w-4xl sm:px-6 lg:px-8">
      <ProfileHeader initialData={userData} onUpdate={refresh} />
      <AboutSection userData={userData} />
      <ProfileTabs userData={userData} onUpdate={refresh} />
    </div>
  );
}
