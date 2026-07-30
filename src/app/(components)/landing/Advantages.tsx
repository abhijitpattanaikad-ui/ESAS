// src/app/(components)/landing/Advantages.tsx

'use client';

import { motion, easeOut } from 'framer-motion';
import React from 'react';
import { ExGlowButton } from "@/app/(components)/ui";
import { safeExternalUrl } from "@/features/tournaments/content";

// --- Motion Variants (same as TrustedBy) ----------------------------
const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08,
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
};

const handleJoin = () => {
  const link = safeExternalUrl(process.env.NEXT_PUBLIC_DISCORD_LINK);
  if (!link) return;
  const opened = window.open(link, "_blank", "noopener,noreferrer");
  if (opened) opened.opener = null;
};
// --- Component ------------------------------------------------------
export default function Advantages() {
  return (
    <section
      className="relative bg-cover bg-[center_30%] bg-no-repeat"
      style={{ backgroundImage: 'var(--section-bg-advantages)' }}
    >
      <div className="relative z-50">
        <div className="mx-auto container px-6 sm:px-10 lg:px-[120px] py-[100px] flex flex-col items-center text-center">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="mb-8 text-xl md:text-3xl font-bold heading-font"
          >
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-600 to-red-600 uppercase">
              Advantages of Being a Player on Community Gaming
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            viewport={{ once: true }}
            className="text-[#CFCFCF] text-lg md:text-[18px] leading-relaxed max-w-[750px] mx-auto mb-12"
          >
            Ascend in esports on a platform that rewards your skills instantly.
            Explore a variety of free tournaments, connect with a thriving
            community, and monetize your passion.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            viewport={{ once: true }}
          >
            <ExGlowButton onClick={handleJoin} >
              Join Discord
            </ExGlowButton>
          </motion.div>
        </div>
      </div>
      {/* --- DARK GLOBAL OVERLAY (muted background) --- */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] pointer-events-none"></div>

      {/* --- TOP MELT GRADIENT --- */}
      <div className="absolute top-0 z-0 left-0 right-0 h-[40%] bg-linear-to-b from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none"></div>

      {/* --- BOTTOM MELT GRADIENT --- */}
      <div className="absolute bottom-0 z-0 left-0 right-0 h-[40%] bg-linear-to-t from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none"></div>
    </section>
  );
}