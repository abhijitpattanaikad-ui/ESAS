// src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from 'sonner';
import { ExButton, ExGlowButton, FloatingLabelInput } from "@/app/(components)/ui";
import { API_BASE_URL } from "@/lib/api/config";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Basic client-side validation
  function validate() {
    if (!email) {
      toast.error('Please enter your email');
      return false;
    }
    // simple email-ish check
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (!password) {
      toast.error('Please enter your password');
      return false;
    }
    return true;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);


    try {
      // 🌐 Mock login path (used when backend is unavailable)
      if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('username', 'MockUser');
        localStorage.setItem('userId', 'mock-user-id');
        toast.success('Mock login successful!');
        router.push('/profile');
        return;
      }


      // 🔥 Real API call path
      const res = await fetch(
        `${API_BASE_URL}/v1/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            criteria: { email, password },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Backend returns either { message, type } or validation details.
        const message =
          data?.message ||
          data?.details?.[0]?.message ||
          'Login failed. Please check your credentials.';
        toast.error(message);
        setLoading(false);
        return;
      }

      // Successful login — backend returns token, username, _id
      const { token, username, _id } = data;

      if (!token) {
        toast.error('No token received from server.');
        setLoading(false);
        return;
      }

      // Save token securely for future requests (localStorage for simplicity)
      localStorage.setItem('token', token);
      localStorage.setItem('username', username ?? '');
      if (_id) localStorage.setItem('userId', _id);

      toast.success(`Welcome ${username ?? ''}!`);
      // redirect to profile
      router.push('/profile');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <section className="w-full max-w-sm bg-transparent border border-orange-500/60 p-6 rounded-xl backdrop-blur-sm shadow-lg">
        <h2 className="text-xl font-bold mb-5">Log In</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="mb-4">
            <FloatingLabelInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <FloatingLabelInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="flex items-center gap-2 text-sm">
            {/*<input type="checkbox" className="accent-[#ff4d6d]"/>
            <label>
              Accept{' '}
              <Link href="#" className="underline text-[#ff4d6d]">
                terms & conditions
              </Link>
            </label>*/}

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-orange-500 underline hover:opacity-90"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex place-content-center"><ExGlowButton type="submit" >LOG IN</ExGlowButton></div>


          <div className="border-t border-white/10 pt-4 text-sm text-center text-white/70">
            New here?{' '}
            <Link href="/signup" className="text-orange-500 underline">
              Sign Up!
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
