"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ApiGameResponse } from "@/app/(services)/gameService";
import { GlassCard, SectionHeading } from "@/components/ui";
import type { Availability } from "./Landing";

type Game = {
  id: string;
  title: string;
  image?: string;
};

interface FeaturedGamesProps {
  initialGames?: ApiGameResponse[];
  availability?: Availability;
}

const formatGames = (data: ApiGameResponse[]): Game[] => {
  return data.map((item) => ({
    id: item._id,
    title: item.name || "Untitled game",
    image: item.assets?.thumbnail || undefined,
  }));
};

export default function FeaturedGames({ initialGames = [], availability = "ready" }: FeaturedGamesProps) {
  const games = formatGames(initialGames);
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="featured-games-title" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pick your arena"
          title={<span id="featured-games-title">Featured games</span>}
          description="Browse the game catalogue exactly as it is currently available on GoEzPz."
        />

        {availability === "error" ? (
          <GlassCard className="mt-10 text-center">
            <p role="status" className="text-sm text-orange-100/80">
              Game catalogue is temporarily unavailable.
            </p>
          </GlassCard>
        ) : games.length === 0 ? (
          <GlassCard className="mt-10 text-center">
            <p className="text-sm text-slate-200/70">No featured games are available right now.</p>
          </GlassCard>
        ) : (
          <motion.ul
            aria-label="Featured games"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 0.45, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.15 }}
            className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:overflow-visible md:snap-none lg:grid-cols-5"
          >
            {games.map((game) => (
              <GlassCard
                as="li"
                key={game.id}
                className="w-[70vw] max-w-[260px] shrink-0 snap-center p-3 md:w-auto md:max-w-none"
              >
                <GameCard game={game} />
              </GlassCard>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <article>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--surface-elevated)]">
        {game.image ? (
          <Image
            src={game.image}
            alt={`${game.title} artwork`}
            fill
            className="object-cover transition-transform duration-300 motion-reduce:transition-none md:hover:scale-[1.02]"
            sizes="(max-width: 767px) 70vw, (max-width: 1023px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgb(249_115_22_/_0.18),transparent_58%)] px-4 text-center text-slate-300/70">
            <span aria-hidden="true" className="text-4xl font-bold text-orange-200/60">
              {game.title.slice(0, 1).toUpperCase()}
            </span>
            <span className="mt-2 text-xs">Artwork unavailable</span>
          </div>
        )}
      </div>
      <h3 className="px-1 pb-1 pt-4 text-sm font-semibold text-white">{game.title}</h3>
    </article>
  );
}
