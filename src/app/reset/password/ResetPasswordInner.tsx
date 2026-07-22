// src/app/reset/password/ResetPasswordInner.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { FloatingLabelInput } from "@/app/(components)/ui";

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
    // console.log("DEBUG sending token:", token); // -> verify token printed in console

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/reset/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // must be present
        },
        // body must match Postman: { data: { password: "..." } }
        body: JSON.stringify({ data: { password } }),
      });

      // debug: check network request and response
      console.log("DEBUG status", res.status);

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        console.warn("Response was not valid JSON");
      }

      if (res.ok) {
        toast.success(data.message || "Password reset successfully");
        // router.push("/login");

        setTimeout(() => {
          router.push("/login");
        }, 900);
        return;
      }

      setTimeout(() => {
        router.push("/login");
      }, 900);


      if (res.status === 401) {
        toast.error(data.message || "Reset link invalid or expired. Request a new link.");
        setToken(null);
        setTimeout(() => router.push("/forgot-password"), 1200);
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p>Redirecting to password reset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] p-4">
      <div className="w-full max-w-md bg-[#1c1b29] text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>

        {!token && (
          <p className="text-sm text-gray-300 mb-4">
            No token found in the URL. Paste the reset token here (from your email) or request a new link.
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          {/* manual token (shown when no token available) */}
          {!token && (
            <div className="mb-4">
              <FloatingLabelInput
                id="token"
                label="Reset Token"
                value={token ?? ""}
                onChange={(e) => setToken(e.target.value || null)}
              />
            </div>
          )}

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