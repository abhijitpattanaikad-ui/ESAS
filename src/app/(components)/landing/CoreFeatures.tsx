// src\app\(components)\landing\CoreFeatures.tsx
"use client";

import React from "react";
import Image from "next/image";

// ICONS
import {
  ExIconTeam,
  ExIconTrophy,
  ExIconLeaderboard,
  ExIconPlayerBase,
} from "../ui";

export default function CoreFeatures() {
  const features = [
    {
      id: "feature-1",
      title: "GO SOLO, GO LEGEND",
      description: "Compete in Solo Challenges, rise in the ranks, and show the world what you're made of.",
      icon: <ExIconTeam className="h-10 w-10 md:h-12 md:w-12 text-orange-500" />,
    },
    {
      id: "feature-2",
      title: "COMPETE & WIN REWARDS",
      description: "Earn points, unlock prizes, and stay on top of your game every season.",
      icon: <ExIconTrophy className="h-10 w-10 md:h-12 md:w-12 text-orange-500" />,
    },
    {
      id: "feature-3",
      title: "TRACK YOUR RANK",
      description: "Your stats matter. Keep climbing and dominate the global leaderboard.",
      icon: <ExIconLeaderboard className="h-10 w-10 md:h-12 md:w-12 text-orange-500" />,
    },
    {
      id: "feature-4",
      title: "JOIN A MASSIVE COMMUNITY",
      description: "Connect with thousands of gamers, compete, collaborate, and grow.",
      icon: <ExIconPlayerBase className="h-10 w-10 md:h-12 md:w-12 text-orange-500" />,
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 bg-transparent">
      <div className="container mx-auto px-6 sm:px-8">
        {/* TITLE */}
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-10 md:mb-14">
          <span className="heading-font text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-600 to-red-600">
            CORE FEATURES
          </span>
        </h2>

        {/* === HORIZONTAL FEATURES (TOP ALIGNED) === */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          {features.map((feature, index) => (
            <React.Fragment key={feature.id}>

              {/* FEATURE CARD — always top-aligned */}
              <div className="flex flex-col items-center text-center max-w-[300px] flex-1">

                <div className="mb-3">{feature.icon}</div>

                <h3 className="text-base md:text-lg font-semibold mb-2 leading-tight">
                  {feature.title}
                </h3>

                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* DIVIDER — center vertically ONLY */}
              {/* {index !== features.length - 1 && (
                <div className="flex justify-center self-center px-3">
                  <Image
                    src="/images/divider.png"
                    alt="divider"
                    width={56}
                    height={28}
                    className="opacity-70 object-contain"
                  />
                </div>
              )} */}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}