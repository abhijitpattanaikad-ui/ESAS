import { hasSession } from "@/lib/auth/session";
import SiteShell from "./SiteShell";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell isLoggedIn={await hasSession()}>{children}</SiteShell>;
}
