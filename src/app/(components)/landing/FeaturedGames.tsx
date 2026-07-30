"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ApiGameResponse, gameService } from "@/app/(services)/gameService";

type Game = {
  id: string;
  title: string;
  image: string;
};

interface FeaturedGamesProps {
  initialGames?: ApiGameResponse[];
}

const formatGames = (data: ApiGameResponse[]): Game[] => {
  return data.map((item) => ({
    id: item._id || Math.random().toString(),
    title: item.name || "Unknown Game",
    image: item.assets?.thumbnail || "/images/games/valorant1.jpg", // fallback
  }));
};

export default function FeaturedGames({ initialGames = [] }: FeaturedGamesProps) {
  const [rawGames, setRawGames] = useState<Game[]>(formatGames(initialGames));
  const [isLoading, setIsLoading] = useState(initialGames.length === 0);

  useEffect(() => {
    if (initialGames.length > 0) return;

    const fetchGames = async () => {
      try {
        const data = await gameService.getAllGames();
        setRawGames(formatGames(data));
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [initialGames]);

  const autoplay = React.useMemo(
    () =>
      Autoplay({
        delay: 1800,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      dragFree: true,
      skipSnaps: false,
    },
    [autoplay]
  );

  /* INTERNAL DUPLICATION: Enough slides for smooth loop */
  const MIN_SLIDES = 14;
  const slides = React.useMemo(() => {
    if (!rawGames || rawGames.length === 0) return [];
    if (rawGames.length >= MIN_SLIDES) return rawGames;
    const out = [...rawGames];
    while (out.length < MIN_SLIDES) out.push(...rawGames);
    return out.slice(0, MIN_SLIDES);
  }, [rawGames]);

  return (
    <div className="w-full relative flex justify-center py-16">
      {/* Wrap with vendor layout CSS variables */}
      <div
        className=" featured-embla w-full container mx-auto px-4"
        style={
          {
            "--slide-size": "171px", // PERFECT 7 CARDS
            "--slide-spacing": "1rem",
          } as React.CSSProperties
        }
      >
        <h2 className="mb-12 text-2xl md:text-3xl font-bold heading-font text-center">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-600 to-red-600">
            FEATURED GAMES
          </span>
        </h2>

        <div className="relative">

          {/* LEFT MASK */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 lg:w-20 z-20"
            style={{
              background:
                "linear-gradient(90deg, rgba(28,21,39,1) 0%, rgba(28,21,39,0) 100%)",
            }}
          />

          {/* RIGHT MASK */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 lg:w-20 z-20"
            style={{
              background:
                "linear-gradient(270deg, rgba(28,21,39,1) 0%, rgba(28,21,39,0) 100%)",
            }}
          />

          {/* EMBLA VIEWPORT */}
          {!isLoading && slides.length > 0 && (
            <div ref={emblaRef} className="embla__viewport overflow-hidden">
              <div className="embla__container touch-pan-y group">
                {slides.map((game, idx) => (
                  <div className="embla__slide" key={`${game.id}-${idx}`}>
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* CARD */
function GameCard({
  game,
}: {
  game: Game;
}) {
  return (
    <div
      className="
        game-card
        relative rounded-[16px]
        h-[150px] sm:h-[180px] md:h-[190px] lg:h-[190px]

        border border-orange-600/80 hover:border-orange-400
        transition-all duration-200
        overflow-hidden

        card-hover-blur
        card-dim
        card-focus-glow
      "
    >
      <Image
        src={game.image}
        alt={game.title}
        fill
        className="object-cover"
        sizes="171px"
      />

      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-linear-to-t from-black/70 via-black/30 to-transparent
          p-1.5 text-[10px] text-center text-white
        "
      >
        {game.title}
      </div>
    </div>
  );
}