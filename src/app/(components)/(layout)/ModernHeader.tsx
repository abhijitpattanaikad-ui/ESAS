"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";

import ModernProfileButton from "./ModernProfileButton";

interface ModernHeaderProps {
  isLoggedIn?: boolean;
}

const PUBLIC_LINKS = [
  { href: "/tournaments", label: "Tournaments" },
  { href: "/partners", label: "Partners" },
] as const;

export default function ModernHeader({ isLoggedIn }: ModernHeaderProps) {
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setNavigationOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navigationOpen) return;
    firstMobileLinkRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setNavigationOpen(false);
      menuButtonRef.current?.focus();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [navigationOpen]);

  function isCurrent(href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={cn(
        "fixed top-2 right-2 left-2 z-60 h-14 rounded-2xl border border-[var(--border-subtle)] bg-[color-mix(in_oklch,var(--surface-glass)_92%,transparent)] shadow-[var(--shadow-public-card)] backdrop-blur-xl transition-[left] duration-300 sm:top-3 sm:right-3 sm:left-3",
        isLoggedIn && "lg:left-[84px]",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-3 sm:px-4">
        <Link
          href="/"
          aria-label="GoEzPz home"
          className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
        >
          <Image
            src="/images/goezpz-logo.png"
            alt="GoEzPz"
            width={96}
            height={65}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              className={cn(
                buttonStyles({ variant: "ghost", size: "sm" }),
                isCurrent(link.href) && "bg-orange-400/10 text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <ModernProfileButton />
          ) : (
            <>
              <Link href="/login" className={buttonStyles({ variant: "ghost", size: "sm" })}>
                Sign in
              </Link>
              <Link href="/signup" className={buttonStyles({ size: "sm" })}>
                Let&apos;s Play
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          {isLoggedIn ? <ModernProfileButton /> : null}
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open navigation"
            aria-expanded={navigationOpen}
            aria-controls="mobile-public-navigation"
            onClick={() => setNavigationOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
          >
            {navigationOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {navigationOpen ? (
        <nav
          id="mobile-public-navigation"
          aria-label="Mobile navigation"
          className="absolute top-[calc(100%+0.5rem)] right-0 left-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-public-card)] md:hidden"
        >
          <div className="grid gap-1">
            {PUBLIC_LINKS.map((link, index) => (
              <Link
                key={link.href}
                ref={index === 0 ? firstMobileLinkRef : undefined}
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                onClick={() => setNavigationOpen(false)}
                className={cn(
                  buttonStyles({ variant: "ghost", size: "lg", className: "justify-start" }),
                  isCurrent(link.href) && "bg-orange-400/10 text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn ? (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <Link
                  href="/login"
                  onClick={() => setNavigationOpen(false)}
                  className={buttonStyles({ variant: "secondary" })}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setNavigationOpen(false)}
                  className={buttonStyles()}
                >
                  Let&apos;s Play
                </Link>
              </div>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
