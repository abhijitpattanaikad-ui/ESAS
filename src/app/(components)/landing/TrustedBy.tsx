// src\app\(components)\landing\TrustedBy.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { motion, easeOut } from "framer-motion";
import { ApiBrand, brandService } from "@/app/(services)/brandService";

type Partner = {
  id: string;
  name: string;
  logo: string;
  alt?: string;
};

interface TrustedByProps {
  initialBrands?: ApiBrand[];
}

/* ===========================================================
   BUILD A TRACK LONG ENOUGH FOR TRUE INFINITE SMOOTH LOOP
   (No gaps, no empty space, works with AutoScroll)
=========================================================== */
function buildInfiniteList(list: Partner[]): Partner[] {
  if (!list || list.length === 0) return [];

  const MIN_ITEMS = 20; // enough to saturate UX across wide screens
  const out: Partner[] = [];

  while (out.length < MIN_ITEMS) {
    out.push(...list);
  }

  return out;
}

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, duration: 0.6, ease: easeOut },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

const formatPartners = (data: ApiBrand[]): Partner[] => {
  return data
    .filter((item) => item.isActive)
    .map((item) => ({
      id: item._id,
      name: item.name,
      logo: item.thumbnail,
      alt: item.name,
    }));
};

export default function TrustedBy({ initialBrands = [] }: TrustedByProps) {
  const [rawPartners, setRawPartners] = useState<Partner[]>(formatPartners(initialBrands));
  const [isLoading, setIsLoading] = useState(initialBrands.length === 0);

  useEffect(() => {
    if (initialBrands.length > 0) return;

    const fetchPartners = async () => {
      try {
        const data = await brandService.getAllBrands();
        setRawPartners(formatPartners(data));
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [initialBrands]);

  const partners = buildInfiniteList(rawPartners);

  // Embla continuous auto-scroll (smooth loop)
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
    },
    [
      AutoScroll({
        speed: 0.35, // Premium smooth speed as requested
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    ]
  );

  return (
    <section className="relative py-16 bg-transparent overflow-hidden">

      <motion.div
        className="container mx-auto px-4 text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <h2 className="mb-12 text-xl md:text-3xl font-bold heading-font">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-600 to-red-600">
            TRUSTED BY
          </span>
        </h2>

        <div className="relative">

          {/* Mask: Left */}
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 z-10 pointer-events-none bg-linear-to-r from-woodsmoke-950 to-transparent to-70%" />

          {/* Mask: Right */}
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 z-10 pointer-events-none bg-linear-to-l from-woodsmoke-950 to-transparent to-70%" />

          {/* EMBLA VIEWPORT */}
          {!isLoading && partners.length > 0 && (
            <div ref={emblaRef} className="overflow-hidden relative z-0">
              <div className="flex will-change-transform">
                {partners.map((partner, index) => (
                  <motion.div
                    key={`${partner.id}-${index}`}
                    variants={itemVariants}
                    className="
                      shrink-0 px-4 py-4
                      min-w-[35%] sm:min-w-[25%] md:min-w-[20%] lg:min-w-[16%]
                    "
                  >
                    <PartnerCard partner={partner} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </section>
  );
}

/* ------------------ PARTNER CARD ------------------ */
function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div
      className="
        h-20 sm:h-24 md:h-20
        flex items-center justify-center
        shadow-inner
        hover:scale-[1.03] hover:brightness-110
        transition-transform duration-300
      "
    >
      <div className="w-32 sm:w-36 md:w-32 relative">
        <Image
          src={partner.logo}
          alt={partner.alt ?? partner.name}
          width={160}
          height={70}
          className="object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
        />
      </div>
    </div>
  );
}