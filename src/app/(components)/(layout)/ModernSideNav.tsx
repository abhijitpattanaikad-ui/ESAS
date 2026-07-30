"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard } from "lucide-react";
import { ExIconTrophy } from "@/app/(components)/ui";
import clsx from "clsx";

export default function ModernSideNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar - Visible only on large screens */}
      <aside className={clsx(
        "fixed top-0 left-0 h-screen w-[72px] bg-[#0c0a11] border-r border-white/5 hidden lg:flex flex-col items-center py-4 z-60 transition-transform duration-300 ease-in-out",
      )}>
        {/* Top Logo / Home */}
        <div className="mb-8">
          <Link href="/" className="w-10 h-10 bg-jaffa-500 rounded-lg flex items-center justify-center hover:bg-jaffa-400 transition-colors">
            <Home className="text-white w-6 h-6" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-6 w-full items-center">
          <NavItem icon={<LayoutDashboard className="w-6 h-6" />} active={pathname.startsWith("/dashboard")} href="/dashboard" label="Dashboard" />
          <NavItem icon={<ExIconTrophy className="w-6 h-6" />} active={pathname.startsWith("/tournaments")} href="/tournaments" label="Tournaments" />

          <div className="w-10 h-px bg-white/10 my-2" />
        </nav>
      </aside>

      {/* Mobile Bottom Navigation - Visible only on mobile/tablet */}
      <nav className="fixed bottom-0 left-0 right-0 h-[64px] bg-[#0c0a11]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-60 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <MobileNavItem
          icon={<Home size={22} />}
          active={pathname === "/"}
          href="/"
          label="Home"
        />
        <MobileNavItem
          icon={<LayoutDashboard size={22} />}
          active={pathname.startsWith("/dashboard")}
          href="/dashboard"
          label="Dashboard"
        />
        <MobileNavItem
          icon={<ExIconTrophy className="w-[22px] h-[22px]" />}
          active={pathname.startsWith("/tournaments")}
          href="/tournaments"
          label="Tournaments"
        />
      </nav>
    </>
  );
}

function NavItem({
  icon,
  active,
  href,
  label
}: {
  icon: React.ReactNode;
  active?: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={clsx(
        "w-10 h-10 flex items-center justify-center rounded-xl transition-all relative group",
        active
          ? "bg-white/10 text-white"
          : "text-gray-500 hover:text-white hover:bg-white/5"
      )}
    >
      {active && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 bg-jaffa-500 rounded-r-full" />
      )}
      {icon}
    </Link>
  );
}

function MobileNavItem({
  icon,
  active,
  href,
  label
}: {
  icon: React.ReactNode;
  active?: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
        active ? "text-jaffa-500" : "text-gray-400"
      )}
    >
      <div className={clsx(
        "p-1.5 rounded-lg transition-colors",
        active ? "bg-jaffa-500/10" : "transparent"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
