"use client";

import ModernHeader from "@/app/(components)/(layout)/ModernHeader";
import ModernSideNav from "@/app/(components)/(layout)/ModernSideNav";
import Footer from "@/app/(components)/(layout)/Footer";
import React from "react";
import clsx from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // Avoid flash of logged-out UI by waiting for check
  if (isLoggedIn === null) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen text-white">
      <ModernHeader isLoggedIn={isLoggedIn} onMenuToggle={() => setMenuOpen(!menuOpen)} />

      {isLoggedIn && (
        <ModernSideNav visible={menuOpen} onClose={() => setMenuOpen(false)} />
      )}

      {/* Main Content Area: Update padding based on auth state */}
      <main className={clsx(
        "flex-1 pt-[64px] min-h-screen relative transition-all duration-300",
        isLoggedIn ? "lg:pl-[72px]" : "pl-0"
      )}>
        {children}
        <Footer />
      </main>
    </div>
  );
}