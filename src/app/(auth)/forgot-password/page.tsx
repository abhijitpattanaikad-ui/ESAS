// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FloatingLabelInput } from "@/app/(components)/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/sendpasswordresetmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { email } }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password reset link sent!");
        router.push("/login");
      } else {
        toast.error(data.message || "Failed to send reset mail");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center  text-white ">
      <form
        onSubmit={handleSend}
        className="bg-[#1c1b29] p-8 rounded-xl w-full max-w-sm shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Enter your email address and we’ll send you a password reset link.
        </p>

        <FloatingLabelInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-400 text-black font-semibold py-2 rounded-md transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p
          className="mt-4 text-center text-sm text-red-400 cursor-pointer hover:underline"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}