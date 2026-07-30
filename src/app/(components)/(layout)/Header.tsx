// src/app/(components)/layout/Header.tsx
"use client";

import { useRouter } from "next/navigation";
import { ExButton, ExIconArrow } from "@/app/(components)/ui";
import { useState, useEffect } from "react";
import ProfileButton from "@/app/(components)/(layout)/ProfileButton";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // --- Authentication State Sync --------------------------------------------
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token"); // aligns with your login page
      setIsLoggedIn(!!token);
    };
    
    // Initial check
    checkLogin();
    
    // Listen for login/logout changes across app & tabs
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);
  
  // --- Actions ---------------------------------------------------------------
  const handleCTAAction = () => router.push("/login");
  
  // const handleProfileClick = () => router.push("/dashboard/profile");
  
  // --- UI -------------------------------------------------------------------
  return (
    <header
      className="fixed top-0 left-0 w-full z-60 bg-[#140e1d]/95 backdrop-blur-sm border-b border-[rgba(255,255,255,0.03)]"
      aria-label="Top navigation"
    >
      <div className="max-w-[1200px] mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link href="/" aria-label="Home" className="block">
          <Image
            src="/images/exLogo.png"
            alt="ExSports Logo"
            width={50}
            height={48}
            priority
            draggable={false}
          />
        </Link>
        <div className="flex items-center">
          {!isLoggedIn ? (
            <>
              {/* Desktop CTA */}
              <div className="hidden md:flex items-center">
                <ExButton
                  onClick={handleCTAAction}
                >
                  LET'S PLAY!
                </ExButton>
              </div>
              
              {/* Mobile CTA */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={handleCTAAction}
                  aria-label="Check In"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-[hsl(var(--color-crimson-500))] shadow-[0_2px_6px_rgba(0,0,0,0.25)] hover:opacity-90 active:scale-95 transition-all"
                >
                  <ExIconArrow className="text-black" />
                </button>
              </div>
            </>
          ) : (
            // Logged-in state — show ProfileButton
            <ProfileButton />
            // <ProfileButton src={user?.avatarUrl ?? undefined} />
          )}
        </div>
      </div>
    </header>
  );
}