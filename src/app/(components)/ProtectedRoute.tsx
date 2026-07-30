"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/session", { signal: controller.signal, credentials: "same-origin", cache: "no-store" })
      .then((response) => response.json())
      .then((data: { authenticated?: boolean }) => data.authenticated ? setAllowed(true) : router.replace("/login"))
      .catch(() => router.replace("/login"));
    return () => controller.abort();
  }, [router]);
  if (!allowed) return <div className="flex min-h-[60vh] items-center justify-center" role="status">Checking authentication…</div>;
  return <>{children}</>;
}
