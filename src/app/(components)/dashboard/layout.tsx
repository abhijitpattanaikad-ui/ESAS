import { redirect } from "next/navigation";
import { hasSession } from "@/lib/auth/session";
import SiteShell from "@/app/(site)/SiteShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasSession())) redirect("/login");
  return <SiteShell isLoggedIn>{children}</SiteShell>;
}
