"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight, LogOut, LayoutDashboard, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { userService } from "@/app/(services)/userService";

export default function ModernProfileButton({ src: initialSrc }: { src?: string | null }) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("Player");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(initialSrc ?? null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  async function fetchProfile() {
    const data = await userService.getUserProfile();
    if (data?.profileImage) setAvatarSrc(data.profileImage);
    if (data?.username) setUsername(data.username);
  }

  useEffect(() => {
    void fetchProfile();
    const handleUpdate = () => void fetchProfile();
    window.addEventListener("profileUpdate", handleUpdate);
    return () => window.removeEventListener("profileUpdate", handleUpdate);
  }, []);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node) && !wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    window.addEventListener("click", onDocumentClick);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("click", onDocumentClick); window.removeEventListener("keydown", onKey); };
  }, []);

  async function handleLogout(event: React.MouseEvent) {
    event.stopPropagation();
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    setOpen(false);
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="group flex items-center gap-3" aria-haspopup="menu" aria-expanded={open} aria-label="Open account menu">
        <span className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-jaffa-500/20 bg-gray-800 transition-colors group-hover:border-jaffa-500">
          <Image src={avatarSrc || "/images/byClient/defaultProfile.png"} alt="" fill className="object-cover" />
        </span>
        <span className="hidden items-center leading-tight sm:flex">
          <span className="text-sm font-semibold text-white transition-colors group-hover:text-jaffa-400">{username}</span>
          <ChevronRight size={10} className={open ? "rotate-90 transition-transform" : "transition-transform"} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            role="menu"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="absolute right-0 z-60 mt-4 w-56 rounded-xl border border-white/10 bg-[#0c0a11] py-2 shadow-2xl backdrop-blur-md"
          >
            <div className="mb-2 border-b border-white/5 px-4 py-2"><p className="text-xs text-gray-400">Account</p><p className="truncate text-sm font-medium text-white">{username}</p></div>
            <MenuItem icon={<LayoutDashboard size={16} />} label="Dashboard" onClick={() => { router.push("/dashboard"); setOpen(false); }} />
            <MenuItem icon={<Users size={16} />} label="My Profile" onClick={() => { router.push("/profile"); setOpen(false); }} />
            <div className="my-2 h-px bg-white/5" />
            <button role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"><LogOut size={16} /><span>Logout</span></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button role="menuitem" onClick={onClick} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white">{icon}<span>{label}</span></button>;
}
