"use client";

import clsx from "clsx";
import Footer from "@/app/(components)/(layout)/Footer";
import ModernHeader from "@/app/(components)/(layout)/ModernHeader";
import ModernSideNav from "@/app/(components)/(layout)/ModernSideNav";

export default function SiteShell({ children, isLoggedIn }: { children: React.ReactNode; isLoggedIn: boolean }) {
  return (
    <div className="min-h-screen text-white">
      <ModernHeader isLoggedIn={isLoggedIn} />
      {isLoggedIn ? <ModernSideNav /> : null}
      <div className={clsx("min-w-0 transition-all duration-300", isLoggedIn ? "lg:pl-[72px]" : "pl-0")}>
        <main className="relative min-h-screen flex-1 pt-[64px]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
