// src/app/(components)/(layout)/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const NAV_LINKS = {
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
  const SOCIAL_LINKS = [
    { icon: <ExIconFacebook className="w-5 h-5" />, href: "https://www.facebook.com/share/17ae3WQ9zG/" },
    { icon: <ExIconTwitch className="w-5 h-5" />, href: "https://www.twitch.tv/xesportsofficial" },
    { icon: <ExIconDiscord className="w-5 h-5" />, href: "https://discord.gg/GASjCXub" },
    { icon: <ExIconInstagram className="w-5 h-5" />, href: "https://www.instagram.com/_xesports_/" },
    { icon: <ExIconTwitter className="w-5 h-5" />, href: "https://x.com/Xesports_" },
    { icon: <ExIconYoutube className="w-5 h-5" />, href: "https://www.youtube.com/@xesports_official" },
    { icon: <ExIconTiktok className="w-5 h-5" />, href: "https://www.tiktok.com/@_xesports" },
  ];

  return (
    <footer className="text-white">
      {/* Top Section */}
      <div className="bg-linear-to-b from-[#1A0924] to-[#140009]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12 md:py-16">

          {/* Desktop Layout */}
          <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-x-12">
            <div>
              <Link href="/" aria-label="Home" className="block mb-5">
                <Image
                  src="/images/exLogo.png"
                  alt="ExSports Logo"
                  width={110}
                  height={108}
                  priority
                  draggable={false}
                />
              </Link>
            </div>

            {Object.entries(NAV_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide">
                  {heading}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        target={(link as any).external ? "_blank" : undefined}
                        rel={(link as any).external ? "noopener noreferrer" : undefined}
                        className="text-[#CFCFCF] text-sm hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden flex flex-col items-start">
            <Image
              src="/images/exLogo.png"
              alt="ExSports Logo"
              width={90}
              height={90}
              priority
              draggable={false}
              className="mb-8"
            />

            <div className="grid grid-cols-3 gap-y-6 gap-x-6 w-full">
              {Object.entries(NAV_LINKS).map(([heading, links]) => (
                <div key={heading}>
                  <h4 className="text-[12px] font-semibold mb-2 uppercase tracking-wide">
                    {heading}
                  </h4>
                  <ul className="space-y-1.5">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          target={(link as any).external ? "_blank" : undefined}
                          rel={(link as any).external ? "noopener noreferrer" : undefined}
                          className="text-[#CFCFCF] text-[13px] hover:text-white transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#120621]">
        <div className="
          container mx-auto
          flex flex-col md:flex-row
          justify-between items-center
          gap-6 px-6 sm:px-10 lg:px-16 py-5 pb-20 md:pb-5
        ">
          <p className="text-[#CFCFCF] text-sm">
            © {currentYear} - XeSports by Techxhub - All rights reserved.
          </p>

          <div className="flex gap-6">
            {SOCIAL_LINKS.map(({ icon, href }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CFCFCF] hover:text-orange-500 transition-colors"
                whileHover={{ scale: 1.15 }}
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