// src/app/(components)/landing/Advantages.tsx

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button, GlassCard, SectionHeading } from "@/components/ui";
import { safeExternalUrl } from "@/features/tournaments/content";

function openDiscord(link: string) {
  const opened = window.open(link, "_blank", "noopener,noreferrer");
  if (opened) opened.opener = null;
}

export default function Advantages() {
  const reduceMotion = useReducedMotion();
  const discordLink = safeExternalUrl(process.env.NEXT_PUBLIC_DISCORD_LINK);

  return (
    <section
      aria-labelledby="community-cta-title"
      className="relative bg-cover bg-[center_30%] bg-no-repeat py-20 sm:py-24"
      style={{ backgroundImage: "var(--section-bg-advantages)" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--surface-page),rgb(8_12_21_/_0.82),var(--surface-page))]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <GlassCard className="border-orange-300/20 bg-[rgb(16_22_36_/_0.84)] p-6 sm:p-10">
            <SectionHeading
              eyebrow="Community"
              title={<span id="community-cta-title">Make your next move together</span>}
              description="Join the GoEzPz Discord for community announcements and another way to stay close to the competition."
              action={(
                <Button
                  size="lg"
                  disabled={!discordLink}
                  onClick={() => discordLink && openDiscord(discordLink)}
                >
                  {discordLink ? "Join Discord" : "Discord link unavailable"}
                </Button>
              )}
            />
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
