"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { FloatingLabelInput } from "@/app/(components)/ui";
import type { ResetState } from "@/features/auth/token-state";
import { clientJson } from "@/lib/http/client";

export default function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [token, setToken] = useState(() => searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<ResetState>(token ? "ready" : "missing-token");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.has("token")) window.history.replaceState(null, "", pathname);
  }, [pathname, searchParams]);

  async function handleReset(event: React.FormEvent) {
    event.preventDefault();
    if (!token.trim()) return setState("missing-token");
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (password !== confirm) return toast.error("Passwords do not match.");
    setState("submitting");
    setMessage("");
    try {
      const result = await clientJson("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token: token.trim(), password }) });
      if (result.ok) {
        setState("success");
        setToken("");
        setPassword("");
        setConfirm("");
        return;
      }
      setMessage(result.message);
      setState(result.status === 401 ? "expired" : "failed");
    } catch {
      setMessage("Network error. Please try again.");
      setState("failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] p-4 flex items-center justify-center">
      <section className="w-full max-w-md rounded-xl bg-[#1c1b29] p-8 text-white shadow-lg" aria-labelledby="reset-title">
        <h1 id="reset-title" className="mb-4 text-center text-2xl font-semibold">Reset Password</h1>
        {state === "success" ? (
          <div className="space-y-4 text-center"><p className="text-green-400">Your password has been reset.</p><Link href="/login" className="text-orange-400 underline">Continue to login</Link></div>
        ) : state === "expired" ? (
          <div className="space-y-4 text-center"><p role="alert" className="text-red-400">{message || "This reset link is invalid or expired."}</p><Link href="/forgot-password" className="text-orange-400 underline">Request a new reset link</Link></div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {state === "missing-token" && <><p className="text-sm text-gray-300">No reset token was found. Paste the token from your email, or request a new link.</p><FloatingLabelInput id="reset-token" label="Reset Token" value={token} onChange={(event) => { setToken(event.target.value); setState("ready"); }} autoComplete="off" /></>}
            <FloatingLabelInput id="new-password" label="New password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" endAdornment={<button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 z-20 text-white/60 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
            <FloatingLabelInput id="confirm-password" label="Confirm password" type={showPassword ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" />
            {message && state === "failed" && <p role="alert" className="text-sm text-red-400">{message}</p>}
            <button type="submit" disabled={state === "submitting"} className="w-full rounded-md bg-red-500 py-2 font-semibold text-black transition hover:bg-red-400 disabled:opacity-60">{state === "submitting" ? "Resetting…" : "Reset Password"}</button>
          </form>
        )}
      </section>
    </main>
  );
}
