"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ExGlowButton, FloatingLabelInput } from "@/app/(components)/ui";
import { clientJson } from "@/lib/http/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || !password) {
      setError("Enter a valid email and password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await clientJson<{ username?: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      if (!result.ok) {
        setError(result.message);
        toast.error(result.message);
        return;
      }
      toast.success(`Welcome ${result.data.username ?? "Player"}!`);
      router.replace("/profile");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-sm rounded-xl border border-orange-500/60 bg-transparent p-6 shadow-lg backdrop-blur-sm" aria-labelledby="login-title">
      <h1 id="login-title" className="mb-5 text-xl font-bold">Log In</h1>
      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        <FloatingLabelInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(error)}
        />
        <FloatingLabelInput
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(error)}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-3 z-20 text-white/70 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
        {error && <p role="alert" className="text-sm text-orange-400">{error}</p>}
        <div className="text-sm">
          <Link href="/forgot-password" className="text-orange-500 underline hover:opacity-90">Forgot Password?</Link>
        </div>
        <div className="flex justify-center">
          <ExGlowButton type="submit" disabled={loading}>{loading ? "SIGNING IN…" : "LOG IN"}</ExGlowButton>
        </div>
        <div className="border-t border-white/10 pt-4 text-center text-sm text-white/70">
          New here? <Link href="/signup" className="text-orange-500 underline">Sign Up!</Link>
        </div>
      </form>
    </section>
  );
}
