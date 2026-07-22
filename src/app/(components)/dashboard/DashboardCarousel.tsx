"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import { ArrowButton } from "./DashboardArrows";
import { ExButton } from "../ui/buttons/ExButton";

const slidesData = [
  { id: 1, src: "/images/dashboard/slide.png", title: "Event 1", tagline: "Quick detail or tagline" },
  { id: 2, src: "/images/dashboard/slide.png", title: "Event 2", tagline: "Quick detail or tagline" },
  { id: 3, src: "/images/dashboard/slide.png", title: "Event 3", tagline: "Quick detail or tagline" },
  { id: 4, src: "/images/dashboard/slide.png", title: "Event 4", tagline: "Quick detail or tagline" },
];

export default function DashboardCarousel() {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  
  /* MAIN SLIDER */
  const [mainRef, mainApi] = useEmblaCarousel(
    { axis: "x", loop: true, align: "center", duration: 100 },
    [Fade(), Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
      const autoplay = mainApi.plugins().autoplay;
      if (autoplay) {
        autoplay.reset();
      }
    },
    [mainApi]
  );
  
  return (
    <div className="h-auto md:h-[60vh] p-5 bg-gray-800/60 rounded-2xl flex flex-col">
      <div className="flex flex-col md:flex-row md:h-full gap-3">
        
        {/* MAIN SLIDER SECTION */}
        <div className="w-full md:flex-4 flex flex-col md:h-full min-w-0">
          
          {/* THE ACTUAL SLIDER BOX */}
          <div className="relative w-full aspect-video md:aspect-auto md:h-full rounded-2xl overflow-hidden ring-1 ring-orange-500 shrink-0">
            <div ref={mainRef} className="h-full w-full">
              <div className="flex h-full">
                {slidesData.map((slide, i) => (
                  <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                    <Image src={slide.src} fill alt={`main-${i}`} className="object-cover" />
                    
                    {/* Desktop Overlay & Content */}
                    {!isMobile && (
                      <>
                        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />
                        <div className="absolute left-6 bottom-12 text-white z-20 flex flex-col items-start max-w-md">
                          <h3 className="text-3xl font-semibold mb-2">{slide.title}</h3>
                          <p className="text-base text-[#CFCFCF] mb-4">{slide.tagline}</p>
                          <ExButton variant="animated">View Event</ExButton>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* MOBILE CONTENT AND ARROWS */}
          {isMobile && (
            <div className="mt-5 flex flex-col w-full">
              <div className="text-white mb-5">
                <h3 className="text-2xl font-semibold mb-2">{slidesData[selectedIndex]?.title}</h3>
                <p className="text-sm text-[#CFCFCF] mb-4">{slidesData[selectedIndex]?.tagline}</p>
                <ExButton variant="animated">View Event</ExButton>
              </div>
              
              <div className="flex items-center">
                <ArrowButton
                  onPrev={() => mainApi?.scrollPrev()}
                  onNext={() => mainApi?.scrollNext()}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* THUMBNAILS LIST (Desktop only) */}
        {!isMobile && (
          <div className="flex-1 relative h-full flex flex-col gap-3 min-w-0">
            {slidesData.map((slide, i) => (
              <div
                key={i}
                onClick={() => onThumbClick(i)}
                className={`
                  relative cursor-pointer shrink-0 rounded-2xl overflow-hidden transition-all duration-300
                  flex-1 w-full
                  ${
                    selectedIndex === i
                      ? "ring-1 ring-orange-500 opacity-100"
                      : "opacity-40 hover:opacity-100"
                  }
                `}
              >
                <Image src={slide.src} fill alt={`thumb-${i}`} className="object-cover" />
              </div>
            ))}
          </div>
        )}
      
      </div>
    </div>
  );
}