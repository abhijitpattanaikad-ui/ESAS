// types/landing.ts
export interface Tournament {
  id: string;
  name: string;
  organizer: string;
  date: string;
  prizePool: string;
  participants: number;
  game: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface FeaturedGame {
  id: string;
  name: string;
  image: string;
  alt: string;
  tournamentsCount: number;
}

export interface TrustedPartner {
  id: string;
  name: string;
  logo: string;
  alt: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}