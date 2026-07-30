// src/app/(components)/landing/HeroSection.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  staggerContainer,
} from "@/app/(utils)/motionPresets";

import {
  ExIconTeam,
  ExIconTrophy,
  ExIconLeaderboard,
} from "@/app/(components)/ui";
import React from "react";

export default function HeroSection() {
  return (
    <motion.section
      data-section="hero"
      className="relative w-full bg-(image:--hero-bg) bg-cover bg-center bg-no-repeat pt-20 min-[1280px]:pt-0 min-[1600px]:pt-40 min-[1600px]:mt-20 text-white"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="relative z-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
          {/* Left: Character / Visual */}
          <motion.div
            className="relative w-full md:w-1/2 flex justify-center md:justify-start"
            variants={fadeLeft}
            viewport={{ once: true }}
          >
            <div className="relative w-[300px] md:w-[420px] lg:w-[480px] aspect-3/4">
              <Image
                src={HERO_CHARACTER_IMG}
                alt="Esports player character"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-contain md:mt-6 drop-shadow-[0_0_25px_rgba(231,41,64,0.3)]"
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {/* Heading */}
            <motion.h1
              className="heading-font italic lg:text-nowrap text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 heading-font bg-linear-to-r from-orange-400 via-orange-600 to-red-600 bg-clip-text text-transparent"
              variants={fadeUp}
            >
              THE FUTURE OF PLAY
              <span className="text-orange-500">.</span>
            </motion.h1>

            {/* Body Text */}
            <motion.p
              className="text-base sm:text-md text-[hsl(var(--color-woodsmoke-100))] max-w-md mb-10 leading-relaxed body-font"
              variants={fadeUp}
            >
              Step into a world where competition meets creativity. Build your
              legacy, rise through the ranks, and own the future of esports.
            </motion.p>

            {/* Icon Points */}
            <motion.div
              className="flex flex-col gap-6 w-full max-w-sm"
              variants={staggerContainer}
            >
              {[
                {
                  icon: <ExIconTeam className="shrink-0 text-orange-500 size-9" />,
                  text: "Where every gamer rises to new heights.",
                },
                {
                  icon: <ExIconTrophy className="shrink-0 text-orange-500 size-9" />,
                  text: "Compete, evolve, and dominate your digital arena.",
                },
                {
                  icon: <ExIconLeaderboard className="shrink-0 text-orange-500 size-9" />,
                  text: "Your journey to esports greatness starts here.",
                },
              ].map((item, i) => (
                <motion.div key={i} className="flex items-center gap-4" variants={fadeUp}>
                  {item.icon}
                  <p className="text-[hsl(var(--color-woodsmoke-50))] text-base body-font">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* --- DARK GLOBAL OVERLAY (muted background) --- */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] pointer-events-none"></div>

      {/* --- TOP MELT GRADIENT --- */}
      <div className="absolute top-0 z-0 left-0 right-0 h-[160px] bg-linear-to-b from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none"></div>

      {/* --- BOTTOM MELT GRADIENT --- */}
      <div className="absolute bottom-0 z-0 left-0 right-0 h-[200px] bg-linear-to-t from-woodsmoke-950 via-via-woodsmoke-950/60 to-transparent pointer-events-none"></div>
    </motion.section>
  );
}

// -------------------- 🎨 Image Asset References --------------------
const HERO_CHARACTER_IMG = "/images/hero-model.png";