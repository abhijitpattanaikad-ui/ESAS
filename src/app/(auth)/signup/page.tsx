"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ExGlowButton, FloatingLabelInput, FloatingLabelPhoneInput } from "@/app/(components)/ui";
import { validateSignup, type SignupErrors } from "@/features/auth/validation";
import { clientJson } from "@/lib/http/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    const validation = validateSignup({ email, username, phoneNumber, countryCode, password, confirmPassword, acceptTerms });
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const result = await clientJson("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(validation.value),
      });
      if (!result.ok) {
        toast.error(result.message);
        setErrors({ email: result.message });
        return;
      }
      toast.success(result.message || "Registration successful. Check your email to verify your account.");
      router.replace("/login");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-sm rounded-xl border border-orange-500/60 bg-transparent p-6 shadow-lg backdrop-blur-sm" aria-labelledby="signup-title">
      <h1 id="signup-title" className="mb-5 text-xl font-bold text-white">Create Account</h1>
      <form onSubmit={handleSignup} className="space-y-4" noValidate>
        <FloatingLabelInput id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} />
        <FloatingLabelInput id="username" label="Username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} error={errors.username} />
        <FloatingLabelPhoneInput
          id="phone"
          label="Phone Number"
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          countryCode={countryCode}
          onCountryChange={setCountryCode}
          error={errors.phoneNumber}
        />
        <FloatingLabelInput
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          endAdornment={<button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 z-20 text-white/70 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
        />
        <FloatingLabelInput
          id="confirm-password"
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          endAdornment={<button type="button" onClick={() => setShowConfirm((value) => !value)} className="absolute right-3 top-3 z-20 text-white/70 hover:text-white" aria-label={showConfirm ? "Hide confirmed password" : "Show confirmed password"} aria-pressed={showConfirm}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
        />
        <div>
          <div className="flex items-start gap-2 text-sm">
            <input id="terms" type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} className="mt-1 accent-orange-500" aria-describedby={errors.terms ? "terms-error" : undefined} />
            <label htmlFor="terms" className="text-white/80">
              I accept the <Link href="/terms" className="text-orange-500 underline">Terms</Link> and <Link href="/privacy" className="text-orange-500 underline">Privacy Policy</Link>.
            </label>
          </div>
          {errors.terms && <p id="terms-error" role="alert" className="mt-1 text-xs text-orange-500">{errors.terms}</p>}
        </div>
        <div className="flex justify-center"><ExGlowButton type="submit" disabled={loading}>{loading ? "CREATING…" : "SIGN UP"}</ExGlowButton></div>
        <div className="border-t border-white/10 pt-4 text-center text-sm text-white/70">Already have an account? <Link href="/login" className="text-orange-500 underline">Log In!</Link></div>
      </form>
    </section>
  );
}
