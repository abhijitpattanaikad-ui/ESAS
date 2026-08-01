"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AnimatedBannerProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  videoSrc?: string;
  posterSrc: string;
  deadline?: Date | string | number;
  overlayColor?: string;
  className?: string;
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function millisecondsUntil(deadline?: AnimatedBannerProps["deadline"]): number {
  if (deadline === undefined) return 0;
  const end = new Date(deadline).getTime();
  return Number.isNaN(end) ? 0 : Math.max(0, end - Date.now());
}

function splitCountdown(milliseconds: number): CountdownParts {
  const totalSeconds = Math.floor(milliseconds / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Countdown({ deadline }: { deadline: NonNullable<AnimatedBannerProps["deadline"]> }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const initial = millisecondsUntil(deadline);
    setRemaining(initial);
    if (initial === 0) return;

    const interval = window.setInterval(() => {
      const next = millisecondsUntil(deadline);
      setRemaining(next);
      if (next === 0) window.clearInterval(interval);
    }, 1_000);

    return () => window.clearInterval(interval);
  }, [deadline]);

  const parts = useMemo(() => splitCountdown(remaining ?? 0), [remaining]);
  const accessibleTime = remaining === null
    ? "Countdown loading"
    : `${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds remaining`;

  return (
    <div
      className="mt-7"
      role="timer"
      aria-label={accessibleTime}
      aria-live="off"
      aria-busy={remaining === null}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
        Event begins in
      </p>
      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {Object.entries(parts).map(([label, value]) => (
          <span
            key={label}
            className="min-w-16 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-center backdrop-blur-sm"
          >
            <strong className="block text-xl text-white">{String(value).padStart(2, "0")}</strong>
            <span className="text-[0.65rem] uppercase tracking-wider text-white/55">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function AnimatedBanner({
  title,
  subtitle,
  ctaLabel,
  href,
  videoSrc,
  posterSrc,
  deadline,
  overlayColor = "oklch(0.14 0.025 270)",
  className,
}: AnimatedBannerProps) {
  const reduceMotion = useReducedMotion();
  const [mediaMounted, setMediaMounted] = useState(false);
  const [failedVideoSrc, setFailedVideoSrc] = useState<string>();
  const showVideo = mediaMounted && Boolean(videoSrc) && reduceMotion === false && failedVideoSrc !== videoSrc;
  const isInternalDestination = href
    ? href.startsWith("/") && !href.startsWith("//")
    : false;
  const overlay = `linear-gradient(90deg, ${overlayColor} 0%, color-mix(in oklch, ${overlayColor} 94%, transparent) 32%, color-mix(in oklch, ${overlayColor} 64%, transparent) 58%, color-mix(in oklch, ${overlayColor} 16%, transparent) 100%)`;

  useEffect(() => {
    setMediaMounted(true);
  }, []);

  const cta = ctaLabel && href ? (
    isInternalDestination ? (
      <Link href={href} className={buttonStyles({ size: "lg", className: "group w-fit" })}>
        {ctaLabel}
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    ) : (
      <a href={href} className={buttonStyles({ size: "lg", className: "group w-fit" })}>
        {ctaLabel}
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    )
  ) : null;

  return (
    <section
      data-section="hero"
      className={cn(
        "relative isolate min-h-[34rem] w-full overflow-hidden bg-[var(--surface-page)] text-white sm:min-h-[38rem] lg:min-h-[42rem]",
        className,
      )}
      aria-labelledby="platform-hero-title"
    >
      <div className="absolute inset-0 md:left-[34%]" aria-hidden="true">
        <Image
          src={posterSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {showVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={posterSrc}
            aria-hidden="true"
            onError={() => setFailedVideoSrc(videoSrc)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : null}
      </div>

      <div className="absolute inset-0 z-10" style={{ background: overlay }} aria-hidden="true" />
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/55 via-transparent to-black/20 md:bg-transparent" aria-hidden="true" />

      <div className="relative z-20 mx-auto flex min-h-[34rem] w-full max-w-7xl items-end px-5 py-14 sm:min-h-[38rem] sm:px-8 sm:py-18 lg:min-h-[42rem] lg:items-center lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300 sm:text-sm">
            Play <span aria-hidden="true">·</span> Compete <span aria-hidden="true">·</span> Rise
          </p>
          <h1
            id="platform-hero-title"
            className="heading-font max-w-xl text-5xl font-bold leading-[0.96] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl"
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              {subtitle}
            </p>
          ) : null}
          {deadline !== undefined ? <Countdown deadline={deadline} /> : null}
          {cta ? <div className="mt-8">{cta}</div> : null}
        </div>
      </div>
    </section>
  );
}
