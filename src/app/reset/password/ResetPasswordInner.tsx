// src/app/reset/password/ResetPasswordInner.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { FloatingLabelInput } from "@/app/(components)/ui";
import { getResetOutcome } from "@/lib/auth/resetFlow";
import { API_BASE_URL } from "@/lib/api/config";

export default function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Extract token from URL query (?token=...)
  useEffect(() => {
    const t = searchParams.get("token");
    setToken(t);
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token is missing or invalid.");
      return;
    }
    if (password.length < 8) {

      toast.error("Password must be at least 8 characters long.");

      return;

    }
    if (password !== confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/user/reset/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // must be present
        },
        // body must match Postman: { data: { password: "..." } }
        body: JSON.stringify({ data: { password } }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        console.warn("Response was not valid JSON");
      }

      const outcome = getResetOutcome(res);

      if (outcome.kind === "success") {
        toast.success(data.message || "Password reset successfully");
        setPassword("");
        setConfirm("");
        setTimeout(() => router.push(outcome.redirectTo), 900);
        return;
      }

      if (outcome.kind === "expired") {
        toast.error(data.message || "Reset link invalid or expired. Request a new link.");
        setToken(null);
        return;
      }

      toast.error(data.message || "Reset failed. Try again.");
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] p-4">
        <div className="w-full max-w-md bg-[#1c1b29] text-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3 text-center">Reset link required</h2>
          <p className="text-sm text-gray-300 mb-6 text-center">
            This password-reset link is missing a token or has expired. Request a new link to continue securely.
          </p>
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="w-full rounded-md bg-[#ff4d6d] px-4 py-3 font-semibold text-black"
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] p-4">
      <div className="w-full max-w-md bg-[#1c1b29] text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="mb-4">
            <FloatingLabelInput
              id="password"
              label="New password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-3 text-white/60 hover:text-white z-20"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>

          <div className="mb-4">
            <FloatingLabelInput
              id="confirm"
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-400 text-black font-semibold py-2 rounded-md transition disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* <div className="mt-4 text-center text-sm text-gray-400">
          <button
            onClick={() => router.push("/forgot-password")}
            className="underline text-[#ff4d6d] hover:opacity-90"
          >
            Request a new reset link
          </button>
        </div> */}
      </div>
    </div>
  );
}
