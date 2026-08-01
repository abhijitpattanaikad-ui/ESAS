// src\app\(components)\landing\TrustedBy.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ApiBrand } from "@/app/(services)/brandService";
import { buttonStyles, GlassCard, SectionHeading } from "@/components/ui";
import type { Availability } from "./Landing";

type Partner = {
  id: string;
  name: string;
  logo: string;
  alt?: string;
};

interface TrustedByProps {
  initialBrands?: ApiBrand[];
  availability?: Availability;
}

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

export default function TrustedBy({ initialBrands = [], availability = "ready" }: TrustedByProps) {
  const partners = formatPartners(initialBrands);
  const reduceMotion = useReducedMotion();
  const [mediaMounted, setMediaMounted] = useState(false);
  const motionEnabled = mediaMounted && reduceMotion === false;

  useEffect(() => {
    setMediaMounted(true);
  }, []);

  return (
    <section aria-labelledby="trusted-partners-title" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Alongside GoEzPz"
          title={<span id="trusted-partners-title">Trusted partners</span>}
          description="Organizations currently represented in the GoEzPz partner catalogue."
        />

        {availability === "error" ? (
          <GlassCard className="mt-10 text-center">
            <p role="status" className="text-sm text-orange-100/80">
              Partner data is temporarily unavailable.
            </p>
            <Link href="/partners" className={buttonStyles({ variant: "ghost", className: "mt-4" })}>View partner page</Link>
          </GlassCard>
        ) : partners.length === 0 ? (
          <GlassCard className="mt-10 text-center">
            <p className="text-sm text-slate-200/70">No active partners are currently listed.</p>
            <Link href="/partners" className={buttonStyles({ variant: "ghost", className: "mt-4" })}>View partner page</Link>
          </GlassCard>
        ) : (
          <motion.ul
            aria-label="Trusted partners"
            initial={false}
            whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
            transition={motionEnabled ? { duration: 0.45, ease: "easeOut" } : undefined}
            className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:flex-wrap md:justify-center md:overflow-visible md:snap-none"
            viewport={{ once: true, amount: 0.2 }}
          >
            {partners.map((partner) => (
              <GlassCard
                as="li"
                key={partner.id}
                className="flex h-28 w-[62vw] max-w-[240px] shrink-0 snap-center items-center justify-center p-5 md:w-[calc(33.333%_-_0.667rem)] md:max-w-none lg:w-[calc(20%_-_0.8rem)]"
              >
                <PartnerCard partner={partner} />
              </GlassCard>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Image
        src={partner.logo}
        alt={partner.alt ?? partner.name}
        width={160}
        height={70}
        sizes="(max-width: 639px) 55vw, (max-width: 1023px) 30vw, 160px"
        className="max-h-16 w-auto object-contain grayscale opacity-75 transition-[filter,opacity] duration-200 hover:grayscale-0 hover:opacity-100 motion-reduce:transition-none"
      />
    </div>
  );
}
