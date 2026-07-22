"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Zap, MessageSquare, Menu, LayoutDashboard, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExButton, ExGlowButton } from "@/app/(components)/ui";
import clsx from "clsx";
import ModernProfileButton from "./ModernProfileButton";

interface ModernHeaderProps {
  onMenuToggle?: () => void;
  isLoggedIn?: boolean;
}

export default function ModernHeader({ onMenuToggle, isLoggedIn }: ModernHeaderProps) {
  const router = useRouter();

  const handleLogin = () => router.push("/login");

  return (
    <header className={clsx(
      "fixed top-0 right-0 h-[64px] bg-[#0c0a11] border-b border-white/5 flex items-center px-4 lg:px-6 z-60 transition-all duration-300 max-w-[100vw]",
      isLoggedIn ? "left-0 lg:left-[72px] justify-between lg:justify-end" : "left-0 justify-between"
    )}>

      {/* Brand Logo - Moved to left corner on mobile */}
      {!isLoggedIn ? (
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/exLogo.png" alt="logo" width={40} height={40} className="object-contain" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/exLogo.png" alt="logo" width={32} height={32} className="object-contain lg:hidden" />
          </Link>
        </div>
      )}

      {/* Mobile Burger Menu - Hidden if Bottom Nav is used, or repositioned */}
      {/* {isLoggedIn && (
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
      )} */}

      {/* Actions Area */}
      <div className="flex items-center gap-4 lg:gap-6 h-full">

        {isLoggedIn ? (
          <>
            {/* Activity / Lightning */}
            {/* <button className="relative text-gray-400 hover:text-white transition-colors">
              <Zap size={20} />
              <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1 rounded-sm border border-[#0c0a11]">
                5
              </span>
            </button> */}

            {/* Messages */}
            {/* <button className="text-gray-400 hover:text-white transition-colors">
              <MessageSquare size={20} />
            </button> */}

            {/* Vertical Divider */}
            <div className="w-px h-8 bg-white/10 mx-2 hidden sm:block" />
            
            {/* User Profile */}
            <ModernProfileButton />
          </>
        ) : (
          <ExGlowButton onClick={handleLogin}>
            LET'S PLAY!
          </ExGlowButton>
        )}

      </div>
    </header>
  );
}

function InlineUserMenu() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial load
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    const handleStorage = () => {
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("click", handler);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    router.push("/");
    setOpen(false);
  };

  const displayInitial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-full bg-gray-800 border-2 border-jaffa-500/20 group-hover:border-jaffa-500 transition-colors flex items-center justify-center text-xs font-bold text-white">
          {displayInitial}
        </div>
        <ChevronRight size={10} className={open ? "rotate-90 transition-transform text-gray-400" : "transition-transform text-gray-400"} />
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-48 bg-[#0c0a11] border border-white/10 rounded-xl shadow-2xl py-2 z-60">
          <button
            onClick={() => { router.push("/dashboard"); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>
          <div className="h-px bg-white/5 my-2" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}