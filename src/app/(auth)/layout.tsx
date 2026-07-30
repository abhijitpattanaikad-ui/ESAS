// src/app/(auth)/layout.tsx

import "../globals.css";
import Link from "next/link";
import React from "react";
import type {Metadata} from "next";
import {Toaster} from "sonner";
import Footer from "@/app/(components)/(layout)/Footer";

export const metadata: Metadata = {
  title: "GoEzPz — Login",
  description: "Login and Signup",
};

export default function AuthLayout({children}: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-[90vh] text-white">
        <div className="min-h-screen lg:min-h-auto lg:max-h-[90vh] flex">
          {/* LEFT PANEL */}
          <div className="w-1/2 left-panel relative bg-linear-to-b from-[#1b0620] to-[#140217]">
            <header className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Link href="/"><img src="/images/goezpz-logo.png" alt="GoEzPz" className="h-16 w-auto object-contain"/></Link>
              </div>
              
              <nav className="text-sm mt-1">
                <Link href="/signup" className="mr-4 text-orange-500 underline">Create Account</Link>
                <Link href="/login" className="text-white/90">Login</Link>
              </nav>
            </header>
            
            <main className="flex items-start h-full w-full">
              <div className="w-full h-full flex items-center justify-center">
                {children}
              </div>
            </main>
          </div>
          
          {/* RIGHT PANEL (SQUARE IMAGE) */}
          <div className="w-1/2 hidden lg:flex justify-center items-center">
            <div
              className="aspect-square w-full bg-cover bg-center hero-overlay"
              style={{ backgroundImage: "url('/images/byClient/loginRegister.png')" }}
            />
          </div>
        </div>
      </div>
      
      <Footer/>
    </>
  );
}
