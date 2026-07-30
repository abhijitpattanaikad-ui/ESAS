import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/auth/session";
import { isUpstreamError } from "@/lib/http/errors";
import { upstreamJson } from "@/lib/http/upstream";
import ProfilePageClient from "./ProfilePageClient";
import { parseUserProfile } from "@/features/profile/contracts";

export default async function ProfilePage() {
  const token = await getSessionToken();
  if (!token) redirect("/login");
  try {
    const profile = await upstreamJson<unknown>("/v1/user/getuserinfo", { token });
    return <ProfilePageClient initialData={parseUserProfile(profile)} />;
  } catch (error) {
    if (isUpstreamError(error) && error.status === 401) redirect("/login");
    return <section className="mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-semibold">Profile unavailable</h1><p className="mt-3 text-white/70">The profile service is temporarily unavailable. Please retry shortly.</p></section>;
  }
}
