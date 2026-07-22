"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ExButton, ExGlowButton, FloatingLabelInput, FloatingLabelPhoneInput } from "@/app/(components)/ui";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTC, setAcceptTC] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
    confirm: "",
    tc: "",
  });

  function localValidate() {
    const newErrors = { email: "", username: "", phoneNumber: "", password: "", confirm: "", tc: "" };
    let valid = true;

    if (!email || !username || !password || !confirm || !phoneNumber) {
      if (!email) newErrors.email = "Email is required";
      if (!username) newErrors.username = "Username is required";
      if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
      if (!password) newErrors.password = "Password is required";
      if (!confirm) newErrors.confirm = "Confirm password is required";
      valid = false;
    }
    if (!acceptTC) {
      newErrors.tc = "You must accept the terms and conditions";
      valid = false;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }
    if (username && (username.length < 4 || username.length > 20)) {
      newErrors.username = "Username must be 4–20 characters";
      valid = false;
    }
    if (username && !/^[A-Za-z0-9._]{4,20}$/.test(username)) {
      newErrors.username = "Only letters, digits, '.' and '_' allowed";
      valid = false;
    }
    if (phoneNumber) {
      if (!/^\d+$/.test(phoneNumber)) {
        newErrors.phoneNumber = "Phone number must contain only digits";
        valid = false;
      } else if (phoneNumber.length !== 10) {
        newErrors.phoneNumber = "please enter 10 digit";
        valid = false;
      }
    }
    if (password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    }
    if (confirm && password !== confirm) {
      newErrors.confirm = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!localValidate()) return;

    setLoading(true);
    setErrors({ email: "", username: "", phoneNumber: "", password: "", confirm: "", tc: "" });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            username: username.trim(),
            email: email.trim(),
            phone: `${countryCode}${phoneNumber.trim()}`,
            password,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(data?.message || "Registration successful 🎉");
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

      // ✅ Map backend errors
      if (data?.details && Array.isArray(data.details)) {
        const newErrors = { email: "", username: "", phoneNumber: "", password: "", confirm: "", tc: "" };

        data.details.forEach((err: any) => {
          const msg = err.message
            .replace(/["]/g, "")
            .replace("data.", "")
            .replace(/^./, (s: string) => s.toUpperCase());
          if (msg.toLowerCase().includes("username")) newErrors.username = msg;
          else if (msg.toLowerCase().includes("email")) newErrors.email = msg;
          else if (msg.toLowerCase().includes("phone")) newErrors.phoneNumber = msg;
          else if (msg.toLowerCase().includes("password")) newErrors.password = msg;
          else toast.error(msg);
        });

        setErrors(newErrors);
        return;
      }

      if (data?.message) toast.error(data.message);
      else toast.error("Signup failed. Please try again.");
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(err?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <section className="w-full max-w-sm bg-transparent border border-orange-500/60 p-6 rounded-xl backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-white">Create Account</h2>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email */}
          <div className="mb-4">
            <FloatingLabelInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <FloatingLabelInput
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <FloatingLabelPhoneInput
              id="phone"
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (val.length <= 10) {
                  setPhoneNumber(val);
                  // Clear error when typing
                  if (errors.phoneNumber) {
                    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                  }
                }
              }}
              onBlur={() => {
                if (phoneNumber && phoneNumber.length !== 10) {
                  setErrors((prev) => ({ ...prev, phoneNumber: "Please enter 10 digit phone number" }));
                }
              }}
              countryCode={countryCode}
              onCountryChange={setCountryCode}
              error={errors.phoneNumber}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <FloatingLabelInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/70 hover:text-white z-20 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <FloatingLabelInput
              id="confirm"
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-white/70 hover:text-white z-20 cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm">
            <input
              id="tc"
              type="checkbox"
              checked={acceptTC}
              onChange={(e) => setAcceptTC(e.target.checked)}
              className="accent-orange-500"
            />
            <label htmlFor="tc" className="text-white/80">
              Accept{" "}
              <Link href="#" className="underline text-orange-500">
                terms & conditions
              </Link>
            </label>
          </div>
          {errors.tc && <p className="text-xs text-orange-500 mt-1">{errors.tc}</p>}

          {/* Submit */}
          <div className="flex place-content-center"><ExGlowButton type="submit">SIGN UP</ExGlowButton></div>

          <div className="border-t border-white/10 pt-4 text-sm text-center text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 underline">
              Log In!
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}