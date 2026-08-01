import { AnimatedBanner } from "@/components/ui";

export default function HeroSection() {
  return (
    <AnimatedBanner
      title="Your arena. Your legacy."
      subtitle="Discover tournaments, compete with confidence, and make every match count."
      ctaLabel="Explore tournaments"
      href="/tournaments"
      videoSrc="/videos/goezpz-hero.mp4"
      posterSrc="/images/goezpz-hero-poster.webp"
      overlayColor="oklch(0.14 0.025 270)"
    />
  );
}
