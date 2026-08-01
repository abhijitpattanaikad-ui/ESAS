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
      <main className={clsx("relative min-h-screen flex-1 pt-[64px] transition-all duration-300", isLoggedIn ? "lg:pl-[72px]" : "pl-0")}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
