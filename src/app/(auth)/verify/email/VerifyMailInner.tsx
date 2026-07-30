"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FloatingLabelInput } from "@/app/(components)/ui";
import { clientJson } from "@/lib/http/client";

type VerifyState = "idle" | "verifying" | "success" | "failed" | "missing-token";

export default function VerifyMailPage() {
  const params = useSearchParams();
  const pathname = usePathname();
  const [token, setToken] = useState(() => params.get("token") ?? "");
  const [state, setState] = useState<VerifyState>(token ? "idle" : "missing-token");
  const [message, setMessage] = useState("");

  const verifyEmail = useCallback(async (candidate: string) => {
    if (!candidate.trim()) return setState("missing-token");
    setState("verifying");
    setMessage("");
    try {
      const result = await clientJson("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ token: candidate.trim() }) });
      setToken("");
      setMessage(result.message);
      setState(result.ok || result.message.toLowerCase().includes("already verified") ? "success" : "failed");
    } catch {
      setMessage("Network error. Please try again.");
      setState("failed");
    }
  }, []);

  useEffect(() => {
    const queryToken = params.get("token");
    if (!queryToken) return;
    window.history.replaceState(null, "", pathname);
    void verifyEmail(queryToken);
  }, [params, pathname, verifyEmail]);

  return (
    <section className="w-full max-w-lg rounded-xl bg-[#1c1b29] p-8 text-center text-white shadow-lg" aria-labelledby="verify-title">
      <h1 id="verify-title" className="mb-4 text-2xl font-semibold">Verify your email</h1>
      {state === "verifying" && <p aria-live="polite" className="text-sm text-gray-300">Verifying your email…</p>}
      {state === "success" && <div className="space-y-4"><p className="text-green-400">{message || "Email verified successfully."}</p><Link href="/login" className="text-orange-400 underline">Continue to login</Link></div>}
      {state === "failed" && <div className="space-y-4"><p role="alert" className="text-red-400">{message || "Verification failed."}</p><p className="text-sm text-gray-400">The link may be invalid or expired. Contact <a className="underline" href="mailto:support@xesports.pro">support@xesports.pro</a> for assistance.</p></div>}
      {(state === "idle" || state === "missing-token") && <div className="space-y-4"><p className="text-sm text-gray-300">Paste the verification token from your email.</p><FloatingLabelInput id="verification-token" label="Verification Token" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" /><button type="button" onClick={() => void verifyEmail(token)} disabled={!token.trim()} className="rounded-md bg-[#ff4d6d] px-4 py-2 font-semibold text-black disabled:opacity-50">Verify</button><p className="text-sm text-gray-400">Back to <Link href="/login" className="underline text-[#ff4d6d]">Login</Link>.</p></div>}
    </section>
  );
}
