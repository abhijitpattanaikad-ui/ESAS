// src/app/(components)/(layout)/ProfileButton.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { clearAuthStorage } from "@/lib/auth/storage";


export default function ProfileButton({ src }: { src?: string | null }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  
  // close when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node) && !wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, []);
  
  // keyboard: ESC closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  
  // Toggle handler passed to ProfileFrame
  const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpen((p) => !p);
  };
  
  // Ripple utility for dropdown items
  const createRipple = (ev: React.MouseEvent<HTMLElement>) => {
    const target = ev.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement("span");
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${ev.clientX - rect.left - radius}px`;
    circle.style.top = `${ev.clientY - rect.top - radius}px`;
    circle.className = "ripple-effect absolute rounded-full opacity-70 pointer-events-none transform scale-0";
    
    // ensure the parent is positioned
    target.style.position = target.style.position || "relative";
    target.appendChild(circle);
    
    // animate via CSS
    requestAnimationFrame(() => {
      circle.classList.add("ripple-animate");
    });
    
    // cleanup
    setTimeout(() => {
      circle.remove();
    }, 600);
  };
  
  const handleLogout = (ev?: React.MouseEvent) => {
    if (ev) ev.stopPropagation();
    clearAuthStorage(localStorage);
    window.dispatchEvent(new Event("storage"));
    router.push("/");
    setOpen(false);
  };
  
  return (
    <div className="relative" ref={wrapperRef}>
      <div className="cursor-pointer inline-block w-10 h-10 relative rounded-full overflow-hidden border border-[#6C0D0D]/50 bg-[#100707]" onClick={handleToggle}>
        <img
          src={src || "/images/byClient/defaultProfile.png"}
          alt="Profile"
          className="object-cover w-full h-full"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.style.backgroundColor = "#333";
          }}
        />
      </div>
      
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            ref={dropdownRef}
            className="
              absolute right-0 mt-3 w-48 rounded-xl bg-[#100707]
              border border-[#6C0D0D]/50 shadow-[0_0_20px_rgba(239,66,66,0.25)]
              overflow-hidden z-50
            "
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                createRipple(e);
                router.push("/dashboard");
                setOpen(false);
              }}
              className="block w-full text-left px-5 py-3 text-sm text-gray-200 hover:bg-[#1A0B0B] relative overflow-hidden cursor-pointer"
            >
              Dashboard
            </button>
            
            <div className="h-[1px] bg-[#6C0D0D]/40" />
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                createRipple(e);
                handleLogout(e);
              }}
              className="block w-full text-left px-5 py-3 text-sm text-[#EF4242] hover:bg-[#1A0B0B] relative overflow-hidden cursor-pointer"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Minimal ripple CSS injected as inline style block (so you don't need external css) */}
      <style jsx>{`
        .ripple-effect {
          background: rgba(255, 255, 255, 0.12);
          transform-origin: center;
        }
        .ripple-animate {
          animation: rippleGrow 480ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes rippleGrow {
          from {
            transform: scale(0);
            opacity: 0.6;
          }
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
