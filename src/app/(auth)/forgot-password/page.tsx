"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FloatingLabelInput } from "@/app/(components)/ui";
import { clientJson } from "@/lib/http/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const result = await clientJson("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setSent(true);
      toast.success(result.message || "Password reset link sent.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-sm rounded-xl bg-[#1c1b29] p-8 text-white shadow-lg" aria-labelledby="forgot-title">
      <h1 id="forgot-title" className="mb-4 text-center text-2xl font-semibold">Forgot Password</h1>
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-gray-300">Check your email. For privacy, this message is the same whether or not an account exists.</p>
          <Link href="/login" className="text-red-400 underline">Back to Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSend}>
          <p className="mb-6 text-center text-sm text-gray-400">Enter your email address and we’ll send you a password reset link.</p>
          <FloatingLabelInput id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mb-4" />
          <button type="submit" disabled={loading} className="w-full rounded-md bg-red-500 py-2 font-semibold text-black transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Sending…" : "Send Reset Link"}</button>
          <div className="mt-4 text-center text-sm"><Link href="/login" className="text-red-400 underline">Back to Login</Link></div>
        </form>
      )}
    </section>
  );
}
