"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ExGlowButton } from "@/app/(components)/ui";
import ModernProfileButton from "./ModernProfileButton";

interface ModernHeaderProps { isLoggedIn?: boolean }

export default function ModernHeader({ isLoggedIn }: ModernHeaderProps) {
  const router = useRouter();
  return (
    <header className={clsx("fixed top-0 right-0 z-60 flex h-[64px] max-w-[100vw] items-center border-b border-white/5 bg-[#0c0a11] px-4 transition-all duration-300 lg:px-6", isLoggedIn ? "left-0 justify-between lg:left-[72px] lg:justify-end" : "left-0 justify-between")}>
      <div className={isLoggedIn ? "flex items-center lg:hidden" : "flex items-center"}>
        <Link href="/" aria-label="XeSports home"><Image src="/images/exLogo.png" alt="XeSports" width={isLoggedIn ? 32 : 40} height={isLoggedIn ? 32 : 40} className="object-contain" /></Link>
      </div>
      <div className="flex h-full items-center gap-4 lg:gap-6">
        {isLoggedIn ? <><div className="mx-2 hidden h-8 w-px bg-white/10 sm:block" /><ModernProfileButton /></> : <ExGlowButton onClick={() => router.push("/login")}>LET&apos;S PLAY!</ExGlowButton>}
      </div>
    </header>
  );
}
