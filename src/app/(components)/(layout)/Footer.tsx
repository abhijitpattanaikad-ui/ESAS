// src/app/(components)/(layout)/Footer.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui";

// Importing icons from UI index
import {
  ExIconFacebook,
  ExIconInstagram,
  ExIconTwitter,
  ExIconYoutube,
  ExIconTiktok,
  ExIconDiscord,
  ExIconTwitch,
} from "@/app/(components)/ui";

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  label: string;
  icon: ReactNode;
  href: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const NAV_LINKS: Record<string, FooterLink[]> = {
    EXPLORE: [
      { name: "Tournaments", href: "/tournaments" },
      // { name: "Leaderboard", href: "/leaderboard" },
      // { name: "FAQ", href: "/faq" },
      // { name: "Player", href: "/player" },
      // { name: "Organizer", href: "/organizer" },
    ],
    POLICIES: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
    ABOUT: [
      { name: "Our Partners", href: "/partners" },
      { name: "Contact Us", href: "mailto:support@xesports.pro", external: true },
      // { name: "Media Kit", href: "/media-kit" },
    ],
  };

  // Replaced Lucide with your custom SVG icon components
  const SOCIAL_LINKS: SocialLink[] = [
    { label: "Facebook", icon: <ExIconFacebook className="w-5 h-5" />, href: "https://www.facebook.com/share/17ae3WQ9zG/" },
    { label: "Twitch", icon: <ExIconTwitch className="w-5 h-5" />, href: "https://www.twitch.tv/xesportsofficial" },
    { label: "Discord", icon: <ExIconDiscord className="w-5 h-5" />, href: "https://discord.gg/GASjCXub" },
    { label: "Instagram", icon: <ExIconInstagram className="w-5 h-5" />, href: "https://www.instagram.com/_xesports_/" },
    { label: "X", icon: <ExIconTwitter className="w-5 h-5" />, href: "https://x.com/Xesports_" },
    { label: "YouTube", icon: <ExIconYoutube className="w-5 h-5" />, href: "https://www.youtube.com/@xesports_official" },
    { label: "TikTok", icon: <ExIconTiktok className="w-5 h-5" />, href: "https://www.tiktok.com/@_xesports" },
  ];

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-woodsmoke-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <GlassCard className="p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] lg:gap-8">
            <div>
              <Link href="/" aria-label="GoEzPz home" className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300">
                <Image
                  src="/images/goezpz-logo.png"
                  alt="GoEzPz"
                  width={372}
                  height={250}
                  priority
                  draggable={false}
                  className="h-auto w-28 object-contain"
                />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-200/75">
                A home for competitive play, built for players and the communities that support them.
              </p>
            </div>

            {Object.entries(NAV_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
                  {heading}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="rounded-sm text-sm text-slate-200/75 transition-colors hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-col items-center justify-between gap-5 px-2 pb-12 pt-6 text-center md:flex-row md:pb-2 md:text-left">
          <p className="text-sm text-slate-200/75">
            © {currentYear} - GoEzPz by Techxhub - All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-3" aria-label="GoEzPz social media">
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit GoEzPz on ${label}`}
                className="rounded-full border border-[var(--border-subtle)] p-2.5 text-slate-100 transition-colors hover:border-orange-300/50 hover:bg-orange-300/10 hover:text-orange-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
