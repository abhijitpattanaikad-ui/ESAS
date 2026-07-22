"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight, LogOut, LayoutDashboard, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { userService } from "@/app/(services)/userService";

export default function ModernProfileButton({ src: initialSrc }: { src?: string | null }) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string>("User");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(initialSrc || null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Try to fetch profile for image
  async function fetchProfile() {
    const data = await userService.getUserProfile();
    if (data && data.profileImage) {
      setAvatarSrc(data.profileImage);
    }
    if (data && data.username) {
      setUsername(data.username);
    }
  }

  useEffect(() => {
    // Get username and avatar from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    
    const storedAvatar = localStorage.getItem("profileImage");
    if (storedAvatar && !avatarSrc) setAvatarSrc(storedAvatar);

    fetchProfile();

    // Listen for custom event to update profile instantly
    const handleUpdate = (e: any) => {
      if (e.detail) {
        if (e.detail.profileImage) {
          setAvatarSrc(e.detail.profileImage);
          localStorage.setItem("profileImage", e.detail.profileImage);
        }
        if (e.detail.username) {
          setUsername(e.detail.username);
          localStorage.setItem("username", e.detail.username);
        }
      }
      fetchProfile();
    };

    window.addEventListener("profileUpdate", handleUpdate as EventListener);
    return () => window.removeEventListener("profileUpdate", handleUpdate as EventListener);
  }, []);

  // close when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !dropdownRef.current.contains(e.target as Node) &&
        !wrapperRef.current?.contains(e.target as Node)
      ) {
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

  const handleLogout = (ev?: React.MouseEvent) => {
    if (ev) ev.stopPropagation();
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    router.push("/");
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Profile Button / Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 cursor-pointer group"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-jaffa-500/20 group-hover:border-jaffa-500 transition-colors relative bg-gray-800">
          <Image
            src={avatarSrc || "/images/byClient/defaultProfile.png"}
            alt="Profile"
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.style.backgroundColor = "#333";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white -z-10">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User Info - Hidden on very small screens */}
        <div className="hidden sm:flex items-center leading-tight flex-nowrap group-hover:text-jaffa-400 transition-colors">
          <span className="text-sm font-semibold text-white group-hover:text-jaffa-400 transition-colors">
            {username}
          </span>
          <ChevronRight size={10} className={open ? "rotate-90 transition-transform" : "transition-transform"} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            ref={dropdownRef}
            className="absolute right-0 mt-4 w-56 bg-[#0c0a11] border border-white/10 rounded-xl shadow-2xl py-2 z-60 backdrop-blur-md"
          >
            <div className="px-4 py-2 border-b border-white/5 mb-2">
              <p className="text-xs text-gray-400">Account</p>
              <p className="text-sm font-medium text-white truncate">
                {username}
              </p>
            </div>

            <DropdownItem
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
              onClick={() => {
                router.push("/dashboard");
                setOpen(false);
              }}
            />

            <DropdownItem
              icon={<Users size={16} />}
              label="My Profile"
              onClick={() => {
                router.push("/profile");
                setOpen(false);
              }}
            />

            <DropdownItem
              icon={<ChevronRight size={16} />}
              label="My Tournaments"
              onClick={() => setOpen(false)}
            />

            <div className="h-px bg-white/5 my-2" />

            <button
              onClick={(e) => handleLogout(e)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
    >
      <span className="text-gray-500 group-hover:text-white">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

